/// <reference path="types.ts" />

import {AutomatonRenderer} from "./interface/AutomatonRenderer"
import {EdgeUtils} from "./EdgeUtils"
import {Memento} from "./Memento"
import {PersistenceHandler} from "./persistence/PersistenceHandler"
import {Settings, Strings} from "./Settings"
import {Signal, SignalEmitter, SignalResponse} from "./SignalEmitter"
import {System} from "./System"

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
		this.memento.push(this.save());
	}

	public getFormalDefinitionCallback(): Generator<boolean> {
		let self = this;
		return function() {
			if (self.loadingMode) {
				return false;
			}

			// Saves the current state to the memento if it's not frozen
			if (!self.frozenMemento) {
				self.memento.push(self.save());
			}

			return true;
		};
	}

	public stateManualCreation(): void {
		this.renderer.stateManualCreation();
	}

	public edgeManualCreation(): void {
		this.renderer.edgeManualCreation();
	}

	public renameState(state: State, newName: string): boolean {
		if (this.stateExists(newName)) {
			return false;
		}

		Settings.controller().renameState(state, newName);
		state.name = newName;
		this.renderer.refresh(state);
		return true;
	}

	public toggleInitialFlag(state: State): void {
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

	public toggleFinalFlag(state: State): void {
		state.final = !state.final;
		this.renderer.toggleFinalFlag(state);
		Settings.controller().changeFinalFlag(state);
	}

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

	public createEdge<T extends State, TEdge extends Edge<T>>(edge: TEdge): void {
		let {origin, target} = edge;

		if (!this.edgeList.hasOwnProperty(origin.name)) {
			this.edgeList[origin.name];
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

	public createState(state: State): void {
		this.stateList[state.name] = state;
		Settings.controller().createState(state);
	}

	public onStateDrag(): void {
		// Saves the post-drag state to the memento
		// to allow the user to undo it
		this.memento.push(this.save());
	}

	public internalDeleteEdge<T extends State, TEdge extends Edge<T>>(edge: TEdge): void {
		if (!this.edgeList.hasOwnProperty(edge.origin.name)) {
			return;
		}

		delete this.edgeList[edge.origin.name][edge.target.name];
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
			return;
		}

		if (loadedData.aborted) {
			this.loadingMode = false;
			return;
		}

		// TODO
		// this.stateList = this.stateList.concat(loadedData.stateList);
		// this.edgeList = this.edgeList.concat(loadedData.edgeList);

		this.stateList = loadedData.stateList;
		this.edgeList = loadedData.edgeList;

		// Only changes the initial state if the current automaton
		// doesn't have one
		if (this.initialState === null) {
			this.initialState = loadedData.initialState;
		}

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
