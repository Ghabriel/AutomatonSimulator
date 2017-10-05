import {UIEdge} from "./Edge"
import {edgeInfoPrinter} from "./EdgeInfoPrinter"
import {EdgeUtils} from "./EdgeUtils"
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

	private createEdge<T extends State>(edge: Edge<T>): UIEdge {
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

	// public receiveSignal(signal: Signal): SignalResponse|null {
	// 	if (signal.targetID == Settings.automatonRendererSignalID) {
	// 		let methodName = <keyof this> signal.identifier;
	// 		let method = <Function> <any> this[methodName];

	// 		return {
	// 			reacted: true,
	// 			response: method.apply(this, signal.data)
	// 		};
	// 	}

	// 	return null;
	// }

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

	private getEdge(origin: UIState, target: UIState): UIEdge|null {
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

	// ------------------------------------------------
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
			this.updateEdges();
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

			// Saves the post-drag state to the memento
			// to allow the user to undo it
			this.memento.push(this.save());
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

	private beginEdge(state: State): void {
		this.edgeMode = true;
		this.currentEdge = new Edge();
		this.currentEdge.setOrigin(state);
	}

	private finishEdge(state: State): void {
		this.edgeMode = false;
		if (!this.currentEdge) {
			// shouldn't happen, just for type safety
			throw Error();
		}

		let origin = this.currentEdge.getOrigin()!;

		let edgeText = function(edge: Edge,
								callback: (d: string[], t: string) => void,
								fallback: () => void) {
			let controller = Settings.controller();
			let prompt = controller.edgePrompt(function(data, content) {
				callback(data, content);
				controller.createEdge(origin, state, data);
			}, fallback);

			let edgeOrigin = edge.getOrigin()!;
			let edgeTarget = edge.getTarget()!;
			let originPosition = edgeOrigin.getPosition();
			let targetPosition = edgeTarget.getPosition();
			if (edgeOrigin == edgeTarget) {
				// Loop edge
				let x = originPosition.x + edgeOrigin.getRadius();
				let y = originPosition.y - edgeOrigin.getRadius();
				prompt.setPosition(x, y);
			} else {
				let averageX = (originPosition.x + targetPosition.x) / 2;
				let averageY = (originPosition.y + targetPosition.y) / 2;
				prompt.setPosition(averageX, averageY);
			}

			prompt.show();
		};

		let self = this;

		let oppositeEdge: Edge|null = null;

		let clearCurrentEdge = function() {
			self.dimEdge();
			self.currentEdge!.remove();
			self.currentEdge = null;
		};


		// Checks if there's already an edge linking the origin and target
		// states in either direction (to make the new edge a curved one if
		// there's an edge in the opposite direction)
		for (let edge of this.edgeList) {
			if (edge.getOrigin() == origin && edge.getTarget() == state) {
				edgeText(edge, function(data, text) {
					// Add the text to it instead and delete 'this.currentEdge'.
					edge.addText(text);
					edge.addData(data);
					edge.render(self.canvas);
					self.selectEdge(edge);
					clearCurrentEdge();
				}, clearCurrentEdge);
				return;
			} else if (edge.getOrigin() == state && edge.getTarget() == origin) {
				oppositeEdge = edge;
			}
		}

		// There's no such edge yet, so continue the configure the new one.
		if (oppositeEdge) {
			this.currentEdge.setCurveFlag(true);

			// Makes the opposite edge a curved one as well.
			oppositeEdge.setCurveFlag(true);
			oppositeEdge.render(this.canvas);
		}

		this.currentEdge.setTarget(state);
		// Renders the edge here to show it already attached to the target state.
		this.currentEdge.render(this.canvas);
		this.selectEdge(this.currentEdge);

		edgeText(self.currentEdge!, function(data, text) {
			if (!self.currentEdge) {
				// shouldn't happen, just for type safety
				throw Error();
			}

			self.currentEdge.addText(text);
			self.currentEdge.addData(data);
			self.bindEdgeEvents(self.currentEdge);
			// Renders it again, this time to show the finished edge
			self.currentEdge.render(self.canvas);
			self.updateEditableEdge(self.currentEdge);
			self.edgeList.push(self.currentEdge);
			self.currentEdge = null;
		}, function() {
			self.updateEditableEdge(null);
			clearCurrentEdge();

			// We might have set the opposite edge curve flag, so
			// we need to unset it here.
			if (oppositeEdge) {
				oppositeEdge.setCurveFlag(false);
				oppositeEdge.render(self.canvas);
			}
		});
	}

	private adjustEdge(elem: HTMLElement, e: MouseEvent): void {
		let target = {
			x: e.pageX - elem.offsetLeft,
			y: e.pageY - elem.offsetTop
		};
		this.currentEdge!.setVirtualTarget(target);
		this.currentEdge!.render(this.canvas);
	}

	private updateEdges(): void {
		for (let edge of this.edgeList) {
			edge.render(this.canvas);
		}
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
		if (!this.locked) {
			let state = new State();
			state.setPosition(x, y);
			this.selectState(state);
			this.bindStateEvents(state);

			let self = this;
			let stateNamePrompt = function() {
				let prompt = new Prompt(Strings.STATE_MANUAL_CREATION);

				prompt.addInput({
					validator: utils.nonEmptyStringValidator
				});

				let radius = state.getRadius();
				prompt.setPosition(x + radius, y - radius);

				prompt.onSuccess(function(data) {
					let name = data[0];
					for (let state of self.stateList) {
						if (state.getName() == name) {
							alert(Strings.DUPLICATE_STATE_NAME);
							return stateNamePrompt();
						}
					}

					state.setName(name);
					self.onStateCreation(state);
					self.updateEditableState(state);
				});

				prompt.onAbort(function() {
					self.highlightedState = null;
					state.remove();
					self.updateEditableState(null);
				});

				prompt.show();
			};

			stateNamePrompt();
		}
	}

	private onStateCreation(state: State): void {
		if (this.stateList.length == 0) {
			// The first state should be initial
			state.setInitial(true);
			this.initialState = state;
		}

		state.render(this.canvas);
		this.stateList.push(state);
		Settings.controller().createState(state);
	}

	private setInitialState(state: State): void {
		let controller = Settings.controller();
		if (state == this.initialState) {
			state.setInitial(false);
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

	private deleteState(state: State): void {
		for (let i = 0; i < this.edgeList.length; i++) {
			let edge = this.edgeList[i];
			let origin = edge.getOrigin();
			let target = edge.getTarget();
			if (origin == state || target == state) {
				edge.remove();
				this.edgeList.splice(i, 1);
				i--;
			}
		}

		state.remove();

		let states = this.stateList;
		for (let i = 0; i < states.length; i++) {
			if (states[i] == state) {
				states.splice(i, 1);
				break;
			}
		}

		Settings.controller().deleteState(state);
	}

	private deleteEdge(edge: Edge): void {
		let origin = edge.getOrigin()!;
		let target = edge.getTarget()!;
		let dataLists = edge.getDataList();
		let controller = Settings.controller();

		// Searches for an existing edge that points
		// to the opposite direction
		for (let candidate of this.edgeList) {
			if (candidate.getOrigin() == target && candidate.getTarget() == origin) {
				// If found, un-curve it.
				candidate.setCurveFlag(false);
				candidate.render(this.canvas);
				break;
			}
		}

		// Removes the relevant transitions from the underlying structure
		for (let data of dataLists) {
			controller.deleteEdge(origin, target, data);
		}

		// Erases the edge from the screen and removes it
		// from the edge array
		for (let i = 0; i < this.edgeList.length; i++) {
			if (this.edgeList[i] == edge) {
				edge.remove();
				this.edgeList.splice(i, 1);
				break;
			}
		}
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
		let self = this;
		let group = Settings.canvasShortcutID;
		System.bindShortcut(Settings.shortcuts.toggleInitial, function() {
			self.toggleInitial();
		}, group);

		System.bindShortcut(Settings.shortcuts.toggleFinal, function() {
			self.toggleFinal();
		}, group);

		System.bindShortcut(Settings.shortcuts.dimSelection, function() {
			if (self.edgeMode) {
				self.edgeMode = false;
				self.currentEdge!.remove();
				self.currentEdge = null;
			}
			self.dimState();
			self.dimEdge();
		}, group);

		System.bindShortcut(Settings.shortcuts.deleteEntity, function() {
			let highlightedState = self.highlightedState;
			let highlightedEdge = self.highlightedEdge;
			if (highlightedState) {
				self.deleteState(highlightedState);
			} else if (highlightedEdge) {
				self.deleteEdge(highlightedEdge);
			}
			self.clearSelection();
		}, group);

		System.bindShortcut(Settings.shortcuts.clearMachine, function() {
			let confirmation = confirm(Strings.CLEAR_CONFIRMATION);
			if (confirmation) {
				self.clear();
			}
		}, group);

		// TODO: try to reduce the redundancy
		System.bindShortcut(Settings.shortcuts.left, function() {
			self.moveStateSelection(function(attempt, highlighted) {
				return attempt.getPosition().x < highlighted.getPosition().x;
			}, function(attempt, currBest, highlighted) {
				if (!currBest) {
					return true;
				}

				let reference = highlighted.getPosition();
				let position = attempt.getPosition();
				let dy = Math.abs(position.y - reference.y);
				let targetPosition = currBest.getPosition();
				let targetDy = Math.abs(targetPosition.y - reference.y);

				let threshold = self.selectionThreshold();
				if (dy < threshold) {
					return targetDy >= threshold || position.x > targetPosition.x;
				}

				return dy < targetDy;
			});
		}, group);

		System.bindShortcut(Settings.shortcuts.right, function() {
			self.moveStateSelection(function(attempt, highlighted) {
				return attempt.getPosition().x > highlighted.getPosition().x;
			}, function(attempt, currBest, highlighted) {
				if (!currBest) {
					return true;
				}

				let reference = highlighted.getPosition();
				let position = attempt.getPosition();
				let dy = Math.abs(position.y - reference.y);
				let targetPosition = currBest.getPosition();
				let targetDy = Math.abs(targetPosition.y - reference.y);

				let threshold = self.selectionThreshold();
				if (dy < threshold) {
					return targetDy >= threshold || position.x < targetPosition.x;
				}

				return dy < targetDy;
			});
		}, group);

		System.bindShortcut(Settings.shortcuts.up, function() {
			self.moveStateSelection(function(attempt, highlighted) {
				return attempt.getPosition().y < highlighted.getPosition().y;
			}, function(attempt, currBest, highlighted) {
				if (!currBest) {
					return true;
				}

				let reference = highlighted.getPosition();
				let position = attempt.getPosition();
				let dx = Math.abs(position.x - reference.x);
				let targetPosition = currBest.getPosition();
				let targetDx = Math.abs(targetPosition.x - reference.x);

				let threshold = self.selectionThreshold();
				if (dx < threshold) {
					return targetDx >= threshold || position.y > targetPosition.y;
				}

				return dx < targetDx;
			});
		}, group);

		System.bindShortcut(Settings.shortcuts.down, function() {
			self.moveStateSelection(function(attempt, highlighted) {
				return attempt.getPosition().y > highlighted.getPosition().y;
			}, function(attempt, currBest, highlighted) {
				if (!currBest) {
					return true;
				}

				let reference = highlighted.getPosition();
				let position = attempt.getPosition();
				let dx = Math.abs(position.x - reference.x);
				let targetPosition = currBest.getPosition();
				let targetDx = Math.abs(targetPosition.x - reference.x);

				let threshold = self.selectionThreshold();
				if (dx < self.selectionThreshold()) {
					return targetDx >= threshold || position.y < targetPosition.y;
				}

				return dx < targetDx;
			});
		}, group);

		System.bindShortcut(Settings.shortcuts.undo, function() {
			self.undo();
		}, group);

		System.bindShortcut(Settings.shortcuts.redo, function() {
			self.redo();
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
	private edgeMode: boolean = false;
	private currentEdge: UIEdge|null = null;
	private locked: boolean = false;

	private formalDefinitionCallback: () => void;

	private formalDefinitionRenderer: FormalDefinitionRenderer;
}
