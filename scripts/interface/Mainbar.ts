/// <reference path="../defs/raphael.d.ts" />
/// <reference path="../defs/jQuery.d.ts" />

import {Renderer} from "./Renderer"
import {State} from "./State"
import {Settings} from "../Settings"

export class Mainbar extends Renderer {
	protected onRender(): void {
		// var node = $(this.node);
		// var width = node.outerWidth();
		// var height = node.outerHeight();
		var width = 800;
		var height = 600;
		let canvas = Raphael(<HTMLElement> this.node, width, height);
		let states = [
			new State(),
			new State(),
			new State()
		];

		states[0].setPosition(120, 120);
		states[0].setFinal(true);

		states[1].setPosition(300, 80);

		states[2].setPosition(340, 320);

		for (let state of states) {
			state.render(canvas);
			// state.html().addEventListener("click", function() {
			// 	state.setFinal(!state.isFinal());
			// 	state.render(canvas);
			// });

			// state.elem().drag(move, begin, end);
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
}
