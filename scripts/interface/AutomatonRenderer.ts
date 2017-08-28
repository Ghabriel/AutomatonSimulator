import {Edge} from "./Edge"
import {EdgeUtils} from "./EdgeUtils"
import {GUI} from "./GUI"
import {Keyboard} from "../Keyboard"
import {Memento} from "../Memento"
import {PersistenceHandler} from "../persistence/PersistenceHandler"
import {Prompt, ValuedHTMLElement} from "../Prompt"
import {Settings, Strings} from "../Settings"
import {Signal, SignalEmitter, SignalResponse} from "../SignalEmitter"
import {State} from "./State"
import {System} from "../System"
import {Table} from "./Table"
import {Point, utils} from "../Utils"

/**
 * Manages the UI representation of the automaton being manipulated, including
 * all related interactions.
 */
export class AutomatonRenderer {
	constructor(canvas: GUI.Canvas, node: Element,
				memento: Memento<string>,
				persistenceHandler: PersistenceHandler) {
		this.canvas = canvas;
		this.memento = memento;
		this.node = node;
		this.persistenceHandler = persistenceHandler;
		SignalEmitter.addSignalObserver(this);
	}

	public render(): void {
		this.bindEvents();
		this.bindShortcuts();
		this.bindFormalDefinitionListener();
		let self = this;
		System.addLanguageChangeObserver({
			onLanguageChange: function() {
				self.bindFormalDefinitionListener();

				if (self.locked) {
					self.recognitionDim();
					self.unlock();
				}

				if (self.highlightedState) {
					// Restores the "selected entity area" for states
					self.updateEditableState(self.highlightedState);
				}

				if (self.highlightedEdge) {
					// Restores the "selected entity area" for edges
					self.updateEditableEdge(self.highlightedEdge);
				}
			}
		});

		System.addMachineChangeObserver({
			onMachineChange: function() {
				self.bindFormalDefinitionListener();
			}
		});
	}

	public clear(): void {
		for (let state of this.stateList) {
			state.remove();
		}
		this.stateList = [];

		for (let edge of this.edgeList) {
			edge.remove();
		}
		this.edgeList = [];

		this.initialState = null;
		this.clearSelection();

		Settings.controller().clear();
	}

	public empty(): boolean {
		// Doesn't need to check for edgeList.length since edges
		// can't exist without states.
		return this.stateList.length == 0;
	}

	public save(): string {
		return this.persistenceHandler.save(this.stateList,
					this.edgeList, this.initialState);
	}

	public load(content: string, pushResult: boolean = true): void {
		// Blocks changes to the memento until the load process is complete
		this.frozenMemento = true;

		let loadedData = this.persistenceHandler.load(content);
		if (loadedData.error) {
			alert(Strings.INVALID_FILE);
			return;
		}

		if (loadedData.aborted) {
			return;
		}

		this.stateList = this.stateList.concat(loadedData.stateList);
		this.edgeList = this.edgeList.concat(loadedData.edgeList);
		// Only changes the initial state if the current automaton
		// doesn't have one
		if (this.initialState === null) {
			this.initialState = loadedData.initialState;
		}

		// Traverses through the state/edge lists to render them.
		// We shouldn't render them during creation because, if
		// the automaton is big enough and there's an error in the
		// source file, the user would see states and edges appearing
		// and then vanishing, then an error message. Rendering everything
		// after processing makes it so that nothing appears (except the
		// error message) if there's an error.
		for (let state of this.stateList) {
			state.render(this.canvas);
			this.bindStateEvents(state);
		}

		for (let edge of this.edgeList) {
			edge.render(this.canvas);
			this.bindEdgeEvents(edge);
		}

		this.frozenMemento = false;

		if (pushResult) {
			// Saves the resulting state
			this.memento.push(this.save());
		}
	}

	public recognitionHighlight(stateNames: string[]): void {
		let nameMapping: {[n: string]: State} = {};
		for (let state of this.stateList) {
			nameMapping[state.getName()] = state;
			state.removePalette();
		}

		for (let name of stateNames) {
			nameMapping[name].applyPalette(Settings.stateRecognitionPalette);
		}

		for (let state of this.stateList) {
			state.render(this.canvas);
		}
	}

	public recognitionDim(): void {
		for (let state of this.stateList) {
			state.removePalette();
			state.render(this.canvas);
		}
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
		this.newStateAt(stateRadius, stateRadius);
	}

