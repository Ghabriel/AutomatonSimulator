/// <reference path="../types.ts" />

import {edgeInfoPrinter} from "./EdgeInfoPrinter"
import {EdgeUtils} from "../EdgeUtils"
import {FormalDefinitionRenderer} from "./FormalDefinitionRenderer"
import {GUI} from "./GUI"
import {PartialUIEdge, UIEdge} from "./UIEdge"
import {UIState} from "./UIState"
import {Keyboard} from "../Keyboard"
import {MainController} from "../MainController"
import {Prompt, ValuedHTMLElement} from "../Prompt"
import {Settings, Strings} from "../Settings"
import {SignalEmitter} from "../SignalEmitter"
import {stateInfoPrinter} from "./StateInfoPrinter"
import {System} from "../System"
import {Table} from "./Table"
import {utils} from "../Utils"

interface MouseEvent {
	pageX: number;
	pageY: number;
}

/**
 * Manages the UI representation of the automaton being manipulated, including
 * all related interactions.
 */
export class AutomatonRenderer {
	constructor(canvas: GUI.Canvas, node: HTMLElement) {
		this.canvas = canvas;
		this.node = node;
		this.formalDefinitionRenderer = new FormalDefinitionRenderer(this);
	}

	public setController(controller: MainController): void {
		this.controller = controller;
	}

	public render(): void {
		this.bindEvents();
		this.bindShortcuts();
		this.bindFormalDefinitionListener();
	}

	public onLanguageChange(): void {
		this.bindFormalDefinitionListener();

		if (this.locked) {
			this.recognitionDim();
			this.unlock();
		}

		if (this.highlightedState) {
			// Restores the "selected entity area" for states
			this.updateEditableState(this.highlightedState);
		}

		if (this.highlightedEdge) {
			// Restores the "selected entity area" for edges
			this.updateEditableEdge(this.highlightedEdge);
		}
	}

	public onMachineChange(): void {
		this.bindFormalDefinitionListener();
	}

	public setStateList(stateList: Map<State>): void {
		this.clearStates();

		utils.foreach(stateList, (name, state) => {
			let uiState = new UIState(state);
			this.internalCreateState(uiState);

			if (uiState.initial) {
				this.initialState = uiState;
			}

			uiState.render(this.canvas);
			this.bindStateEvents(uiState);
		});
	}

	public setEdgeList<T extends State, TEdge extends Edge<T>>
		(edgeList: IndexedEdgeGroup<TEdge>): void {

		this.clearEdges();

		EdgeUtils.edgeIteration(edgeList, (edge) => {
			this.createEdge(edge);
		});

		this.fixAllEdgesCurvature();
	}

	public refresh<T extends State>(entity: State|Edge<T>): void {
		return this.internal(entity).render(this.canvas);
	}

	// ------------------- Sidebar button callbacks ---------------------
	public stateManualCreation(): void {
		let stateRadius = Settings.stateRadius;
		let initialMarkLength = Settings.stateInitialMarkLength;
		this.newStateAt(stateRadius + initialMarkLength, stateRadius);
	}

	public edgeManualCreation(): void {
		if (this.locked) {
			return;
		}

		Prompt.simple(Strings.EDGE_MANUAL_CREATION, 2, (data) => {
			if (!this.stateExists(data[0]) || !this.stateExists(data[1])) {
				alert(Strings.ERROR_INVALID_STATE_NAME);
				return;
			}

			let edge = new PartialUIEdge();
			edge.origin = this.stateList[data[0]];
			this.currentEdge = edge;
			this.finishEdge(this.stateList[data[1]]);
		});
	}

	public clear(): void {
		this.clearStates();
		this.clearEdges();
		this.initialState = null;
		this.clearSelection();
	}

	// ------------------- Creation ---------------------
	public createState(state: State): void {
		let uiState = new UIState(state);
		this.internalCreateState(uiState);

		if (uiState.initial) {
			this.initialState = uiState;
		}

		uiState.render(this.canvas);
		this.bindStateEvents(uiState);
	}

	public createEdge<T extends State>(edge: Edge<T>): void {
		let uiEdge = this.wrapEdge(edge);
		this.internalCreateEdge(uiEdge);

		uiEdge.render(this.canvas);
		this.bindEdgeEvents(uiEdge);
	}

