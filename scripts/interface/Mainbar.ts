/// <reference path="../defs/raphael.d.ts" />
/// <reference path="../defs/jQuery.d.ts" />

import {AutomatonRenderer} from "./AutomatonRenderer"
import {Renderer} from "./Renderer"
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

	protected onBind(): void {
		// 0x0 is a placeholder size: resizeCanvas() calculates the true size.
		this.canvas = Raphael(<HTMLElement> this.node, 0, 0);
		this.resizeCanvas();
		this.automatonRenderer = new AutomatonRenderer(this.canvas, this.node);
		Settings.automatonRenderer = this.automatonRenderer;
	}

	protected onRender(): void {
		this.automatonRenderer.render();
	}

	private canvas: RaphaelPaper = null;
	private automatonRenderer: AutomatonRenderer = null;
}
