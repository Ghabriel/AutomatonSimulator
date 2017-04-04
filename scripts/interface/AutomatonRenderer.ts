import {Edge} from "./Edge"
import {Settings, Strings} from "../Settings"
import {State} from "./State"
import {Point, utils} from "../Utils"
import {Table} from "./Table"

export class AutomatonRenderer {
	constructor(canvas: RaphaelPaper, node: Element) {
		this.canvas = canvas;
		this.node = node;
	}

	public render(): void {
		let q0 = this.newState("q0");
		q0.setPosition(100, 200);

		let q1 = this.newState("q1");
		q1.setPosition(250, 350);

		let q2 = this.newState("q2");
		q2.setPosition(450, 350);

		let q3 = this.newState("q3");
		q3.setPosition(650, 350);

		let e1 = new Edge();
		e1.setOrigin(q0);
		e1.setTarget(q0);
		this.addEdgeData(e1, ["0"]);
		this.addEdgeData(e1, ["1"]);
		this.edgeList.push(e1);

		let e2 = new Edge();
		e2.setOrigin(q0);
		e2.setTarget(q1);
		this.addEdgeData(e2, ["1"]);
		this.edgeList.push(e2);

		let e3 = new Edge();
		e3.setOrigin(q1);
		e3.setTarget(q2);
		this.addEdgeData(e3, ["0"]);
		this.addEdgeData(e3, ["1"]);
		this.edgeList.push(e3);

		let e4 = new Edge();
		e4.setOrigin(q2);
		e4.setTarget(q3);
		this.addEdgeData(e4, ["0"]);
		this.addEdgeData(e4, ["1"]);
		this.edgeList.push(e4);

		this.updateEdges();

		this.setInitialState(q0);
		this.changeFinalFlag(q3, true);



		this.bindEvents();
		this.bindShortcuts();
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
		let result: any = [
			Settings.Machine[Settings.currentMachine], // automaton type
			[], // state list
			[], // edge list
			-1  // initial state index
		];

		let i = 0;
		for (let state of this.stateList) {
			let position = state.getPosition();
			result[1].push([
				state.getName(),
				state.isFinal() ? 1 : 0,
				position.x,
				position.y
			]);

			if (state == this.initialState) {
				result[3] = i;
			}

			i++;
		}

		for (let edge of this.edgeList) {
			result[2].push([
				edge.getOrigin().getName(),
				edge.getTarget().getName(),
				edge.getDataList()
			]);
		}

		return JSON.stringify(result);
	}

	public load(content: string): void {
		let self = this;
		let error = function() {
			self.clear();
			alert("Invalid file");
		};

		let obj: any = [];
		try {
			obj = JSON.parse(content);
		} catch (e) {
			error();
			return;
		}

		let machineType = Settings.Machine[Settings.currentMachine];
		let validation = obj[0] == machineType
					  && obj[1] instanceof Array
					  && obj[2] instanceof Array
					  && typeof obj[3] == "number"
					  && obj.length == 4;

		if (!validation) {
			error();
			return;
		}

		let nameToIndex: {[n: string]: number} = {};
		let controller = Settings.controller();

		let i = 0;
		for (let data of obj[1]) {
			let isInitial = (obj[3] == i);
			let state = new State();
			state.setName(data[0]);
			state.setInitial(isInitial);
			state.setFinal(!!data[1]);
			state.setPosition(data[2], data[3]);

			if (isInitial) {
				this.initialState = state;
			}

			nameToIndex[data[0]] = i;
			this.stateList.push(state);
			controller.createState(state);
			i++;
		}

		let states = this.stateList;
		for (let edgeData of obj[2]) {
			if (edgeData.length != 3) {
				error();
				return;
			}
			let edge = new Edge();
			let origin = states[nameToIndex[edgeData[0]]];
			let target = states[nameToIndex[edgeData[1]]];
			edge.setOrigin(origin);
			edge.setTarget(target);
			for (let data of edgeData[2]) {
				this.addEdgeData(edge, data);
			}

			this.edgeList.push(edge);
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
		}
	}