	// ------------------- Edition: states ---------------------
	public renameState(externalState: State, newName: string): void {
		let state = this.internal(externalState);

		delete this.stateList[state.name];
		state.name = newName;
		this.internalCreateState(state);

		state.render(this.canvas);
	}

	public toggleInitialFlag(externalState: State): void {
		let state = this.internal(externalState);

		if (state == this.initialState) {
			state.initial = false;
			this.initialState = null;
		} else {
			if (this.initialState) {
				this.initialState.initial = false;
				this.initialState.render(this.canvas);
			}

			state.initial = true;
			this.initialState = state;
		}

		state.render(this.canvas);
	}

	public toggleFinalFlag(externalState: State): void {
		let state = this.internal(externalState);
		state.final = !state.final;
		state.render(this.canvas);
	}

	// ------------------- Edition: edges/transitions ---------------------
	public changeTransitionOrigin<T extends State>(externalEdge: Edge<T>,
		newOrigin: State): void {

		let edge = this.internal(externalEdge);

		this.internalDeleteEdge(edge);
		edge.origin = this.internal(newOrigin);
		this.fixEdgeConsistency(edge);

		if (!edge.removed()) {
			this.internalCreateEdge(edge);
			edge.render(this.canvas);
		}
	}

	public changeTransitionTarget<T extends State>(externalEdge: Edge<T>,
		newTarget: State): void {

		let edge = this.internal(externalEdge);

		this.internalDeleteEdge(edge);
		edge.target = this.internal(newTarget);
		this.fixEdgeConsistency(edge);

		if (!edge.removed()) {
			this.internalCreateEdge(edge);
			edge.render(this.canvas);
		}
	}

	public changeTransitionData<T extends State>(externalEdge: Edge<T>,
		transitionIndex: number, newData: string[], newText: string): void {

		let edge = this.internal(externalEdge);
		edge.dataList[transitionIndex] = utils.clone(newData);
		edge.textList[transitionIndex] = newText;

		edge.render(this.canvas);
	}

	// ------------------- Deletion ---------------------
	public deleteState(externalState: State): void {
		if (!this.stateExists(externalState.name)) {
			return;
		}

		let state = this.internal(externalState);

		this.removeEdgesOfState(state);
		state.remove();
		delete this.stateList[state.name];
	}

	public deleteTransition<T extends State>(externalEdge: Edge<T>,
		transitionIndex: number): void {

		let {origin, target} = externalEdge;

		let edge = this.getEdge(origin, target);
		if (!edge) {
			return;
		}

		edge.dataList.splice(transitionIndex, 1);
		edge.textList.splice(transitionIndex, 1);

		if (edge.dataList.length == 0) {
			this.deleteEdge(edge);
		} else {
			edge.render(this.canvas);
		}
	}

	public deleteEdge<T extends State>(edge: Edge<T>): void {
		let {origin, target} = edge;

		let sameDirectionEdge = this.getEdge(origin, target);
		if (!sameDirectionEdge) {
			return;
		}

		let oppositeEdge = this.getEdge(target, origin);
		if (oppositeEdge) {
			oppositeEdge.setCurveFlag(false);
			oppositeEdge.render(this.canvas);
		}

		sameDirectionEdge.remove();
		if (this.isEdgeSelected(sameDirectionEdge)) {
			this.clearSelection();
		}

		this.internalDeleteEdge(sameDirectionEdge);
	}

	// ------------------- UI highlighting ---------------------
	public selectState(externalState: State): void {
		let state = this.internal(externalState);
		this.internalSelectState(state);
	}

	public selectEdge<T extends State>(externalEdge: Edge<T>): void {
		let edge = this.internal(externalEdge);
		this.internalSelectEdge(edge);
	}

	public selectTransition<T extends State>(externalEdge: Edge<T>,
		data: string[]): void {

		let edge = this.internal(externalEdge);

		for (let i = 0; i < edge.dataList.length; i++) {
			if (utils.isSameArray(data, edge.dataList[i])) {
				this.internalSelectEdge(edge, i);
				return;
			}
		}

		this.internalSelectEdge(edge);
	}

	public recognitionHighlight(stateNames: string[]): void {
		utils.foreach(this.stateList, (name, state) => {
			state.removePalette();
		});

		for (let name of stateNames) {
			this.stateList[name].applyPalette(Settings.stateRecognitionPalette);
		}

		utils.foreach(this.stateList, (name, state) => {
			state.render(this.canvas);
		});
	}

