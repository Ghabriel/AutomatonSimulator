/// <reference path="../defs/raphael.d.ts" />
/// <reference path="../defs/jQuery.d.ts" />

import {Renderer} from "./Renderer"
import {State} from "./State"
import {Settings} from "../Settings"
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

// TODO: remake pretty much all the rendering part (except the canvas itself).
export class Mainbar extends Renderer {
	constructor() {
		super();
		let self = this;
		$(window).resize(function() {
			self.resizeCanvas();
		});
	}

	private resizeCanvas(): void {
		let canvas = this.canvas;
		if (canvas) {
			let node = $(this.node);
			// allows the parent node to adjust
			canvas.setSize(50, 50);
			let width = node.width();
			let height = node.height() - 10;
			canvas.setSize(width, height);
		}
	}

	private beginEdge(state: State): void {
		console.log("[ENTER EDGE MODE]");
		this.edgeMode = true;

		let origin = state.getPosition();
		let edge = this.currentEdge;
		edge.origin = state;
		edge.body = utils.line(this.canvas,
			origin.x, origin.y,
			origin.x, origin.y);
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

	protected onBind(): void {
		// 0x0 is a placeholder size: resizeCanvas() calculates the true size.
		this.canvas = Raphael(<HTMLElement> this.node, 0, 0);
		this.resizeCanvas();
	}

	protected onRender(): void {
		// let states = [];
		let highlightedState: State = null;

		let states = [
			new State(),
			new State(),
			new State(),
			new State()
		];

		states[0].setPosition(120, 120);
		states[0].setFinal(true);

		states[1].setPosition(300, 80);

		states[2].setPosition(340, 320);

		states[3].setPosition(130, 290);

		// TODO: separate left click/right click dragging handlers
		let canvas = this.canvas;
		let self = this;
		for (let state of states) {
			state.render(canvas);
			state.drag(function(distanceSquared, event) {
				if (distanceSquared <= Settings.stateDragTolerance) {
					if (self.edgeMode) {
						self.finishEdge(state);
					} else if (utils.isRightClick(event)) {
						self.beginEdge(state);
					} else if (state == highlightedState) {
						state.dim();
						highlightedState = null;
						state.render(canvas);
					} else {
						if (highlightedState) {
							highlightedState.dim();
							highlightedState.render(canvas);
						}
						state.highlight();
						highlightedState = state;
						state.render(canvas);
					}
					return false;
				}
				return true;
			});

			// state.node().dblclick(function(e) {
			// 	// if (utils.isRightClick(e)) {
			// 		console.log("Initial state changed.");
			// 		state.setInitial(!state.isInitial());
			// 		state.render(canvas);
			// 		e.preventDefault();
			// 		return false;
			// 	// }
			// });
		}

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

	private canvas: RaphaelPaper = null;
	private edgeMode: boolean = false;
	private currentEdge = {
		origin: null,
		target: null,
		body: null
	};
}
