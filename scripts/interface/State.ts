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

	public drag(callback: (distSquared: number) => boolean): void {
		// TODO: find a new home for all these functions
		let self = this;
		let setPosition = function(x, y) {
			self.body.attr({
				cx: x,
				cy: y
			});

			if (self.ring) {
				self.ring.attr({
					cx: x,
					cy: y
				});
			}

			self.setPosition(x, y);
		};

		let maxTravelDistance;
		let begin = function(x, y, event) {
			this.ox = this.attr("cx");
			this.oy = this.attr("cy");
			maxTravelDistance = 0;
			return null;
		};

		let move = function(dx, dy, x, y, event) {
			let trueDx = this.attr("cx") - this.ox;
			let trueDy = this.attr("cy") - this.oy;
			let distanceSquared = trueDx * trueDx + trueDy * trueDy;
			if (distanceSquared > maxTravelDistance) {
				maxTravelDistance = distanceSquared;
			}
			setPosition(this.ox + dx, this.oy + dy);
			return null;
		};

		let end = function(event) {
			let dx = this.attr("cx") - this.ox;
			let dy = this.attr("cy") - this.oy;
			setPosition(this.ox, this.oy);

			let accepted = callback.call(this, maxTravelDistance);
			if (accepted) {
				setPosition(this.ox + dx, this.oy + dy);
			}
			return null;
		};

		this.body.drag(move, begin, end);
	}

	private body: RaphaelElement = null;
	private ring: RaphaelElement = null;
	private x: number;
	private y: number;
	private name: string = "";
	private initial: boolean = false;
	private final: boolean = false;
}