	public recognitionDim(): void {
		utils.foreach(this.stateList, (name, state) => {
			state.removePalette();
			state.render(this.canvas);
		});

		this.dimSelection();
	}

	// ------------------- Event triggers ---------------------
	public triggerFormalDefinitionChange(): void {
		this.formalDefinitionCallback();
	}

	// ------------------- Interaction lockers/unlockers ---------------------
	public lock(): void {
		System.lockShortcutGroup(Settings.canvasShortcutID);
		this.locked = true;
	}

	public unlock(): void {
		System.unlockShortcutGroup(Settings.canvasShortcutID);
		this.locked = false;
	}

	// ------------------- Getters ---------------------
	public getEdge(origin: State, target: State): UIEdge|null;
	public getEdge(origin: string, target: string): UIEdge|null;
	public getEdge(origin: any, target: any): UIEdge|null {
		let originName: string;
		let targetName: string;

		if (typeof origin != "string") {
			originName = origin.name;
			targetName = target.name;
		} else {
			originName = origin;
			targetName = target;
		}

		let edgeList = this.edgeList;

		if (!edgeList.hasOwnProperty(originName)) {
			return null;
		}

		if (!edgeList[originName].hasOwnProperty(targetName)) {
			return null;
		}

		return edgeList[originName][targetName];
	}

	public isEdgeSelected(edge: UIEdge): boolean {
		return this.highlightedEdge == edge;
	}


	// #########################################################
	// ##############----- Private methods -----################
	// #########################################################

	// ------------------- Creation ---------------------
	private internalCreateState(state: UIState): void {
		this.stateList[state.name] = state;
	}

	private internalCreateEdge(edge: UIEdge): void {
		let {origin, target} = edge;

		if (!this.edgeList.hasOwnProperty(origin.name)) {
			this.edgeList[origin.name] = {};
		}

		this.edgeList[origin.name][target.name] = edge;
	}

	// ------------------- Edge creation process ---------------------
	private beginEdge(origin: UIState): void {
		this.edgeMode = true;
		this.currentEdge = new PartialUIEdge();
		this.currentEdge.origin = origin;
	}

	private adjustEdge(e: MouseEvent): void {
		if (!this.currentEdge) {
			// shouldn't happen, just for type safety
			throw Error();
		}

		this.currentEdge.setVirtualTarget({
			x: e.pageX - this.node.offsetLeft,
			y: e.pageY - this.node.offsetTop
		});

		this.currentEdge.render(this.canvas);
	}

	private finishEdge(target: UIState): void {
		if (!this.currentEdge) {
			// shouldn't happen, just for type safety
			throw Error();
		}

		this.edgeMode = false;
		this.currentEdge.target = target;

		// The current edge is now completed,
		// it's safe to consider it an UIEdge.
		let currentEdge = <UIEdge> this.currentEdge;
		let origin = currentEdge.origin;

		if (this.mergeWithParallel(currentEdge)) {
			return;
		}

		let oppositeEdge = this.getEdge(target, origin);
		if (oppositeEdge) {
			currentEdge.setCurveFlag(true);

			// Makes the opposite edge a curved one as well.
			oppositeEdge.setCurveFlag(true);
			oppositeEdge.render(this.canvas);
		}

		// Renders the edge here to show it already attached to the target state.
		this.internalSelectEdge(currentEdge);
		currentEdge.render(this.canvas);

		this.edgeTextPrompt(currentEdge, (data, text) => {
			currentEdge.dataList.push(data);
			currentEdge.textList.push(text);

			this.dimSelection();
			currentEdge.remove();
			this.controller.createEdge(currentEdge);

			currentEdge = this.getEdge(origin, target)!;
			if (oppositeEdge){
				currentEdge.setCurveFlag(true);
			}
			this.internalSelectEdge(currentEdge);
			this.currentEdge = null;
		}, () => {
			this.deleteCurrentEdge();

			// We might have set the opposite edge curve flag, so
			// we need to unset it here.
			if (oppositeEdge) {
				oppositeEdge.setCurveFlag(false);
				oppositeEdge.render(this.canvas);
			}
		});
	}

