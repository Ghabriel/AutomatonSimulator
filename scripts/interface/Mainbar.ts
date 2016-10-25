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
		for (let state of states) {
			state.render(canvas);
			state.drag(function(distanceSquared, event) {
				if (utils.isRightClick(event)) {
					return false;
				}

				if (distanceSquared <= Settings.stateDragTolerance) {
					state.setFinal(!state.isFinal());
					state.render(canvas);
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
	}

	private canvas: RaphaelPaper = null;
}
