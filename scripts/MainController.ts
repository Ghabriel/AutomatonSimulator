/// <reference path="types.ts" />

import {AutomatonRenderer} from "./interface/AutomatonRenderer"
import {EdgeUtils} from "./EdgeUtils"
import {Memento} from "./Memento"
import {PersistenceHandler} from "./persistence/PersistenceHandler"
import {Settings, Strings} from "./Settings"
import {Signal, SignalEmitter, SignalResponse} from "./SignalEmitter"
import {System} from "./System"
import {utils} from "./Utils"

/**
 * Controls the main area of the application. Interacts with a renderer
 * (which is an AutomatonRenderer), handles persistence, enables undo/redo
 * of actions and interacts with a Controller.
 */
export class MainController {
	constructor(renderer: AutomatonRenderer, memento: Memento<string>,
				persistenceHandler: PersistenceHandler) {

		this.renderer = renderer;
		this.memento = memento;
		this.persistenceHandler = persistenceHandler;

		renderer.setController(this);
		SignalEmitter.addSignalObserver(this);

		System.addLanguageChangeObserver({
			onLanguageChange: function() {
				renderer.onLanguageChange();
			}
		});

		System.addMachineChangeObserver({
			onMachineChange: function() {
				renderer.onMachineChange();
			}
		});
	}

	public receiveSignal(signal: Signal): SignalResponse|null {
		if (signal.targetID == Settings.mainControllerSignalID) {
			let methodName = <keyof this> signal.identifier;
			let method = <Function> <any> this[methodName];

			return {
				reacted: true,
				response: method.apply(this, signal.data)
			};
		}

		return null;
	}

	public clear(): void {
		this.stateList = {};
		this.edgeList = {};
		this.initialState = null;

		this.renderer.clear();
		Settings.controller().clear();
	}

	public empty(): boolean {
		// Doesn't need to check for edgeList.length since edges
		// can't exist without states.
		return Object.keys(this.stateList).length == 0;
	}

	public save(): string {
		return this.persistenceHandler.save(this.stateList,
					this.edgeList, this.initialState);
	}

	public load(content: string): void {
		this.internalLoad(content);
		this.pushState();
	}

	public undo(): void {
		let data = this.memento.undo();
		if (data) {
			this.clearAndLoad(data);
		}
	}

	public redo(): void {
		let data = this.memento.redo();
		if (data) {
			this.clearAndLoad(data);
		}
	}

	// ------------------- Forwarders ---------------------
	public recognitionHighlight(states: string[]): void {
		this.renderer.recognitionHighlight(states);
	}

	public recognitionDim(): void {
		this.renderer.recognitionDim();
	}

	public lock(): void {
		this.renderer.lock();
	}

	public unlock(): void {
		this.renderer.unlock();
	}

	public stateManualCreation(): void {
		this.renderer.stateManualCreation();
	}

	public edgeManualCreation(): void {
		this.renderer.edgeManualCreation();
	}

	// ------------------- Creation ---------------------
	public createState(externalState: State): void {
		let state = this.cleanup(externalState);

		if (this.empty()) {
			// The first state should be initial
			state.initial = true;
			this.initialState = state;
		}

		this.stateList[state.name] = state;
		this.renderer.createState(state);
		Settings.controller().createState(state);
	}

	public createEdge<T extends State, TEdge extends Edge<T>>(edge: TEdge): void {
		let {origin, target} = edge;

		if (!this.edgeList.hasOwnProperty(origin.name)) {
			this.edgeList[origin.name] = {};
		}

		this.edgeList[origin.name][target.name] = edge;
		this.renderer.createEdge(edge);

		for (let dataList of edge.dataList) {
			this.internalCreateTransition(origin, target, dataList);
		}
	}

	public internalCreateTransition(origin: State, target: State, data: string[]): void {
		let controller = Settings.controller();
		Settings.controller().createTransition(origin, target, data);
	}

	// ------------------- Edition: states ---------------------
	public renameState(externalState: State, newName: string): boolean {
		if (this.stateExists(newName)) {
			return false;
		}

		let state = this.internal(externalState);

		delete this.stateList[state.name];
		this.stateList[newName] = state;

		state.name = newName;

		// Must use the external state here, since the internal one
		// has already been updated (which would cause the renderer
		// to not find it)
		this.renderer.renameState(externalState, newName);
		Settings.controller().renameState(state, newName);
		return true;
	}

	public toggleInitialFlag(externalState: State): void {
		let state = this.internal(externalState);

		if (state == this.initialState) {
			state.initial = false;
			this.initialState = null;
		} else {
			if (this.initialState) {
				this.initialState.initial = false;
				Settings.controller().changeInitialFlag(this.initialState);
			}

			state.initial = true;
			this.initialState = state;
		}

		this.renderer.toggleInitialFlag(state);
		Settings.controller().changeInitialFlag(state);
	}

	public toggleFinalFlag(externalState: State): void {
		let state = this.internal(externalState);
		state.final = !state.final;
		this.renderer.toggleFinalFlag(state);
		Settings.controller().changeFinalFlag(state);
	}

	// ------------------- Edition: edges/transitions ---------------------
	public changeTransitionData<T extends State, TEdge extends Edge<T>>
		(edge: TEdge, transitionIndex: number, newData: string[],
		newText: string): void {

		let {origin, target, dataList, textList} = edge;

		let controller = Settings.controller();
		controller.deleteTransition(origin, target, dataList[transitionIndex]);

		dataList[transitionIndex] = newData;
		textList[transitionIndex] = newText;
		controller.createTransition(origin, target, newData);

		this.renderer.refresh(edge);
	}