	// ------------------- Deletion ---------------------
	private clearStates(): void {
		utils.foreach(this.stateList, function(name, state) {
			state.remove();
		});

		this.stateList = {};
	}

	private clearEdges(): void {
		EdgeUtils.edgeIteration(this.edgeList, (edge) => {
			edge.remove();
		});

		this.edgeList = {};
	}

	private removeEdgesOfState(state: UIState): void {
		EdgeUtils.edgeIteration(this.edgeList, (edge) => {
			let {origin, target} = edge;

			if (origin == state || target == state) {
				edge.remove();
				this.internalDeleteEdge(edge);
			}
		});
	}

	private internalDeleteEdge<T extends State>(edge: Edge<T>): void {
		if (!this.edgeList.hasOwnProperty(edge.origin.name)) {
			return;
		}

		delete this.edgeList[edge.origin.name][edge.target.name];
	}

	// Deletes an edge being created (i.e non-internal)
	private deleteCurrentEdge(): void {
		this.dimEdge();
		this.currentEdge!.remove();
		this.currentEdge = null;
	}

	// ------------------- UI highlighting ---------------------
	private internalSelectState(state: UIState): void {
		if (this.locked) {
			return;
		}

		this.dimSelection();

		state.applyPalette(Settings.stateHighlightPalette);
		this.highlightedState = state;
		state.render(this.canvas);

		this.updateEditableState(state);
	}

	private internalSelectEdge(edge: UIEdge, selectedIndex: number = 0): void {
		if (this.locked) {
			return;
		}

		this.dimSelection();

		edge.applyPalette(Settings.edgeHighlightPalette);
		this.highlightedEdge = edge;
		edge.render(this.canvas);

		this.updateEditableEdge(edge, selectedIndex);
	}

	// ------------------- UI dim ---------------------
	private dimSelection(): void {
		this.dimState();
		this.dimEdge();
	}

	private dimEdge(): void {
		if (!this.locked && this.highlightedEdge) {
			this.highlightedEdge.removePalette();
			this.highlightedEdge.render(this.canvas);
			this.highlightedEdge = null;

			this.unsetSelectedEntityContent();
		}
	}

	private dimState(): void {
		if (!this.locked && this.highlightedState) {
			this.highlightedState.removePalette();
			this.highlightedState.render(this.canvas);
			this.highlightedState = null;

			this.unsetSelectedEntityContent();
		}
	}

	// Similar to dimSelection(), but used when
	// the highlighted item is deleted
	private clearSelection(): void {
		this.highlightedState = null;
		this.highlightedEdge = null;
		this.unsetSelectedEntityContent();
		if (this.edgeMode) {
			this.edgeMode = false;
			this.currentEdge!.remove();
			this.currentEdge = null;
		}
	}

	// ------------------- Selected entity area ---------------------
	private updateEditableState(state: UIState|null): void {
		if (state) {
			SignalEmitter.emitSignal({
				targetID: Settings.sidebarSignalID,
				identifier: "setSelectedEntityContent",
				data: [this.showEditableState(state)]
			});
		} else {
			this.unsetSelectedEntityContent();
		}
	}

	private updateEditableEdge(edge: UIEdge|null, selectedIndex: number = 0): void {
		if (edge) {
			SignalEmitter.emitSignal({
				targetID: Settings.sidebarSignalID,
				identifier: "setSelectedEntityContent",
				data: [this.showEditableEdge(edge, selectedIndex)]
			});
		} else {
			this.unsetSelectedEntityContent();
		}
	}

	private showEditableState(state: UIState): HTMLDivElement {
		let canvas = this.canvas;
		let controller = this.controller;
		let self = this;

		let data = stateInfoPrinter(state);

		let renameStatePrompt = () => {
			let prompt = new Prompt(Strings.STATE_RENAME_ACTION);

			prompt.addInput({
				validator: (content) => {
					return content.length <= Settings.stateNameMaxLength;
				}
			});

			prompt.onSuccess((data) => {
				let newName = data[0];
				if (!controller.renameState(state, newName)) {
					alert(Strings.DUPLICATE_STATE_NAME);
					renameStatePrompt();
					return;
				}

				$("#entity_name").html(newName);
			});

			prompt.show();
		};

		data.renameButton.addEventListener("click", renameStatePrompt);

		data.toggleInitialButton.addEventListener("click", function() {
			controller.toggleInitialFlag(state);
			let isInitial = (self.initialState == state);
			$("#entity_initial").html(isInitial ? Strings.YES : Strings.NO);

		});

		data.toggleFinalButton.addEventListener("click", function() {
			// self.changeFinalFlag(state, !state.isFinal());
			// state.render(canvas);
			controller.toggleFinalFlag(state);
			$("#entity_final").html(state.final ? Strings.YES : Strings.NO);

		});

		data.deleteButton.addEventListener("click", function() {
			controller.deleteState(state);
			self.clearSelection();
			self.unsetSelectedEntityContent();
		});

		return data.container;
	}

