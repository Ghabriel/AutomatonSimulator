/// <reference path="../defs/raphael.d.ts" />

import {Renderer} from "./Renderer"
import {State} from "./State"

export class Mainbar extends Renderer {
	protected onRender(): void {
		var node = this.node;
		var canvas = Raphael(<HTMLElement> node, 500, 500);
		var states = [
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
			state.html().addEventListener("click", function() {
				state.setFinal(!state.isFinal());
				state.render(canvas);
			});
		}
	}
}
