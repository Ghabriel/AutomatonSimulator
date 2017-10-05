import {PartialUIEdge, UIEdge} from "./Edge"
import {edgeInfoPrinter} from "./EdgeInfoPrinter"
import {EdgeUtils} from "../EdgeUtils"
import {FormalDefinitionRenderer} from "./FormalDefinitionRenderer"
import {GUI} from "./GUI"
import {Keyboard} from "../Keyboard"
import {MainController} from "../MainController"
import {Prompt, ValuedHTMLElement} from "../Prompt"
import {Settings, Strings} from "../Settings"
import {SignalEmitter} from "../SignalEmitter"
import {UIState} from "./State"
import {stateInfoPrinter} from "./StateInfoPrinter"
import {System} from "../System"
import {Table} from "./Table"
import {Point, utils} from "../Utils"

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

	public clear(): void {
		this.clearStates();
		this.clearEdges();
		this.initialState = null;
		this.clearSelection();
	}

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

	public setStateList(stateList: Map<State>): void {
		this.clearStates();

		utils.foreach(stateList, (name, state) => {
			let uiState = new UIState(state);
			this.stateList[uiState.name] = uiState;

			uiState.render(this.canvas);
			this.bindStateEvents(uiState);
		});
	}

	public setEdgeList<T extends State, TEdge extends Edge<T>>
		(edgeList: IndexedEdgeGroup<TEdge>): void {

		this.clearEdges();

		EdgeUtils.edgeIteration(edgeList, (edge) => {
			let uiEdge = this.createEdge(edge);
			uiEdge.render(this.canvas);
			this.bindEdgeEvents(uiEdge);
		});
	}

	public createEdge<T extends State>(edge: Edge<T>): UIEdge {
		let origin = edge.origin;
		if (!this.edgeList.hasOwnProperty(origin.name)) {
			this.edgeList[origin.name] = {};
		}

		let target = edge.target;
		let uiEdge = new UIEdge();
		uiEdge.origin = this.stateList[origin.name];
		uiEdge.target = this.stateList[target.name];
		uiEdge.textList = edge.textList;
		uiEdge.dataList = edge.dataList;

		this.edgeList[origin.name][target.name] = uiEdge;
		return uiEdge;
	}

	public refresh<T extends State>(entity: State|Edge<T>): void {
		if (entity.type == "state") {
			this.stateList[entity.name].render(this.canvas);
		} else {
			let edge = this.edgeList[entity.origin.name][entity.target.name];
			edge.render(this.canvas);
		}
	}

	public triggerFormalDefinitionChange(): void {
		this.formalDefinitionCallback();
	}

	public recognitionHighlight(stateNames: string[]): void {
		utils.foreach(this.stateList, function(name, state) {
			state.removePalette();
		});

		for (let name of stateNames) {
			this.stateList[name].applyPalette(Settings.stateRecognitionPalette);
		}

		let canvas = this.canvas;
		utils.foreach(this.stateList, function(name, state) {
			state.render(canvas);
		});
	}

	public recognitionDim(): void {
		let canvas = this.canvas;
		utils.foreach(this.stateList, function(name, state) {
			state.removePalette();
			state.render(canvas);
		});

		this.highlightedState = null;
	}

	public lock(): void {
		System.lockShortcutGroup(Settings.canvasShortcutID);
		this.locked = true;
	}

	public unlock(): void {
		System.unlockShortcutGroup(Settings.canvasShortcutID);
		this.locked = false;
	}

	public stateManualCreation(): void {
		let stateRadius = Settings.stateRadius;
		let initialMarkLength = Settings.stateInitialMarkLength;
		this.newStateAt(stateRadius + initialMarkLength, stateRadius);
	}

	public edgeManualCreation(): void {
		if (!this.locked) {
			let self = this;
			Prompt.simple(Strings.EDGE_MANUAL_CREATION, 2, function(data) {
				if (!self.stateExists(data[0]) || !self.stateExists(data[1])) {
					alert(Strings.ERROR_INVALID_STATE_NAME);
					return;
				}

				let edge = new UIEdge();
				edge.origin = self.stateList[data[0]];
				edge.target = self.stateList[data[1]];
				self.currentEdge = edge;
				self.finishEdge(edge.target);
			});
		}
	}

	public getCanvas(): GUI.Canvas {
		return this.canvas;
	}

	// public getEdgeList(): Edge[] {
	// 	return this.edgeList;
	// }

	public isEdgeSelected(edge: UIEdge): boolean {
		return this.highlightedEdge == edge;
	}

	public selectEdge(edge: UIEdge): void {
		if (!this.locked) {
			this.dimState();
			if (this.highlightedEdge) {
				this.highlightedEdge.removePalette();
				this.highlightedEdge.render(this.canvas);
			}
			edge.applyPalette(Settings.edgeHighlightPalette);
			this.highlightedEdge = edge;
			edge.render(this.canvas);

			this.updateEditableEdge(edge);
		}
	}

	private dimEdge(): void {
		if (!this.locked && this.highlightedEdge) {
			this.highlightedEdge.removePalette();
			this.highlightedEdge.render(this.canvas);
			this.highlightedEdge = null;

			this.unsetSelectedEntityContent();
		}
	}

	private selectState(state: UIState): void {
		if (!this.locked) {
			this.dimEdge();
			if (this.highlightedState) {
				this.highlightedState.removePalette();
				this.highlightedState.render(this.canvas);
			}
			state.applyPalette(Settings.stateHighlightPalette);
			this.highlightedState = state;
			state.render(this.canvas);

			this.updateEditableState(state);
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

	// TODO: find a better name for this method
	// (since it also handles saving the current state)
	private bindFormalDefinitionListener(): void {
		let controllerCallback = this.controller.getFormalDefinitionCallback();
		let definitionContainer: HTMLDivElement;

		let self = this;
		this.formalDefinitionCallback = function() {
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
			self.formalDefinitionRenderer.render(container, formalDefinition);

			definitionContainer.innerHTML = "";
			definitionContainer.appendChild(container);
		};

		Settings.controller().setEditingCallback(this.formalDefinitionCallback);

		// Calls the callback to display the initial formal definition
		// (normally the formal definition of an empty automaton)
		this.formalDefinitionCallback();
	}

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

	private updateEditableEdge(edge: UIEdge|null): void {
		if (edge) {
			SignalEmitter.emitSignal({
				targetID: Settings.sidebarSignalID,
				identifier: "setSelectedEntityContent",
				data: [this.showEditableEdge(edge)]
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

		let renameStatePrompt = function() {
			let prompt = new Prompt(Strings.STATE_RENAME_ACTION);

			prompt.addInput({
				validator: function(content) {
					return content.length <= Settings.stateNameMaxLength;
				}
			});

			prompt.onSuccess(function(data) {
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
		if (sameDirectionEdge) {
			if (sameDirectionEdge != newEdge) {
				// Add the edge's text to it instead and delete the new edge.
				let {dataList, textList} = newEdge;
				let length = dataList.length;
				for (let i = 0; i < length; i++) {
					sameDirectionEdge.dataList.push(dataList[i]);
					sameDirectionEdge.textList.push(textList[i]);
				}
				sameDirectionEdge.render(canvas);
			}

			if (this.highlightedEdge == newEdge) {
				this.selectEdge(sameDirectionEdge);
			}
			newEdge.remove();
			// this.edgeList.splice(edgeIndex, 1);
		}
	}

	private getEdge(origin: State, target: State): UIEdge|null {
		let edgeList = this.edgeList;

		if (!edgeList.hasOwnProperty(origin.name)) {
			return null;
		}

		if (!edgeList.hasOwnProperty(target.name)) {
			return null;
		}

		return edgeList[origin.name][target.name];
	}

	private stateExists(name: string): boolean {
		return this.stateList.hasOwnProperty(name);
	}

	private showEditableEdge(edge: UIEdge): HTMLDivElement {
		let canvas = this.canvas;
		let controller = this.controller;
		let self = this;

		let data = edgeInfoPrinter(edge);

		data.changeOriginButton.addEventListener("click", function() {
			// TODO: not communicating anyone else? This should be investigated.
			// TODO: why not use Prompt instead of prompt?
			let newOrigin = prompt(Strings.EDGE_ENTER_NEW_ORIGIN);
			if (newOrigin !== null) {
				if (!self.stateExists(newOrigin)) {
					alert(Strings.ERROR_INVALID_STATE_NAME);
					return;
				}

				edge.origin = self.stateList[newOrigin];
				self.fixEdgeConsistency(edge);

				// TODO: why is this necessary?
				// if (!edge.removed()) {
				// 	edge.render(canvas);
				// }

				$("#entity_origin").html(newOrigin);
			}
		});

		data.changeTargetButton.addEventListener("click", function() {
			let newTarget = prompt(Strings.EDGE_ENTER_NEW_TARGET);
			if (newTarget !== null) {
				if (!self.stateExists(newTarget)) {
					alert(Strings.ERROR_INVALID_STATE_NAME);
					return;
				}

				edge.target = self.stateList[newTarget];
				self.fixEdgeConsistency(edge);

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

			if (edge.dataList.length == 0) {
				self.clearSelection();
				self.unsetSelectedEntityContent();
			} else {
				self.updateEditableEdge(edge);
			}
		});

		data.deleteAllButton.addEventListener("click", function() {
			controller.deleteEdge(edge);
			self.clearSelection();
			self.unsetSelectedEntityContent();
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
					this.selectState(state);
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
				this.adjustEdge(node, e);
			}
		});
	}

	private beginEdge(state: UIState): void {
		this.edgeMode = true;
		this.currentEdge = new PartialUIEdge();
		this.currentEdge.origin = state;
	}

	private adjustEdge(elem: HTMLElement, e: MouseEvent): void {
		if (!this.currentEdge) {
			// shouldn't happen, just for type safety
			throw Error();
		}

		let target = {
			x: e.pageX - elem.offsetLeft,
			y: e.pageY - elem.offsetTop
		};

		this.currentEdge.setVirtualTarget(target);
		this.currentEdge.render(this.canvas);
	}

	private finishEdge(target: UIState): void {
		if (!this.currentEdge) {
			// shouldn't happen, just for type safety
			throw Error();
		}

		this.edgeMode = false;
		let origin = this.currentEdge.origin!;
		let controller = this.controller;

		let edgeText = function(edge: UIEdge,
								callback: (d: string[], t: string) => void,
								fallback: () => void) {
			let machineController = Settings.controller();
			let prompt = machineController.edgePrompt(function(data, content) {
				callback(data, content);
				controller.createTransition(origin, target, data);
			}, fallback);

			let edgeOrigin = edge.origin;
			let edgeTarget = edge.target;
			if (edgeOrigin == edgeTarget) {
				// Loop edge
				let x = edgeOrigin.x + edgeOrigin.getRadius();
				let y = edgeOrigin.y - edgeOrigin.getRadius();
				prompt.setPosition(x, y);
			} else {
				let averageX = (edgeOrigin.x + edgeTarget.x) / 2;
				let averageY = (edgeOrigin.y + edgeTarget.y) / 2;
				prompt.setPosition(averageX, averageY);
			}

			prompt.show();
		};

		let clearCurrentEdge = () => {
			this.dimEdge();
			this.currentEdge!.remove();
			this.currentEdge = null;
		};

		let sameDirectionEdge = this.getEdge(origin, target);
		if (sameDirectionEdge) {
			edgeText(sameDirectionEdge, (data, text) => {
				// Add the text to it instead and delete 'this.currentEdge'.
				sameDirectionEdge!.dataList.push(data);
				sameDirectionEdge!.textList.push(text);
				sameDirectionEdge!.render(this.canvas);
				this.selectEdge(sameDirectionEdge!);
				clearCurrentEdge();
			}, clearCurrentEdge);
			return;
		}

		let oppositeEdge = this.getEdge(target, origin);
		if (oppositeEdge) {
			this.currentEdge.setCurveFlag(true);

			// Makes the opposite edge a curved one as well.
			oppositeEdge.setCurveFlag(true);
			oppositeEdge.render(this.canvas);
		}

		this.currentEdge.target = target;
		// Renders the edge here to show it already attached to the target state.
		this.currentEdge.render(this.canvas);

		// The current edge is now completed, it's safe to consider it an UIEdge
		let currentEdge = <UIEdge> this.currentEdge;
		this.selectEdge(currentEdge);

		edgeText(currentEdge, (data, text) => {
			currentEdge.dataList.push(data);
			currentEdge.textList.push(text);
			this.bindEdgeEvents(currentEdge);
			// Renders it again, this time to show the finished edge
			currentEdge.render(this.canvas);
			this.updateEditableEdge(currentEdge);

			this.controller.createEdge(currentEdge);
			this.currentEdge = null;
		}, () => {
			this.updateEditableEdge(null);
			clearCurrentEdge();

			// We might have set the opposite edge curve flag, so
			// we need to unset it here.
			if (oppositeEdge) {
				oppositeEdge.setCurveFlag(false);
				oppositeEdge.render(this.canvas);
			}
		});
	}

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

	private newStateAt(x: number, y: number): void {
		if (this.locked) {
			return;
		}

		let state = new UIState();
		state.x = x;
		state.y = y;
		this.selectState(state);
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
				this.onStateCreation(state);
				this.updateEditableState(state);
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

	private onStateCreation(state: UIState): void {
		if (this.controller.empty()) {
			// The first state should be initial
			state.initial = true;
			this.initialState = state;
		}

		state.render(this.canvas);
		this.stateList[state.name] = state;
		this.controller.createState(state);
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
				edge.remove();
				this.internalDeleteEdge(edge);
			}
		});

		this.stateList[state.name].remove();
		delete this.stateList[state.name];
	}

	// ------------------------------------------------
	public deleteEdge<T extends State>(edge: Edge<T>): void {
		let {origin, target, dataList} = edge;
		let controller = Settings.controller();

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
		this.internalDeleteEdge(sameDirectionEdge);
	}

	private internalDeleteEdge<T extends State>(edge: Edge<T>): void {
		if (!this.edgeList.hasOwnProperty(edge.origin.name)) {
			return;
		}

		delete this.edgeList[edge.origin.name][edge.target.name];
	}

	// Toggles the initial flag of the highlighted state
	private toggleInitial(): void {
		let highlightedState = this.highlightedState;
		if (highlightedState) {
			this.setInitialState(highlightedState);
			highlightedState.render(this.canvas);
			this.updateEditableState(highlightedState);
		}
	}

	// Toggles the final flag of the highlighted state
	private toggleFinal(): void {
		let highlightedState = this.highlightedState;
		if (highlightedState) {
			this.changeFinalFlag(highlightedState, !highlightedState.isFinal());
			highlightedState.render(this.canvas);
			this.updateEditableState(highlightedState);
		}
	}

	private setInitialState(state: UIState): void {
		let controller = Settings.controller();
		if (state == this.initialState) {
			state.initial = false;
			this.initialState = null;
			controller.changeInitialFlag(state);
		} else {
			if (this.initialState) {
				this.initialState.setInitial(false);
				controller.changeInitialFlag(this.initialState);
				this.initialState.render(this.canvas);
			}

			state.setInitial(true);
			this.initialState = state;
			controller.changeInitialFlag(state);
		}
	}

	private changeFinalFlag(state: State, value: boolean): void {
		state.setFinal(value);
		Settings.controller().changeFinalFlag(state);
	}

	private undo(): void {
		let data = this.memento.undo();
		if (data) {
			// Blocks changes to the memento until the undo process is complete
			this.frozenMemento = true;
			this.clear();
			this.load(data, false);
		}
	}

	private redo(): void {
		let data = this.memento.redo();
		if (data) {
			// Blocks changes to the memento until the redo process is complete
			this.frozenMemento = true;
			this.clear();
			this.load(data, false);
		}
	}

	private bindShortcuts(): void {
		let group = Settings.canvasShortcutID;
		System.bindShortcut(Settings.shortcuts.toggleInitial, () => {
			this.toggleInitial();
		}, group);

		System.bindShortcut(Settings.shortcuts.toggleFinal, () => {
			this.toggleFinal();
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
				this.deleteEdge(highlightedEdge);
			}
			this.clearSelection();
		}, group);

		System.bindShortcut(Settings.shortcuts.clearMachine, () => {
			let confirmation = confirm(Strings.CLEAR_CONFIRMATION);
			if (confirmation) {
				this.clear();
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

				let threshold = self.selectionThreshold();
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
			this.undo();
		}, group);

		System.bindShortcut(Settings.shortcuts.redo, () => {
			this.redo();
		}, group);
	}

	private selectionThreshold(): number {
		return 2 * Settings.stateRadius;
	}

	private moveStateSelection(isViable: (attempt: State, highlighted: State) => boolean,
				isBetterCandidate: (attempt: State, currBest: State|null,
									highlighted: State) => boolean): void {
		let highlightedState = this.highlightedState;
		if (highlightedState) {
			let target: State|null = null;
			for (let state of this.stateList) {
				if (isViable(state, highlightedState)) {
					if (isBetterCandidate(state, target, highlightedState)) {
						target = state;
					}
				}
			}

			if (target) {
				this.selectState(target);
			}
		}
	}

	private canvas: GUI.Canvas;
	private controller: MainController;
	private node: HTMLElement;

	// private stateList: UIState[] = [];
	// private edgeList: UIEdge[] = [];

	private stateList: Map<UIState> = {};
	private edgeList: IndexedEdgeGroup<UIEdge> = {};

	private highlightedState: UIState|null = null;
	private highlightedEdge: UIEdge|null = null;

	private initialState: UIState|null = null;
	private currentEdge: PartialUIEdge|null = null;

	private edgeMode: boolean = false;
	private locked: boolean = false;

	private formalDefinitionCallback: () => void;

	private formalDefinitionRenderer: FormalDefinitionRenderer;
}