	private showEditableEdge(edge: UIEdge, selectedIndex: number = 0): HTMLDivElement {
		let canvas = this.canvas;
		let controller = this.controller;
		let self = this;

		let data = edgeInfoPrinter(edge, selectedIndex);

		data.changeOriginButton.addEventListener("click", function() {
			// TODO: not communicating anyone else? This should be investigated.
			// TODO: why not use Prompt instead of prompt?
			let newOrigin = prompt(Strings.EDGE_ENTER_NEW_ORIGIN);
			if (newOrigin === null) {
				return;
			}

			if (!self.stateExists(newOrigin)) {
				alert(Strings.ERROR_INVALID_STATE_NAME);
				return;
			}

			let newOriginState = self.stateList[newOrigin];
			controller.changeTransitionOrigin(edge, newOriginState);

			// TODO: why is this necessary?
			// if (!edge.removed()) {
			// 	edge.render(canvas);
			// }

			$("#entity_origin").html(newOrigin);
		});

		data.changeTargetButton.addEventListener("click", function() {
			let newTarget = prompt(Strings.EDGE_ENTER_NEW_TARGET);
			if (newTarget !== null) {
				if (!self.stateExists(newTarget)) {
					alert(Strings.ERROR_INVALID_STATE_NAME);
					return;
				}

				let newTargetState = self.stateList[newTarget];
				controller.changeTransitionTarget(edge, newTargetState);

				// TODO: why is this necessary?
				// if (!edge.removed()) {
				// 	edge.render(canvas);
				// }

				$("#entity_target").html(newTarget);
			}
		});

		data.changeTransitionButton.addEventListener("click", function() {
			let transitionSelector = <HTMLSelectElement> $("#entity_transition_list").get(0);
			let selectedIndex = transitionSelector.selectedIndex;
			let machineController = Settings.controller();

			let prompt = machineController.edgePrompt(function(data, content) {
				// TODO: check if the new content conflicts with an already
				// existing transition in this edge (e.g 0,1 -> 1,1)
				controller.changeTransitionData(edge, selectedIndex, data, content);
				self.updateEditableEdge(edge);
			});

			prompt.setDefaultValues(edge.dataList[selectedIndex]);

			prompt.show();
		});

		data.deleteTransitionButton.addEventListener("click", function() {
			let transitionSelector = <HTMLSelectElement> $("#entity_transition_list").get(0);
			let selectedIndex = transitionSelector.selectedIndex;

			controller.deleteTransition(edge, selectedIndex);

			if (!edge.removed()) {
				self.updateEditableEdge(edge);
			}
		});

		data.deleteAllButton.addEventListener("click", function() {
			controller.deleteEdge(edge);
		});

		return data.container;
	}

	private unsetSelectedEntityContent() {
		SignalEmitter.emitSignal({
			targetID: Settings.sidebarSignalID,
			identifier: "unsetSelectedEntityContent",
			data: []
		});
	}

	// ------------------- Event binding ---------------------
	private bindEvents(): void {
		utils.foreach(this.stateList, (name, state) => {
			state.render(this.canvas);
			this.bindStateEvents(state);
		});

		EdgeUtils.edgeIteration(this.edgeList, (edge) => {
			this.bindEdgeEvents(edge);
		});

		this.bindNodeEvents();
	}

	private bindEdgeEvents(edge: UIEdge): void {
		edge.addClickHandler(() => {
			this.selectEdge(edge);
		});
	}