	// TODO: make this method faster
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
		utils.lockShortcutGroup(Settings.canvasShortcutID);
		this.locked = true;
	}

	public unlock(): void {
		utils.unlockShortcutGroup(Settings.canvasShortcutID);
		this.locked = false;
	}

	public stateManualCreation(): void {
		let stateRadius = Settings.stateRadius;
		this.newStateAt(stateRadius, stateRadius);
	}

	public edgeManualCreation(): void {
		if (!this.locked) {
			let self = this;
			utils.prompt("Choose the origin and destination", 2, function(data) {
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

			Settings.sidebar.unsetSelectedEntityContent();
		}
	}

	private selectEdge(edge: Edge) {
		if (!this.locked) {
			this.dimState();
			if (this.highlightedEdge) {
				this.highlightedEdge.removeCustomColor();
				this.highlightedEdge.render(this.canvas);
			}
			edge.setCustomColor("red");
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

			Settings.sidebar.unsetSelectedEntityContent();
		}
	}

	private updateEditableState(state: State): void {
		Settings.sidebar.unsetSelectedEntityContent();
		if (state) {
			Settings.sidebar.setSelectedEntityContent(this.showEditableState(state));
		}
	}

	private updateEditableEdge(edge: Edge): void {
		Settings.sidebar.unsetSelectedEntityContent();
		if (edge) {
			Settings.sidebar.setSelectedEntityContent(this.showEditableEdge(edge));
		}
	}

	private showEditableState(state: State): HTMLDivElement {
		let container = <HTMLDivElement> utils.create("div");
		let table = new Table(4, 3);
		let canvas = this.canvas;
		let self = this;
		let renameButton = utils.create("input", {
			type: "button",
			value: Strings.RENAME_STATE,
			click: function() {
				let newName = prompt("gimme new name pl0x");
				// TODO: check if the chosen name is already in use
				state.setName(newName);
				state.render(canvas);
				$("#entity_name").html(newName);
			}
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
				Settings.sidebar.unsetSelectedEntityContent();
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

	private showEditableEdge(edge: Edge): HTMLDivElement {
		let container = <HTMLDivElement> utils.create("div");
		let table = new Table(5, 3);
		let canvas = this.canvas;
		let self = this;
		// TODO: check for already existing edges after changing origin/target
		let changeOriginButton = utils.create("input", {
			type: "button",
			value: Strings.CHANGE_PROPERTY,
			click: function() {
				let newOrigin = prompt("gimme new origin pl0x");
				for (let state of self.stateList) {
					if (state.getName() == newOrigin) {
						edge.setOrigin(state);
					}
				}
				edge.render(canvas);
				$("#entity_origin").html(newOrigin);
			}
		});
		let changeTargetButton = utils.create("input", {
			type: "button",
			value: Strings.CHANGE_PROPERTY,
			click: function() {
				let newTarget = prompt("gimme new target pl0x");
				for (let state of self.stateList) {
					if (state.getName() == newTarget) {
						edge.setTarget(state);
					}
				}
				edge.render(canvas);
				$("#entity_target").html(newTarget);
			}
		});
		let changeTransitionButton = utils.create("input", {
			type: "button",
			value: Strings.CHANGE_PROPERTY,
			click: function() {
				let transitionSelector = <HTMLSelectElement> $("#entity_transition_list").get(0);
				let selectedIndex = transitionSelector.selectedIndex;
				let controller = Settings.controller();
				controller.edgePrompt(function(data, content) {
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
					Settings.sidebar.unsetSelectedEntityContent();
				} else {
					edge.render(self.canvas);
					self.updateEditableEdge(edge);
				}
			}
		});
		let deleteAllButton = utils.create("input", {
			type: "button",
			value: Strings.DELETE_ALL_TRANSITIONS,
			click: function() {
				self.deleteEdge(edge);
				self.clearSelection();
				Settings.sidebar.unsetSelectedEntityContent();
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
			self.newStateAt(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
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
		// TODO: separate left click/right click dragging handlers if possible
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

		let edgeText = function(callback: (d: string[], t: string) => void,
								fallback: () => void) {
			let controller = Settings.controller();
			controller.edgePrompt(function(data, content) {
				controller.createEdge(origin, state, data);
				callback(data, content);
			}, fallback);
		};

		let self = this;

		let clearCurrentEdge = function() {
			self.currentEdge.remove();
			self.currentEdge = null;
		};

		// Checks if there's already an edge linking the origin and target states
		for (let edge of this.edgeList) {
			if (edge.getOrigin() == origin && edge.getTarget() == state) {
				edgeText(function(data, text) {
					// Add the text to it instead and delete 'this.currentEdge'.
					edge.addText(text);
					edge.addData(data);
					edge.render(self.canvas);
					clearCurrentEdge();
				}, clearCurrentEdge);
				return;
			}
		}

		// There's no such edge yet, so continue the configure the new one.
		this.currentEdge.setTarget(state);
		// Renders the edge here to show it already attached to the target state
		this.currentEdge.render(this.canvas);

		edgeText(function(data, text) {
			self.currentEdge.addText(text);
			self.currentEdge.addData(data);
			self.bindEdgeEvents(self.currentEdge);
			// Renders it again, this time to show the finished edge
			self.currentEdge.render(self.canvas);
			self.edgeList.push(self.currentEdge);
			self.currentEdge = null;
		}, clearCurrentEdge);
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
		Settings.sidebar.unsetSelectedEntityContent();
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
				utils.prompt("Enter the state name:", 1, function(data) {
					let name = data[0];
					for (let state of self.stateList) {
						if (state.getName() == name) {
							alert("State name already in use");
							return stateNamePrompt();
						}
					}

					self.stateList.push(state);
					state.setName(name);
					state.render(self.canvas);
					Settings.controller().createState(state);
					self.updateEditableState(state);
				}, function() {
					self.highlightedState = null;
					state.remove();
					self.updateEditableState(null);
				});
			};

			stateNamePrompt();
		}
	}

	private newState(name: string): State {
		let state = new State();
		state.setName(name);
		this.stateList.push(state);
		Settings.controller().createState(state);
		return state;
	}

	private setInitialState(state: State): void {
		let controller = Settings.controller();
		if (state == this.initialState) {
			state.setInitial(false);
			controller.changeInitialFlag(state);
			this.initialState = null;
		} else {
			if (this.initialState) {
				this.initialState.setInitial(false);
				controller.changeInitialFlag(this.initialState);
				this.initialState.render(this.canvas);
			}

			state.setInitial(true);
			controller.changeInitialFlag(state);
			this.initialState = state;
		}
	}

	private changeFinalFlag(state: State, value: boolean): void {
		state.setFinal(value);
		Settings.controller().changeFinalFlag(state);
	}

	private addEdgeData(edge: Edge, data: string[]): void {
		let controller = Settings.controller();
		edge.addText(controller.edgeDataToText(data));
		edge.addData(data);
		controller.createEdge(edge.getOrigin(), edge.getTarget(), data);
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
		}
	}

	// Toggles the final flag of the highlighted state
	private toggleFinal(): void {
		let highlightedState = this.highlightedState;
		if (highlightedState) {
			this.changeFinalFlag(highlightedState, !highlightedState.isFinal());
			highlightedState.render(this.canvas);
		}
	}

	private bindShortcuts(): void {
		let self = this;
		let group = Settings.canvasShortcutID;
		utils.bindShortcut(Settings.shortcuts.toggleInitial, function() {
			self.toggleInitial();
		}, group);

		utils.bindShortcut(Settings.shortcuts.toggleFinal, function() {
			self.toggleFinal();
		}, group);

		utils.bindShortcut(Settings.shortcuts.dimSelection, function() {
			if (self.edgeMode) {
				self.edgeMode = false;
				self.currentEdge.remove();
				self.currentEdge = null;
			}
			self.dimState();
			self.dimEdge();
		}, group);

		utils.bindShortcut(Settings.shortcuts.deleteState, function() {
			let highlightedState = self.highlightedState;
			if (highlightedState) {
				self.deleteState(highlightedState);
				self.clearSelection();
			}
		}, group);

		utils.bindShortcut(Settings.shortcuts.clearMachine, function() {
			let confirmation = confirm(Strings.CLEAR_CONFIRMATION);
			if (confirmation) {
				self.clear();
			}
		}, group);

		// TODO: try to reduce the redundancy
		utils.bindShortcut(Settings.shortcuts.left, function() {
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

		utils.bindShortcut(Settings.shortcuts.right, function() {
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

		utils.bindShortcut(Settings.shortcuts.up, function() {
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

		utils.bindShortcut(Settings.shortcuts.down, function() {
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

		utils.bindShortcut(Settings.shortcuts.undo, function() {
			// TODO
			alert("TODO: undo");
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

	private canvas: RaphaelPaper = null;
	private node: Element = null;
	private stateList: State[] = [];
	// TODO: find a better data structure than a simple array
	private edgeList: Edge[] = [];
	private highlightedState: State = null;
	private highlightedEdge: Edge = null;
	private initialState: State = null;
	private edgeMode: boolean = false;
	private currentEdge: Edge = null;

	private locked: boolean = false;
}
