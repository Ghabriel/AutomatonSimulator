/// <reference path="../defs/raphael.d.ts" />

import {Renderer} from "./Renderer"
import {Settings} from "../Settings"

export class State {
	public setPosition(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	public setName(name: string): void {
		this.name = name;
	}

	public setInitial(flag: boolean): void {
		this.initial = flag;
	}

	public setFinal(flag: boolean): void {
		this.final = flag;
	}

	public isFinal(): boolean {
		return this.final;
	}

	public render(canvas: RaphaelPaper): void {
		if (!this.body) {
			this.body = canvas.circle(this.x, this.y, Settings.stateRadius);
			this.body.attr("fill", Settings.stateFillColor);
			this.body.attr("stroke", Settings.stateStrokeColor);

			canvas.text(this.x, this.y, this.name).attr({
				"font-family": Settings.stateLabelFontFamily,
				"font-size": Settings.stateLabelFontSize
			});
		} else {
			this.body.attr({
				cx: this.x,
				cy: this.y
			});
		}

		if (this.final) {
			if (!this.ring) {
				this.ring = canvas.circle(this.x, this.y, Settings.stateRingRadius);
				this.ring.attr("stroke", Settings.stateStrokeColor);
			} else {
				this.ring.attr({
					cx: this.x,
					cy: this.y
				});
			}
		} else if (this.ring) {
			this.ring.remove();
			this.ring = null;
		}
	}

	public html(): SVGElement {
		if (this.body) {
			return this.body.node;
		}
		return null;
	}

	private body: RaphaelElement = null;
	private ring: RaphaelElement = null;
	private x: number;
	private y: number;
	private name: string = "";
	private initial: boolean = false;
	private final: boolean = false;
}