	private bindStateEvents(state: UIState): void {
		// Ideally, separating left click/right click dragging handlers would
		// provide better usability. Unfortunately, many SVG frameworks don't
		// allow such separation.
		state.drag(() => {
			EdgeUtils.edgeIteration(this.edgeList, (edge) => {
				edge.render(this.canvas);
			});
		}, (distanceSquared, event) => {
			if (!this.locked && distanceSquared <= Settings.stateDragTolerance) {
				if (this.edgeMode) {
					this.finishEdge(state);
				} else if (utils.isRightClick(event)) {
					this.beginEdge(state);
				} else if (state == this.highlightedState) {
					this.dimState();
				} else {
					this.internalSelectState(state);
				}
				return false;
			}

			this.controller.onStateDrag();
			return true;
		});
	}

	private bindNodeEvents(): void {
		let node = this.node;
		$(node).dblclick((e) => {
			// Avoids a bug where double clicking a Prompt
			// would trigger a state creation
			if (e.target.tagName.toLowerCase() == "svg") {
				let x = e.pageX - node.offsetLeft;
				let y = e.pageY - node.offsetTop;
				this.newStateAt(x, y);
			}
		});

		$(node).contextmenu((e) => {
			e.preventDefault();
			return false;
		});

		$(node).mousemove((e) => {
			if (this.edgeMode) {
				this.adjustEdge(e);
			}
		});
	}

	// ------------------- Edge consistency ---------------------
	// Curves all edges that should be curved. Note that this
	// method does not un-curve edges that shouldn't be curved.
	private fixAllEdgesCurvature(): void {
		EdgeUtils.edgeIteration(this.edgeList, (edge) => {
			if (edge.isCurved()) {
				return;
			}

			let oppositeEdge = this.getEdge(edge.target, edge.origin);
			if (oppositeEdge) {
				edge.setCurveFlag(true);
				oppositeEdge.setCurveFlag(true);
			}
		});
	}

	// After an edge is edited, this method makes sure that curved flags
	// are correctly turned on/off and same origin/target edges are properly
	// merged. Receives as input the edge that has just been edited.
	// TODO: avoid code duplication (see finishEdge())
	private fixEdgeConsistency(newEdge: UIEdge): void {
		let {origin, target} = newEdge;

		let canvas = this.canvas;

		let oppositeEdge = this.getEdge(target, origin);
		if (oppositeEdge) {
			// Both edges should become curved.
			oppositeEdge.setCurveFlag(true);
			oppositeEdge.render(canvas);

			newEdge.setCurveFlag(true);
			newEdge.render(canvas);
		} else {
			newEdge.setCurveFlag(false);
			newEdge.render(canvas);
			// TODO: 'un-curve' edges that no longer have an opposite
		}

		let sameDirectionEdge = this.getEdge(origin, target);
		if (!sameDirectionEdge || sameDirectionEdge == newEdge) {
			return;
		}

		// Add the edge's text to it instead and delete the new edge.
		let {dataList, textList} = newEdge;
		let length = dataList.length;
		for (let i = 0; i < length; i++) {
			sameDirectionEdge.dataList.push(dataList[i]);
			sameDirectionEdge.textList.push(textList[i]);
		}
		sameDirectionEdge.render(canvas);

		newEdge.remove();

		if (this.isEdgeSelected(newEdge)) {
			this.clearSelection();
			this.selectEdge(sameDirectionEdge);
		}
	}


	private bindFormalDefinitionListener(): void {
		let controllerCallback = this.controller.getFormalDefinitionCallback();
		let definitionContainer: HTMLDivElement;

		this.formalDefinitionCallback = () => {
			if (!controllerCallback()) {
				return;
			}

			if (!definitionContainer) {
				definitionContainer = utils.create("div");
				SignalEmitter.emitSignal({
					targetID: Settings.sidebarSignalID,
					identifier: "updateFormalDefinition",
					data: [definitionContainer]
				});
			}

			let formalDefinition = Settings.controller().formalDefinition();
			let container = utils.create("span");
			this.formalDefinitionRenderer.render(container, formalDefinition);

			definitionContainer.innerHTML = "";
			definitionContainer.appendChild(container);
		};

		Settings.controller().setEditingCallback(this.formalDefinitionCallback);

		// Calls the callback to display the initial formal definition
		// (normally the formal definition of an empty automaton)
		this.formalDefinitionCallback();
	}

	private stateExists(name: string): boolean {
		return this.stateList.hasOwnProperty(name);
	}

