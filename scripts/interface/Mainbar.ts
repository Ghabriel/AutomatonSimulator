/// <reference path="../defs/raphael.d.ts" />
/// <reference path="../defs/jQuery.d.ts" />

import {Renderer} from "./Renderer"
import {State} from "./State"
import {Settings} from "../Settings"

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

		let canvas = this.canvas;
		for (let state of states) {
			state.render(canvas);
			state.drag(function(distanceSquared) {
				if (distanceSquared <= Settings.stateDragTolerance) {
					state.setFinal(!state.isFinal());
					state.render(canvas);
					return false;
				}
				return true;
			});
		}
	}

	private canvas: RaphaelPaper = null;
}
