import {Edge} from "./Edge"
import {Settings, Strings} from "../Settings"
import {State} from "./State"
import {Point, utils} from "../Utils"

export class AutomatonRenderer {
	constructor(canvas:  RaphaelPaper, node: Element) {
		this.canvas = canvas;
		this.node = node;
	}

	public render(): void {
		// let state = new State();
		// state.setPosition(350, 300);
		// this.stateList.push(state);

		// let groups = [
		// 	[100, 300],
		// 	[350, 50],
		// 	[600, 300],
		// 	[350, 550]
		// ];

		// let i = 0;
		// for (let group of groups) {
		// 	let s = new State();
		// 	s.setPosition(group[0], group[1]);
		// 	this.stateList.push(s);

		// 	let e = new Edge();
		// 	if (i == 1) {
		// 		e.setOrigin(s);
		// 		e.setTarget(state);
		// 	} else {
		// 		e.setOrigin(state);
		// 		e.setTarget(s);
		// 	}
		// 	i++;
		// 	this.edgeList.push(e);
		// }

		// this.stateList[2].setInitial(true);
		// this.initialState = this.stateList[2];

		// this.stateList[this.stateList.length - 1].setFinal(true);
		// for (let i = 0; i < this.stateList.length; i++) {
		// 	this.stateList[i].setName("q" + i);
		// }
		// this.edgeList[0].addText("b");
		// this.edgeList[0].addText("e");
		// this.edgeList[1].addText("a");
		// this.edgeList[2].addText("c");
		// this.edgeList[3].addText("d");

		// let e1 = new Edge();
		// e1.setOrigin(this.stateList[1]);
		// e1.setTarget(this.stateList[4]);
		// e1.addText("b");
		// this.edgeList.push(e1);

		// let e2 = new Edge();
		// e2.setOrigin(this.stateList[3]);
		// e2.setTarget(this.stateList[4]);
		// e2.addText("c");
		// this.edgeList.push(e2);

		// let e3 = new Edge();
		// e3.setOrigin(this.stateList[1]);
		// e3.setTarget(this.stateList[2]);
		// e3.addText("a");
		// this.edgeList.push(e3);

		// let e4 = new Edge();
		// e4.setOrigin(this.stateList[3]);
		// e4.setTarget(this.stateList[2]);
		// e4.addText("a");
		// this.edgeList.push(e4);

		// this.updateEdges();

		// this.selectState(state);

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

		this.highlightedState = null;
		this.initialState = null;
		this.edgeMode = false;
		this.currentEdge = null;
	}

	public empty(): boolean {
		// Doesn't need to check for edgeList.length since edges
		// can't exist without states.
		return this.stateList.length == 0;
	}

	public save(): string {
		let result = {
			states: [],
			edges: []
		};

		for (let state of this.stateList) {
			let position = state.getPosition();
			result.states.push({
				name: state.getName(),
				initial: state.isInitial(),
				final: state.isFinal(),
				x: position.x,
				y: position.y
			});
		}

		for (let edge of this.edgeList) {
			result.edges.push({
				origin: edge.getOrigin().getName(),
				target: edge.getTarget().getName(),
				textList: edge.getTextList()
			});
		}

		return JSON.stringify(result);
	}

	public load(content: string): void {
		let obj = JSON.parse(content);

		let nameToIndex: {[n: string]: number} = {};

		for (let data of obj.states) {
			let state = new State();
			state.setName(data.name);
			state.setInitial(data.initial);
			state.setFinal(data.final);
			state.setPosition(data.x, data.y);
			state.render(this.canvas);
			this.bindStateEvents(state);

			if (data.initial) {
				this.initialState = state;
			}

			nameToIndex[data.name] = this.stateList.length;
			this.stateList.push(state);
		}

		let states = this.stateList;
		for (let data of obj.edges) {
			let edge = new Edge();
			edge.setOrigin(states[nameToIndex[data.origin]]);
			edge.setTarget(states[nameToIndex[data.target]]);
			for (let text of data.textList) {
				edge.addText(text);
			}
			edge.render(this.canvas);

			this.edgeList.push(edge);
		}
	}

	private selectState(state: State) {
		if (this.highlightedState) {
			this.highlightedState.dim();
			this.highlightedState.render(this.canvas);
		}
		state.highlight();
		this.highlightedState = state;
		state.render(this.canvas);
	}

