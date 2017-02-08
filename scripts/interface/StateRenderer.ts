import {Settings} from "../Settings"
import {State} from "./State"
import {utils} from "../Utils"

function rotatePoint(point, center, angle) {
	let sin = Math.sin(angle);
	let cos = Math.cos(angle);
	let copy = {
		x: point.x,
		y: point.y
	}
	copy.x -= center.x;
	copy.y -= center.y;
	let result = {
		x: copy.x * cos - copy.y * sin,
		y: copy.x * sin + copy.y * cos
	};

	return {
		x: result.x + center.x,
		y: result.y + center.y
	};
}

interface Edge {
	origin: State;
	target: State;
	body: RaphaelElement;
}

// TODO: remake pretty much all the rendering part (except the canvas itself).
export class StateRenderer {
	constructor(canvas:  RaphaelPaper, node: Element) {
		this.canvas = canvas;
		this.node = node;
	}

	public render(): void {
		this.stateList = [
			new State(),
			new State(),
			new State(),
			new State()
		];

		let states = this.stateList;
		states[0].setPosition(120, 120);
		states[0].setFinal(true);

		states[1].setPosition(300, 80);

		states[2].setPosition(340, 320);

		states[3].setPosition(130, 290);

		// TODO: separate left click/right click dragging handlers
		let canvas = this.canvas;
		let self = this;
		for (let state of this.stateList) {
			state.render(canvas);
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
						if (self.highlightedState) {
							self.highlightedState.dim();
							self.highlightedState.render(canvas);
						}
						state.highlight();
						self.highlightedState = state;
						state.render(canvas);
					}
					return false;
				}
				return true;
			});
		}

		this.bindShortcuts();

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

	private beginEdge(state: State): void {
		console.log("[ENTER EDGE MODE]");
		this.edgeMode = true;

		let origin = state.getPosition();
		this.currentEdge = {
			origin: state,
			target: null,
			body: utils.line(this.canvas,
				origin.x, origin.y,
				origin.x, origin.y)
		};
	}

	private finishEdge(state: State): void {
		console.log("[BUILD EDGE]");
		this.edgeMode = false;

		// Arrow body (i.e a straight line)
		let edge = this.currentEdge;
		let origin = edge.origin.getPosition();
		let target = state.getPosition();
		edge.target = state;
		// edge.body.attr("path", utils.linePath(
		// 	origin.x, origin.y,
		// 	target.x, target.y
		// ));

		// Adjusts the edge so that it points to the border of the state
		// rather than its center
		let dx = target.x - origin.x;
		let dy = target.y - origin.y;
		let angle = Math.atan2(dy, dx);
		let sin = Math.sin(angle);
		let cos = Math.cos(angle);
		let offsetX = Settings.stateRadius * cos;
		let offsetY = Settings.stateRadius * sin;
		// TODO: make the edge start at the edge of the state rather than
		// its center.
		// origin.x += offsetX;
		// origin.y += offsetY;
		target.x -= offsetX;
		target.y -= offsetY;
		dx -= offsetX;
		dy -= offsetY;
		edge.body.attr("path", utils.linePath(
			origin.x, origin.y,
			target.x, target.y
		));

		// Arrow head
		let arrowLength = Settings.edgeArrowLength;
		let alpha = utils.toRadians(Settings.edgeArrowAngle);
		let length = Math.sqrt(dx * dx + dy * dy);
		let u = 1 - arrowLength / length;
		let ref = {
			x: origin.x + u * dx,
			y: origin.y + u * dy
		};

		let p1 = rotatePoint(ref, target, alpha);
		utils.line(this.canvas,
			p1.x, p1.y,
			target.x, target.y);

		let p2 = rotatePoint(ref, target, -alpha);
		utils.line(this.canvas,
			p2.x, p2.y,
			target.x, target.y);
	}

	private adjustEdge(elem: HTMLElement, e): void {
		let edge = this.currentEdge;
		let origin = edge.origin.getPosition();
		let target = {
			x: e.pageX - elem.offsetLeft,
			y: e.pageY - elem.offsetTop
		};
		let dx = target.x - origin.x;
		let dy = target.y - origin.y;
		// The offsets are necessary to ensure that mouse events are
		// still correctly fired, since not using them makes the edge
		// stay directly below the cursor.
		let x = origin.x + dx * 0.98;
		let y = origin.y + dy * 0.98;
		edge.body.attr("path", utils.linePath(origin.x, origin.y, x, y));
	}

	private updateEdges(): void {

	}

	private bindShortcuts(): void {
		let canvas = this.canvas;
		let highlightedState = this.highlightedState;
		utils.bindShortcut(Settings.shortcuts.toggleInitial, function() {
			if (highlightedState) {
				highlightedState.setInitial(!highlightedState.isInitial());
				highlightedState.render(canvas);
			}
		});

		utils.bindShortcut(Settings.shortcuts.toggleFinal, function() {
			if (highlightedState) {
				highlightedState.setFinal(!highlightedState.isFinal());
				highlightedState.render(canvas);
			}
		});

		let self = this;
		utils.bindShortcut(Settings.shortcuts.dimState, function() {
			if (highlightedState) {
				highlightedState.dim();
				highlightedState.render(canvas);
				self.highlightedState = null;
			}
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