	public edgeManualCreation(): void {
		if (!this.locked) {
			let self = this;
			Prompt.simple(Strings.EDGE_MANUAL_CREATION, 2, function(data) {
				let edge = new Edge();
				for (let state of self.stateList) {
					let name = state.getName();
					if (name == data[0]) {
						edge.setOrigin(state);
					}

					if (name == data[1]) {
						edge.setTarget(state);
					}
				}

				if (edge.getOrigin() && edge.getTarget()) {
					self.currentEdge = edge;
					self.finishEdge(edge.getTarget());
				} else {
					alert(Strings.ERROR_INVALID_STATE_NAME);
				}
			});
		}
	}

	public receiveSignal(signal: Signal): SignalResponse {
		if (signal.targetID == Settings.automatonRendererSignalID) {
			return {
				reacted: true,
				response: this[signal.identifier].apply(this, signal.data)
			};
		}

		return null;
	}

	// TODO: find a better name for this method
	// (since it also handles saving the current state)
	private bindFormalDefinitionListener(): void {
		let definitionContainer: HTMLDivElement = null;
		let self = this;
		let callback = function() {
			// Saves the current state to the memento if it's not frozen
			if (!self.frozenMemento) {
				self.memento.push(self.save());
			}

			if (!definitionContainer) {
				definitionContainer = <HTMLDivElement> utils.create("div");
				SignalEmitter.emitSignal({
					targetID: Settings.sidebarSignalID,
					identifier: "updateFormalDefinition",
					data: [definitionContainer]
				});
			}

			definitionContainer.innerHTML = self.buildFormalDefinition();
		};

		Settings.controller().setEditingCallback(callback);

		// Calls the callback to display the initial formal definition
		// (normally the formal definition of an empty automaton)
		callback();
	}

	private buildFormalDefinition(): string {
		let formalDefinition = Settings.controller().formalDefinition();
		// TODO: render the formal definition properly
		let tupleSequence = formalDefinition.tupleSequence;
		let content = "M = (" + tupleSequence.join(", ") + ")";
		content += Strings.DEFINITION_WHERE_SUFFIX + "<br>";
		for (let parameter of formalDefinition.parameterSequence) {
			let value = formalDefinition.parameterValues[parameter];
			let type = typeof value;
			if (type == "number" || type == "string") {
				content += parameter + " = ";
				content += value;
			} else if (value instanceof Array) {
				content += parameter + " = ";
				content += "{" + value.join(", ") + "}";
			} else if (type == "undefined") {
				content += parameter + " = ";
				content += "<span class='none'>";
				content += Strings.NO_INITIAL_STATE;
				content += "</span>";
			} else if (value.hasOwnProperty("list")) {
				let domain: string = value.domain;
				let codomain: string = value.codomain;
				let header: string[] = value.header;
				let list: string[][] = value.list;
				let arrow = Keyboard.symbols.rightArrow;

				content += parameter + ": ";
				content += domain + " " + arrow + " " + codomain;

				if (list.length > 0) {
					let table = new Table(1 + list.length, list[0].length);

					for (let i = 0; i < header.length; i++) {
						table.add(utils.create("span", {
							innerHTML: header[i]
						}));
					}

					for (let i = 0; i < list.length; i++) {
						for (let j = 0; j < list[i].length; j++) {
							table.add(utils.create("span", {
								innerHTML: list[i][j]
							}));
						}
					}

					content += "<table id='transition_table'>";
					content += table.html().innerHTML;
					content += "</table>";
				} else {
					content += "<br>";
					content += "<span class='none'>";
					content += Strings.NO_TRANSITIONS;
					content += "</span>";
				}
			} else {
				content += "unspecified type (AutomatonRenderer:235)";
			}
			content += "<br>";
		}

		return content;
	}