	private edgeTextPrompt(edge: UIEdge,
		callback: (d: string[], t: string) => void, fallback: SimpleCallback) {

		let machineController = Settings.controller();
		let prompt = machineController.edgePrompt(callback, fallback);
		this.adjustPromptPosition(prompt, edge);
		prompt.show();
	}

	private adjustPromptPosition(prompt: Prompt, edge: UIEdge) {
		let {origin, target} = edge;

		let x: number;
		let y: number;

		if (origin == target) {
			// Loop edge
			x = origin.x + origin.getRadius();
			y = origin.y - origin.getRadius();
		} else {
			x = (origin.x + target.x) / 2;
			y = (origin.y + target.y) / 2;
		}

		prompt.setPosition(x, y);
	}

	private mergeWithParallel(edge: UIEdge): boolean {
		let {origin, target} = edge;
		let sameDirectionEdge = this.getEdge(origin, target);
		if (sameDirectionEdge) {
			this.edgeTextPrompt(sameDirectionEdge, (data, text) => {
				// Add the text to it instead and delete 'this.currentEdge'.
				sameDirectionEdge!.dataList.push(data);
				sameDirectionEdge!.textList.push(text);
				sameDirectionEdge!.render(this.canvas);
				this.deleteCurrentEdge();
				this.selectEdge(sameDirectionEdge!);
				this.controller.remoteCreateTransition(origin, target, data);
			}, () => this.deleteCurrentEdge);

			return true;
		}

		return false;
	}

	private newStateAt(x: number, y: number): void {
		if (this.locked) {
			return;
		}

		let state = new UIState();
		state.x = x;
		state.y = y;
		this.internalSelectState(state);
		this.bindStateEvents(state);

		let stateNamePrompt = () => {
			let prompt = new Prompt(Strings.STATE_MANUAL_CREATION);

			prompt.addInput({
				validator: utils.nonEmptyStringValidator
			});

			let radius = state.getRadius();
			prompt.setPosition(x + radius, y - radius);

			prompt.onSuccess((data) => {
				let name = data[0];
				if (this.stateExists(name)) {
					alert(Strings.DUPLICATE_STATE_NAME);
					return stateNamePrompt();
				}

				state.name = name;

				this.dimSelection();
				state.remove();
				this.controller.createState(state);

				state = this.stateList[state.name];
				this.internalSelectState(state);
			});

			prompt.onAbort(() => {
				this.highlightedState = null;
				state.remove();
				this.updateEditableState(null);
			});

			prompt.show();
		};

		stateNamePrompt();
	}

	private wrapEdge<T extends State>(edge: Edge<T>): UIEdge {
		let uiEdge = new UIEdge();
		uiEdge.origin = this.internal(edge.origin);
		uiEdge.target = this.internal(edge.target);
		uiEdge.textList = utils.clone(edge.textList);
		uiEdge.dataList = utils.clone(edge.dataList);

		return uiEdge;
	}

	private internal(state: State): UIState;
	private internal<T extends State>(edge: Edge<T>): UIEdge;
	private internal<T extends State>(entity: State|Edge<T>): UIState|UIEdge;
	private internal(entity: any): any {
		if (entity.type == "state") {
			return this.stateList[entity.name];
		} else {
			return this.edgeList[entity.origin.name][entity.target.name];
		}
	}

