/// <reference path="../defs/raphael.d.ts" />
/// <reference path="../defs/jQuery.d.ts" />

import {AutomatonRenderer} from "./AutomatonRenderer"
import {GUI} from "./GUI"
import {JSONHandler} from "../persistence/JSONHandler"
import {Memento} from "../Memento"
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

		let canvas = this.canvas;
		let node = this.node;
		let memento = new Memento<string>(function() {
			return Settings.undoMaxAmount;
		});

		let persistenceHandler = new JSONHandler();

		this.automatonRenderer = new AutomatonRenderer(canvas, node,
									memento, persistenceHandler);
	}

	protected onRender(): void {
		this.automatonRenderer.render();
	}

	private canvas: GUI.Canvas = null;
	private automatonRenderer: AutomatonRenderer = null;
}