	private selectState(state: State) {
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

	private selectEdge(edge: Edge) {
		if (!this.locked) {
			this.dimState();
			if (this.highlightedEdge) {
				this.highlightedEdge.removeCustomColor();
				this.highlightedEdge.render(this.canvas);
			}
			edge.setCustomColor(Settings.edgeHighlightColor);
			this.highlightedEdge = edge;
			edge.render(this.canvas);

			this.updateEditableEdge(edge);
		}
	}

	private dimEdge(): void {
		if (!this.locked && this.highlightedEdge) {
			this.highlightedEdge.removeCustomColor();
			this.highlightedEdge.render(this.canvas);
			this.highlightedEdge = null;

			this.unsetSelectedEntityContent();
		}
	}

	private updateEditableState(state: State): void {
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

	private updateEditableEdge(edge: Edge): void {
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

	private showEditableState(state: State): HTMLDivElement {
		let container = <HTMLDivElement> utils.create("div");
		let table = new Table(4, 3);
		let canvas = this.canvas;
		let self = this;

		let renameStatePrompt = function() {
			let prompt = new Prompt(Strings.STATE_RENAME_ACTION);

			prompt.addInput({
				validator: function(content) {
					return content.length <= 6;
				}
			});

			prompt.onSuccess(function(data) {
				let newName = data[0];
				for (let state of self.stateList) {
					if (state.getName() == newName) {
						alert(Strings.DUPLICATE_STATE_NAME);
						renameStatePrompt();
						return;
					}
				}

				Settings.controller().renameState(state, newName);
				state.setName(newName);
				state.render(canvas);
				$("#entity_name").html(newName);
			});

			prompt.show();
		};

		let renameButton = utils.create("input", {
			type: "button",
			value: Strings.RENAME_STATE,
			click: renameStatePrompt
		});

		let toggleInitialButton = utils.create("input", {
			type: "button",
			value: Strings.TOGGLE_PROPERTY,
			click: function() {
				self.setInitialState(state);
				state.render(canvas);
				$("#entity_initial").html(state.isInitial() ? Strings.YES
															: Strings.NO);
			}
		});

		let toggleFinalButton = utils.create("input", {
			type: "button",
			value: Strings.TOGGLE_PROPERTY,
			click: function() {
				self.changeFinalFlag(state, !state.isFinal());
				state.render(canvas);
				$("#entity_final").html(state.isFinal() ? Strings.YES
														  : Strings.NO);
			}
		});

		let deleteButton = utils.create("input", {
			type: "button",
			value: Strings.DELETE_STATE,
			click: function() {
				self.deleteState(state);
				self.clearSelection();
				self.unsetSelectedEntityContent();
			}
		});

		table.add(utils.create("span", { innerHTML: Strings.STATE_NAME + ":" }));
		table.add(utils.create("span", { innerHTML: state.getName(),
										 className: "property_value",
										 id: "entity_name" }));
		table.add(renameButton);
		table.add(utils.create("span", { innerHTML: Strings.STATE_IS_INITIAL + ":" }));
		table.add(utils.create("span", { innerHTML: state.isInitial() ? Strings.YES
																	  : Strings.NO,
										 className: "property_value",
										 id: "entity_initial" }));
		table.add(toggleInitialButton);
		table.add(utils.create("span", { innerHTML: Strings.STATE_IS_FINAL + ":" }));
		table.add(utils.create("span", { innerHTML: state.isFinal() ? Strings.YES
																	: Strings.NO,
										 className: "property_value",
										 id: "entity_final" }));
		table.add(toggleFinalButton);
		table.add(deleteButton, 3);
		container.appendChild(table.html());
		return container;
	}

	// After an edge is edited, this method makes sure that curved flags
	// are correctly turned on/off and same origin/target edges are properly
	// merged. Receives as input the edge that has just been edited.
	// TODO: avoid code duplication (see finishEdge())
	private fixEdgeConsistency(newEdge: Edge): void {
		let origin = newEdge.getOrigin();
		let target = newEdge.getTarget();

		let oppositeEdge: Edge = null;
		let mergedEdge: Edge = null;
		let edgeIndex: number = -1;
		let pendingRemoval: boolean = false;

		let i = 0;
		for (let edge of this.edgeList) {
			if (edge.getOrigin() == origin && edge.getTarget() == target) {
				if (edge != newEdge) {
					// Add the edge's text to it instead and delete the new edge.
					let dataList = newEdge.getDataList();
					let textList = newEdge.getTextList();
					let length = dataList.length;
					for (let i = 0; i < length; i++) {
						edge.addData(dataList[i]);
						edge.addText(textList[i]);
					}
					edge.render(this.canvas);

					mergedEdge = edge;
					pendingRemoval = true;
				} else {
					edgeIndex = i;
				}
			} else if (edge.getOrigin() == target && edge.getTarget() == origin) {
				oppositeEdge = edge;
			}
			i++;
		}

		if (oppositeEdge) {
			// Both edges should become curved.
			oppositeEdge.setCurveFlag(true);
			oppositeEdge.render(this.canvas);

			newEdge.setCurveFlag(true);
			newEdge.render(this.canvas);
		} else {
			newEdge.setCurveFlag(false);
			newEdge.render(this.canvas);
			// TODO: 'un-curve' edges that no longer have an opposite
		}

		if (pendingRemoval && edgeIndex > -1) {
			if (this.highlightedEdge == newEdge) {
				this.selectEdge(mergedEdge);
			}
			newEdge.remove();
			this.edgeList.splice(edgeIndex, 1);
		}
	}

	private showEditableEdge(edge: Edge): HTMLDivElement {
		let container = <HTMLDivElement> utils.create("div");
		let table = new Table(5, 3);
		let canvas = this.canvas;
		let self = this;
		let changeOriginButton = utils.create("input", {
			type: "button",
			value: Strings.CHANGE_PROPERTY,
			click: function() {
				let newOrigin = prompt(Strings.EDGE_ENTER_NEW_ORIGIN);
				if (newOrigin !== null) {
					for (let state of self.stateList) {
						if (state.getName() == newOrigin) {
							edge.setOrigin(state);
							self.fixEdgeConsistency(edge);
						}
					}

					if (!edge.removed()) {
						edge.render(canvas);
					}
					$("#entity_origin").html(newOrigin);
				}
			}
		});
		let changeTargetButton = utils.create("input", {
			type: "button",
			value: Strings.CHANGE_PROPERTY,
			click: function() {
				let newTarget = prompt(Strings.EDGE_ENTER_NEW_TARGET);
				if (newTarget !== null) {
					for (let state of self.stateList) {
						if (state.getName() == newTarget) {
							edge.setTarget(state);
							self.fixEdgeConsistency(edge);
						}
					}

					if (!edge.removed()) {
						edge.render(canvas);
					}
					$("#entity_target").html(newTarget);
				}
			}
		});
		let changeTransitionButton = utils.create("input", {
			type: "button",
			value: Strings.CHANGE_PROPERTY,
			click: function() {
				let transitionSelector = <HTMLSelectElement> $("#entity_transition_list").get(0);
				let selectedIndex = transitionSelector.selectedIndex;
				let controller = Settings.controller();

				let prompt = controller.edgePrompt(function(data, content) {
					// TODO: check if the new content conflicts with an already
					// existing transition in this edge (e.g 0,1 -> 1,1)
					let origin = edge.getOrigin();
					let target = edge.getTarget();
					let dataList = edge.getDataList();
					controller.deleteEdge(origin, target, dataList[selectedIndex]);
					edge.getDataList()[selectedIndex] = data;
					edge.getTextList()[selectedIndex] = content;
					edge.render(self.canvas);
					controller.createEdge(origin, target, data);
					self.updateEditableEdge(edge);
				});

				prompt.show();
			}
		});
		let deleteTransitionButton = utils.create("input", {
			type: "button",
			value: Strings.DELETE_SELECTED_TRANSITION,
			click: function() {
				let transitionSelector = <HTMLSelectElement> $("#entity_transition_list").get(0);
				let selectedIndex = transitionSelector.selectedIndex;

				let controller = Settings.controller();
				let origin = edge.getOrigin();
				let target = edge.getTarget();
				let dataList = edge.getDataList();

				controller.deleteEdge(origin, target, dataList[selectedIndex]);
				edge.getDataList().splice(selectedIndex, 1);
				edge.getTextList().splice(selectedIndex, 1);

				if (dataList.length == 0) {
					self.deleteEdge(edge);
					self.clearSelection();
					self.unsetSelectedEntityContent();
				} else {
					edge.render(self.canvas);
					self.updateEditableEdge(edge);
				}
			}
		});
		let deleteAllButton = utils.create("input", {
			title: utils.printShortcut(Settings.shortcuts.deleteEntity),
			type: "button",
			value: Strings.DELETE_ALL_TRANSITIONS,
			click: function() {
				self.deleteEdge(edge);
				self.clearSelection();
				self.unsetSelectedEntityContent();
			}
		});

		table.add(utils.create("span", { innerHTML: Strings.ORIGIN + ":" }));
		table.add(utils.create("span", { innerHTML: edge.getOrigin().getName(),
										 className: "property_value",
										 id: "entity_origin" }));
		table.add(changeOriginButton);
		table.add(utils.create("span", { innerHTML: Strings.TARGET + ":" }));
		table.add(utils.create("span", { innerHTML: edge.getTarget().getName(),
										 className: "property_value",
										 id: "entity_target" }));
		table.add(changeTargetButton);

		let textSelector = <HTMLSelectElement> utils.create("select", {
			id: "entity_transition_list"
		});
		let textList = edge.getTextList();
		let i = 0;
		for (let text of textList) {
			let option = utils.create("option", { value: i, innerHTML: text });
			textSelector.appendChild(option);
			i++;
		}
		table.add(utils.create("span", { innerHTML: Strings.TRANSITIONS + ":" }));
		table.add(textSelector);
		table.add(changeTransitionButton);

		table.add(deleteTransitionButton, 3);
		table.add(deleteAllButton, 3);
		container.appendChild(table.html());
		return container;
	}

	private unsetSelectedEntityContent() {
		SignalEmitter.emitSignal({
			targetID: Settings.sidebarSignalID,
			identifier: "unsetSelectedEntityContent",
			data: []
		});
	}

	private bindEvents(): void {
		for (let state of this.stateList) {
			state.render(this.canvas);
			this.bindStateEvents(state);
		}

		for (let edge of this.edgeList) {
			this.bindEdgeEvents(edge);
		}

		let self = this;
		$(this.node).dblclick(function(e) {
			// Avoids a bug where double clicking a Prompt
			// would trigger a state creation
			if (e.target.tagName.toLowerCase() == "svg") {
				let x = e.pageX - this.offsetLeft;
				let y = e.pageY - this.offsetTop;
				self.newStateAt(x, y);
			}
		});

		$(this.node).contextmenu(function(e) {
			e.preventDefault();
			return false;
		});

		$(this.node).mousemove(function(e) {
			if (self.edgeMode) {
				self.adjustEdge(this, e);
			}
		});
	}

	private bindEdgeEvents(edge: Edge) {
		let self = this;
		edge.addClickHandler(function() {
			self.selectEdge(this);
		});
	}

	private bindStateEvents(state: State) {
		let canvas = this.canvas;
		let self = this;
		// Ideally, separating left click/right click dragging handlers would
		// provide better usability. Unfortunately, many SVG frameworks don't
		// allow such separation.
		state.drag(function() {
			self.updateEdges();
		}, function(distanceSquared, event) {
			if (!self.locked && distanceSquared <= Settings.stateDragTolerance) {
				if (self.edgeMode) {
					self.finishEdge(state);
				} else if (utils.isRightClick(event)) {
					self.beginEdge(state);
				} else if (state == self.highlightedState) {
					self.dimState();
				} else {
					self.selectState(state);
				}
				return false;
			}

			// Saves the post-drag state to the memento
			// to allow the user to undo it
			self.memento.push(self.save());
			return true;
		});
	}

	private beginEdge(state: State): void {
		this.edgeMode = true;
		this.currentEdge = new Edge();
		this.currentEdge.setOrigin(state);
	}

	private finishEdge(state: State): void {
		this.edgeMode = false;
		let origin = this.currentEdge.getOrigin();

		let edgeText = function(edge: Edge,
								callback: (d: string[], t: string) => void,
								fallback: () => void) {
			let controller = Settings.controller();
			let prompt = controller.edgePrompt(function(data, content) {
				callback(data, content);
				controller.createEdge(origin, state, data);
			}, fallback);

			let edgeOrigin = edge.getOrigin();
			let edgeTarget = edge.getTarget();
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

		let oppositeEdge: Edge = null;

		let clearCurrentEdge = function() {
			self.currentEdge.remove();
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

		edgeText(self.currentEdge, function(data, text) {
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

	private adjustEdge(elem: HTMLElement, e): void {
		let target = {
			x: e.pageX - elem.offsetLeft,
			y: e.pageY - elem.offsetTop
		};
		this.currentEdge.setVirtualTarget(target);
		this.currentEdge.render(this.canvas);
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
			this.currentEdge.remove();
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
		let origin = edge.getOrigin();
		let target = edge.getTarget();
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
		// Blocks changes to the memento until the undo process is complete
		this.frozenMemento = true;

		let data = this.memento.undo();
		if (data) {
			this.clear();
			this.load(data, false);
		}
	}

	private redo(): void {
		// Blocks changes to the memento until the redo process is complete
		this.frozenMemento = true;

		let data = this.memento.redo();
		if (data) {
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
				self.currentEdge.remove();
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
				isBetterCandidate: (attempt: State, currBest: State,
									highlighted: State) => boolean): void {
		let highlightedState = this.highlightedState;
		if (highlightedState) {
			let target: State = null;
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

	private canvas: GUI.Canvas = null;
	private node: Element = null;
	private stateList: State[] = [];
	private edgeList: Edge[] = [];
	private highlightedState: State = null;
	private highlightedEdge: Edge = null;
	private initialState: State = null;
	private edgeMode: boolean = false;
	private currentEdge: Edge = null;

	private locked: boolean = false;
	private memento: Memento<string> = null;
	private frozenMemento: boolean = false;

	private persistenceHandler: PersistenceHandler;
}