	private bindEvents(): void {
		for (let state of this.stateList) {
			state.render(this.canvas);
			this.bindStateEvents(state);
		}

		let self = this;
		$(this.node).dblclick(function(e) {
			let state = new State();
			state.setPosition(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
			self.selectState(state);
			self.bindStateEvents(state);

			utils.prompt("Enter the state name:", 1, function(data) {
				self.stateList.push(state);
				state.setName(data[0]);
				state.render(self.canvas);
			}, function() {
				self.highlightedState = null;
				state.remove();
			});
			// Allows the state to be rendered before showing the prompt
			// utils.async(function(){
			// 	let text = prompt("Enter the state name:");
			// 	state.setName(text);
			// 	state.render(self.canvas);
			// });
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

	private bindStateEvents(state: State) {
		let canvas = this.canvas;
		let self = this;
		// TODO: separate left click/right click dragging handlers if possible
		state.drag(function() {
			self.updateEdges();
		}, function(distanceSquared, event) {
			if (distanceSquared <= Settings.stateDragTolerance) {
				if (self.edgeMode) {
					self.finishEdge(state);
				} else if (utils.isRightClick(event)) {
					self.beginEdge(state);
				} else if (state == self.highlightedState) {
					state.dim();
					self.highlightedState = null;
					state.render(canvas);
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

		// TODO: change "Enter the edge content" to the actual real text/message
		let edgeText = function(callback: (t: string) => void,
								fallback: () => void) {
			utils.prompt("Enter the edge content:", 1, function(data) {
				callback(data[0]);
			}, fallback);
		};

		let self = this;

		let clearCurrentEdge = function() {
			self.currentEdge.remove();
			self.currentEdge = null;
		};

		let origin = this.currentEdge.getOrigin();
		// Checks if there's already an edge linking the origin and target states
		for (let edge of this.edgeList) {
			if (edge.getOrigin() == origin && edge.getTarget() == state) {
				edgeText(function(text) {
					// Add the text to it instead and delete 'this.currentEdge'.
					edge.addText(text);
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

		edgeText(function(text) {
			self.currentEdge.addText(text);
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
		if (this.edgeMode) {
			this.edgeMode = false;
			this.currentEdge.remove();
			this.currentEdge = null;
		}
	}

	private bindShortcuts(): void {
		let canvas = this.canvas;
		let self = this;
		utils.bindShortcut(Settings.shortcuts.toggleInitial, function() {
			console.log("toggle");
			let highlightedState = self.highlightedState;
			if (highlightedState) {
				if (highlightedState == self.initialState) {
					highlightedState.setInitial(false);
					self.initialState = null;
				} else {
					if (self.initialState) {
						self.initialState.setInitial(false);
						self.initialState.render(canvas);
					}

					highlightedState.setInitial(true);
					self.initialState = highlightedState;
				}

				highlightedState.render(canvas);
			}
		});

		utils.bindShortcut(Settings.shortcuts.toggleFinal, function() {
			let highlightedState = self.highlightedState;
			if (highlightedState) {
				highlightedState.setFinal(!highlightedState.isFinal());
				highlightedState.render(canvas);
			}
		});

		utils.bindShortcut(Settings.shortcuts.dimState, function() {
			let highlightedState = self.highlightedState;
			if (highlightedState) {
				highlightedState.dim();
				highlightedState.render(canvas);
				self.highlightedState = null;
			}
		});

		utils.bindShortcut(Settings.shortcuts.deleteState, function() {
			let highlightedState = self.highlightedState;
			if (highlightedState) {
				for (let i = 0; i < self.edgeList.length; i++) {
					let edge = self.edgeList[i];
					let origin = edge.getOrigin();
					let target = edge.getTarget();
					if (origin == highlightedState || target == highlightedState) {
						edge.remove();
						self.edgeList.splice(i, 1);
						i--;
					}
				}
				highlightedState.remove();

				let states = self.stateList;
				for (let i = 0; i < states.length; i++) {
					if (states[i] == highlightedState) {
						states.splice(i, 1);
						break;
					}
				}

				self.clearSelection();
			}
		});

		utils.bindShortcut(Settings.shortcuts.clearMachine, function() {
			let confirmation = confirm(Strings.CLEAR_CONFIRMATION);
			if (confirmation) {
				self.clear();
			}
		});

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
		});

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
		});

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
		});

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
		});

		utils.bindShortcut(Settings.shortcuts.undo, function() {
			// TODO
			alert("TODO: undo");
		});
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
	private initialState: State = null;
	private edgeMode: boolean = false;
	private currentEdge: Edge = null;
}
