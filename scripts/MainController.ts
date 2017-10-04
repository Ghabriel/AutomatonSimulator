/// <reference path="types.ts" />

import {AutomatonRenderer} from "./interface/AutomatonRenderer"
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
		if (signal.targetID == Settings.automatonRendererSignalID) {
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

		Settings.controller().clear();
		this.renderer.clear();
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

	public load(content: string, pushResult: boolean = true): void {
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

		if (pushResult) {
			// Saves the resulting state
			this.memento.push(this.save());
		}
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
		this.renderer.toggleInitialFlag(state);
		this.renderer.refresh(state);
	}

	public toggleFinalFlag(state: State): void {
		this.renderer.toggleFinalFlag(state);
		this.renderer.refresh(state);
	}

	public deleteState(state: State): void {
		// ??
		this.renderer.deleteState(state);
	}

	private stateExists(name: string): boolean {
		return this.stateList.hasOwnProperty(name);
	}

	private memento: Memento<string>;
	private persistenceHandler: PersistenceHandler;
	private renderer: AutomatonRenderer;

	// Internal automaton structures
	private stateList: Map<State> = {};
	private edgeList: IndexedEdgeGroup<Edge<State>> = {};

	private initialState: State|null = null;

	private locked: boolean = false;
	private frozenMemento: boolean = false;
	private loadingMode: boolean = false;
}
