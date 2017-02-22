import {Edge} from "./Edge"
import {Settings, Strings} from "../Settings"
import {State} from "./State"
import {utils} from "../Utils"

export class StateRenderer {
	constructor(canvas:  RaphaelPaper, node: Element) {
		this.canvas = canvas;
		this.node = node;
	}

	public render(): void {
		let state = new State();
		state.setPosition(100, 100);
		state.setInitial(true);
		this.stateList.push(state);

		// TODO: separate left click/right click dragging handlers
		for (let state of this.stateList) {
			state.render(this.canvas);
			this.bindStateEvents(state);
		}

		this.bindShortcuts();

		let self = this;
		$(this.node).dblclick(function(e) {
			let state = new State();
			state.setPosition(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
			self.stateList.push(state);
			self.selectState(state);
			self.bindStateEvents(state);
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

	private selectState(state: State) {
		if (this.highlightedState) {
			this.highlightedState.dim();
			this.highlightedState.render(this.canvas);
		}
		state.highlight();
		this.highlightedState = state;
		state.render(this.canvas);
	}

	private bindStateEvents(state: State) {
		// TODO: separate left click/right click dragging handlers
		let canvas = this.canvas;
		let self = this;
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
		this.currentEdge.setTarget(state);
		this.currentEdge.render(this.canvas);
		this.edgeList.push(this.currentEdge);
		this.currentEdge = null;
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
			let highlightedState = self.highlightedState;
			if (highlightedState) {
				highlightedState.setInitial(!highlightedState.isInitial());
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
				self.clearSelection();

				for (let edge of self.edgeList) {
					edge.remove();
				}
				self.edgeList = [];

				for (let state of self.stateList) {
					state.remove();
				}
				self.stateList = [];
			}
		});

		utils.bindShortcut(Settings.shortcuts.undo, function() {
			// TODO
			alert("TODO: undo");
		});
	}

	private canvas: RaphaelPaper = null;
	private node: Element = null;
	private stateList: State[] = [];
	// TODO: find a better data structure than a simple array
	private edgeList: Edge[] = [];
	private highlightedState: State = null;
	private edgeMode: boolean = false;
	private currentEdge: Edge = null;
}
