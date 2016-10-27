/// <reference path="../defs/raphael.d.ts" />
/// <reference path="../defs/jQuery.d.ts" />

import {Renderer} from "./Renderer"
import {State} from "./State"
import {Settings} from "../Settings"
import {utils} from "../Utils"

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

	protected onRender(): void {
		// 50x50 is a placeholder size: resizeCanvas() calculates the true size.
		this.canvas = Raphael(<HTMLElement> this.node, 50, 50);
		this.resizeCanvas();

		let states = [
			new State(),
			new State(),
			new State()
		];

		states[0].setPosition(120, 120);
		states[0].setFinal(true);

		states[1].setPosition(300, 80);

		states[2].setPosition(340, 320);

		// TODO: separate left click/right click dragging handlers
		let canvas = this.canvas;
		let edgeMode = false;
		let edge = {
			origin: null,
			target: null,
			body: null
		};
		for (let state of states) {
			state.render(canvas);
			state.drag(function(distanceSquared, event) {
				if (distanceSquared <= Settings.stateDragTolerance) {
					if (utils.isRightClick(event)) {
						if (edgeMode) {
							// TODO
							console.log("[BUILD EDGE]");
							edgeMode = false;

							let origin = edge.origin.getPosition();
							let target = state.getPosition();
							edge.target = state;
							edge.body.attr("path", utils.linePath(
								origin.x, origin.y,
								target.x, target.y
							));
						} else {
							console.log("[ENTER EDGE MODE]");
							edgeMode = true;

							let origin = state.getPosition();
							edge.origin = state;
							edge.body = utils.line(canvas,
								origin.x, origin.y,
								origin.x, origin.y);
						}
					} else {
						state.setFinal(!state.isFinal());
						state.render(canvas);
					}
					return false;
				}
				return true;
			});

			state.node().mousedown(function(e) {
				if (utils.isRightClick(e)) {
					console.log("Initial state changed.");
					state.setInitial(!state.isInitial());
					e.preventDefault();
					return false;
				}
			});
		}

		$(this.node).contextmenu(function(e) {
			e.preventDefault();
			return false;
		});

		$(this.node).mousemove(function(e) {
			if (edgeMode) {
				let origin = edge.origin.getPosition();
				let target = {
					x: e.pageX - this.offsetLeft,
					y: e.pageY - this.offsetTop
				}
				let dx = target.x - origin.x;
				let dy = target.y - origin.y;
				// The offsets are necessary to ensure that mouse events are
				// still correctly fired, since not using them makes the edge
				// stay directly below the cursor.
				let x = origin.x + dx * 0.98;
				let y = origin.y + dy * 0.98;
				edge.body.attr("path", utils.linePath(origin.x, origin.y, x, y));
			}
		});
	}

	private canvas: RaphaelPaper = null;
}