	// ------------------- Deletion ---------------------
	public deleteState(state: State): void {
		if (!this.stateExists(state.name)) {
			return;
		}

		if (this.stateList[state.name] != state) {
			return;
		}

		EdgeUtils.edgeIteration(this.edgeList, (edge) => {
			let {origin, target} = edge;

			if (origin == state || target == state) {
				this.internalDeleteEdge(edge);
			}
		});

		delete this.stateList[state.name];

		this.renderer.deleteState(state);
		Settings.controller().deleteState(state);
	}

	public deleteTransition<T extends State, TEdge extends Edge<T>>
		(edge: TEdge, transitionIndex: number): void {

		let {origin, target, dataList, textList} = edge;

		let controller = Settings.controller();
		controller.deleteTransition(origin, target, dataList[transitionIndex]);

		dataList.splice(transitionIndex, 1);
		textList.splice(transitionIndex, 1);

		if (dataList.length == 0) {
			this.deleteEdge(edge);
		} else {
			this.renderer.refresh(edge);
		}
	}

	public deleteEdge<T extends State, TEdge extends Edge<T>>(edge: TEdge): void {
		this.internalDeleteEdge(edge);

		this.renderer.deleteEdge(edge);

		let {origin, target, dataList} = edge;
		let controller = Settings.controller();

		for (let data of dataList) {
			controller.deleteTransition(origin, target, data);
		}
	}

	public internalDeleteEdge<T extends State, TEdge extends Edge<T>>(edge: TEdge): void {
		if (!this.edgeList.hasOwnProperty(edge.origin.name)) {
			return;
		}

		delete this.edgeList[edge.origin.name][edge.target.name];
	}

	// ------------------- Event listeners ---------------------
	/**
	 * Returns a function that is called when the formal definition
	 * of the current machine changes (i.e. when it's edited). If it
	 * returns false, the renderer ignores this event.
	 * @return {Generator<boolean>} the listener function
	 */
	public getFormalDefinitionCallback(): Generator<boolean> {
		return () => {
			if (this.loadingMode) {
				return false;
			}

			if (!this.frozenMemento) {
				this.pushState();
			}

			return true;
		};
	}

	/**
	 * Called after a state stops being dragged.
	 */
	public onStateDrag(): void {
		// Saves the post-drag state to the memento
		// to allow the user to undo it
		this.pushState();
	}


	private pushState(): void {
		this.memento.push(this.save());
	}

	private clearAndLoad(data: string): void {
		this.frozenMemento = true;
		this.clear();
		this.frozenMemento = false;

		this.internalLoad(data);
	}

	private stateExists(name: string): boolean {
		return this.stateList.hasOwnProperty(name);
	}

	private internalLoad(content: string): void {
		// Blocks formal definition change events
		this.loadingMode = true;

		// Blocks changes to the memento until the load process is complete
		this.frozenMemento = true;

		let loadedData = this.persistenceHandler.load(content);
		if (loadedData.error) {
			alert(Strings.INVALID_FILE);
			this.loadingMode = false;
			this.frozenMemento = false;
			return;
		}

		if (loadedData.aborted) {
			this.loadingMode = false;
			this.frozenMemento = false;
			return;
		}

		// TODO
		// this.stateList = this.stateList.concat(loadedData.stateList);
		// this.edgeList = this.edgeList.concat(loadedData.edgeList);

		this.stateList = loadedData.stateList;
		this.edgeList = loadedData.edgeList;

		// TODO
		// // Only changes the initial state if the current automaton
		// // doesn't have one
		// if (this.initialState === null) {
		// 	this.initialState = loadedData.initialState;
		// }

		this.initialState = loadedData.initialState;

		// We shouldn't render states and edges during creation because,
		// if the automaton is big enough and there's an error in the
		// source file, the user would see states and edges appearing
		// and then vanishing, then an error message. Rendering everything
		// after processing makes it so that nothing appears (except the
		// error message) if there's an error.
		this.renderer.setStateList(this.stateList);
		this.renderer.setEdgeList(this.edgeList);

		this.loadingMode = false;
		this.renderer.triggerFormalDefinitionChange();
		this.frozenMemento = false;
	}

	private internal(state: State): State;
	private internal<T extends State>(edge: Edge<T>): Edge<T>;
	private internal<T extends State>(entity: State|Edge<T>): State|Edge<T>;
	private internal(entity: any): any {
		if (entity.type == "state") {
			return this.stateList[entity.name];
		} else {
			return this.edgeList[entity.origin.name][entity.target.name];
		}
	}

	// Removes all unnecessary properties
	private cleanup(state: State): State;
	private cleanup<T extends State>(state: Edge<T>): Edge<T>;
	private cleanup<T extends State>(entity: State|Edge<T>): any {
		if (entity.type == "state") {
			return {
				x: entity.x,
				y: entity.y,
				initial: entity.initial,
				final: entity.final,
				name: entity.name,
				type: entity.type
			};
		} else {
			return {
				origin: this.cleanup(entity.origin),
				target: this.cleanup(entity.target),
				textList: utils.cloneArray(entity.textList),
				dataList: utils.cloneArray(entity.dataList),
				type: entity.type
			};
		}
	}

	private memento: Memento<string>;
	private persistenceHandler: PersistenceHandler;
	private renderer: AutomatonRenderer;

	// Internal automaton structures
	private stateList: Map<State> = {};
	private edgeList: IndexedEdgeGroup<Edge<State>> = {};

	private initialState: State|null = null;

	private frozenMemento: boolean = false;
	private loadingMode: boolean = false;
}