	private bindShortcuts(): void {
		let group = Settings.canvasShortcutID;
		System.bindShortcut(Settings.shortcuts.toggleInitial, () => {
			let highlightedState = this.highlightedState;
			if (highlightedState) {
				this.controller.toggleInitialFlag(highlightedState);
				this.updateEditableState(highlightedState);
			}
		}, group);

		System.bindShortcut(Settings.shortcuts.toggleFinal, () => {
			let highlightedState = this.highlightedState;
			if (highlightedState) {
				this.controller.toggleFinalFlag(highlightedState);
				this.updateEditableState(highlightedState);
			}
		}, group);

		System.bindShortcut(Settings.shortcuts.dimSelection, () => {
			if (this.edgeMode) {
				this.edgeMode = false;
				this.currentEdge!.remove();
				this.currentEdge = null;
			}
			this.dimState();
			this.dimEdge();
		}, group);

		System.bindShortcut(Settings.shortcuts.deleteEntity, () => {
			let highlightedState = this.highlightedState;
			let highlightedEdge = this.highlightedEdge;
			if (highlightedState) {
				this.controller.deleteState(highlightedState);
			} else if (highlightedEdge) {
				this.controller.deleteEdge(highlightedEdge);
			}
			this.clearSelection();
		}, group);

		System.bindShortcut(Settings.shortcuts.clearMachine, () => {
			let confirmation = confirm(Strings.CLEAR_CONFIRMATION);
			if (confirmation) {
				this.controller.clear();
			}
		}, group);

		// TODO: try to reduce the redundancy
		System.bindShortcut(Settings.shortcuts.left, () => {
			this.moveStateSelection((attempt, highlighted) => {
				return attempt.x < highlighted.x;
			}, (attempt, currBest, highlighted) => {
				if (!currBest) {
					return true;
				}

				let dy = Math.abs(attempt.y - highlighted.y);
				let targetDy = Math.abs(currBest.y - highlighted.y);

				let threshold = this.selectionThreshold();
				if (dy < threshold) {
					return targetDy >= threshold || attempt.x > currBest.x;
				}

				return dy < targetDy;
			});
		}, group);

		System.bindShortcut(Settings.shortcuts.right, () => {
			this.moveStateSelection((attempt, highlighted) => {
				return attempt.x > highlighted.x;
			}, (attempt, currBest, highlighted) => {
				if (!currBest) {
					return true;
				}

				let dy = Math.abs(attempt.y - highlighted.y);
				let targetDy = Math.abs(currBest.y - highlighted.y);

				let threshold = this.selectionThreshold();
				if (dy < threshold) {
					return targetDy >= threshold || attempt.x < currBest.x;
				}

				return dy < targetDy;
			});
		}, group);

		System.bindShortcut(Settings.shortcuts.up, () => {
			this.moveStateSelection((attempt, highlighted) => {
				return attempt.y < highlighted.y;
			}, (attempt, currBest, highlighted) => {
				if (!currBest) {
					return true;
				}

				let dx = Math.abs(attempt.x - highlighted.x);
				let targetDx = Math.abs(currBest.x - highlighted.x);

				let threshold = this.selectionThreshold();
				if (dx < threshold) {
					return targetDx >= threshold || attempt.y > currBest.y;
				}

				return dx < targetDx;
			});
		}, group);

		System.bindShortcut(Settings.shortcuts.down, () => {
			this.moveStateSelection((attempt, highlighted) => {
				return attempt.y > highlighted.y;
			}, (attempt, currBest, highlighted) => {
				if (!currBest) {
					return true;
				}

				let dx = Math.abs(attempt.x - highlighted.x);
				let targetDx = Math.abs(currBest.x - highlighted.x);

				let threshold = this.selectionThreshold();
				if (dx < this.selectionThreshold()) {
					return targetDx >= threshold || attempt.y < currBest.y;
				}

				return dx < targetDx;
			});
		}, group);

		System.bindShortcut(Settings.shortcuts.undo, () => {
			this.controller.undo();
		}, group);

		System.bindShortcut(Settings.shortcuts.redo, () => {
			this.controller.redo();
		}, group);
	}

	private selectionThreshold(): number {
		return 2 * Settings.stateRadius;
	}

	private moveStateSelection(isViable: (attempt: State, highlighted: State) => boolean,
		isBetterCandidate: (attempt: State, currBest: State|null,
			highlighted: State) => boolean): void {

		let highlightedState = this.highlightedState;
		if (!highlightedState) {
			return;
		}

		let target: UIState|null = null;
		utils.foreach(this.stateList, (name, state) => {
			if (isViable(state, highlightedState!)) {
				if (isBetterCandidate(state, target, highlightedState!)) {
					target = state;
				}
			}
		});

		if (target) {
			this.internalSelectState(target);
		}
	}

	private canvas: GUI.Canvas;
	private controller: MainController;
	private node: HTMLElement;

	private stateList: Map<UIState> = {};
	private edgeList: IndexedEdgeGroup<UIEdge> = {};
	private initialState: UIState|null = null;

	private highlightedState: UIState|null = null;
	private highlightedEdge: UIEdge|null = null;

	// The edge being constructed
	private currentEdge: PartialUIEdge|null = null;

	private edgeMode: boolean = false;
	private locked: boolean = false;

	private formalDefinitionCallback: () => void;

	private formalDefinitionRenderer: FormalDefinitionRenderer;
}
