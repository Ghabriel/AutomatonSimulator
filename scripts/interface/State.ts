/// <reference path="../defs/raphael.d.ts" />

import {Renderer} from "./Renderer"
import {Settings} from "../Settings"
import {utils} from "../Utils"

export class State {
	constructor() {
		this.radius = Settings.stateRadius;
	}

	public setPosition(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	public getPosition(): {x: number, y: number} {
		return {
			x: this.x,
			y: this.y
		};
	}

	public setName(name: string): void {
		this.name = name;
	}

	public setInitial(flag: boolean): void {
		this.initial = flag;
	}

	public isInitial(): boolean {
		return this.initial;
	}

	public setFinal(flag: boolean): void {
		this.final = flag;
	}

	public isFinal(): boolean {
		return this.final;
	}

	public highlight(): void {
		this.highlighted = true;
	}

	public dim(): void {
		this.highlighted = false;
	}

	private fillColor(): string {
		return this.highlighted ? Settings.stateHighlightFillColor
								: Settings.stateFillColor;
	}

	private strokeColor(): string {
		return this.highlighted ? Settings.stateHighlightStrokeColor
								: Settings.stateStrokeColor;
	}

	private strokeWidth(): number {
		return this.highlighted ? Settings.stateHighlightStrokeWidth
								: Settings.stateStrokeWidth;
	}

	private ringStrokeWidth(): number {
		return this.highlighted ? Settings.stateHighlightRingStrokeWidth
								: Settings.stateRingStrokeWidth;
	}

	private renderBody(canvas: RaphaelPaper): void {
		if (!this.body) {
			this.body = canvas.circle(this.x, this.y, this.radius);
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

		this.body.attr("fill", this.fillColor());
		this.body.attr("stroke", this.strokeColor());
		this.body.attr("stroke-width", this.strokeWidth());
	}

	private updateInitialMarkOffsets() {
		if (this.initialMarkOffsets.length) {
			return this.initialMarkOffsets;
		}

		let length = Settings.stateInitialMarkLength;
		let x = this.x - this.radius;
		let y = this.y;

		// TODO: don't copy and paste
		// Arrow head
		let arrowLength = Settings.stateInitialMarkHeadLength;
		let alpha = Settings.stateInitialMarkAngle;
		let u = 1 - arrowLength / length;
		let ref = {
			x: x - length + u * length,
			y: y
		};

		// The reference points of the arrow head
		let target = {x: x, y: y};
		let p1 = utils.rotatePoint(ref, target, alpha);
		let p2 = utils.rotatePoint(ref, target, -alpha);
		this.initialMarkOffsets = [
			{
				x: p1.x - x,
				y: p1.y - y
			},
			{
				x: p2.x - x,
				y: p2.y - y
			}
		];
	}

	private renderInitialMark(canvas?: RaphaelPaper): void {
		if (this.initial) {
			let length = Settings.stateInitialMarkLength;
			let x = this.x - this.radius;
			let y = this.y;
			// TODO: reduce the copy/pasting of the following branches
			if (this.arrowParts.length) {
				let parts = this.arrowParts;
				let body = parts[0];
				let topLine = parts[1];
				let bottomLine = parts[2];

				body.attr("path", utils.linePath(x - length, y, x, y));

				this.updateInitialMarkOffsets();

				let topOffsets = this.initialMarkOffsets[0];
				let botOffsets = this.initialMarkOffsets[1];

				topLine.attr("path", utils.linePath(topOffsets.x + x, topOffsets.y + y,
												    x, y));
				bottomLine.attr("path", utils.linePath(botOffsets.x + x, botOffsets.y + y,
													   x, y));
			} else {
				let body = utils.line(canvas, x - length, y, x, y);

				this.updateInitialMarkOffsets();

				let topOffsets = this.initialMarkOffsets[0];
				let botOffsets = this.initialMarkOffsets[1];

				let topLine = utils.line(canvas, topOffsets.x + x, topOffsets.y + y,
												 x, y);
				let bottomLine = utils.line(canvas, botOffsets.x + x, botOffsets.y + y,
													x, y);
				let parts = this.arrowParts;
				parts.push(body);
				parts.push(topLine);
				parts.push(bottomLine);
			}
		} else {
			let parts = this.arrowParts;
			while (parts.length) {
				parts[parts.length - 1].remove();
				parts.pop();
			}
			// this.arrow.remove();
			// this.arrow = null;
		}
	}

	private renderFinalMark(canvas: RaphaelPaper): void {
		if (this.final) {
			if (!this.ring) {
				this.ring = canvas.circle(this.x, this.y, Settings.stateRingRadius);
			} else {
				this.ring.attr({
					cx: this.x,
					cy: this.y
				});
			}

			this.ring.attr("stroke", this.strokeColor());
			this.ring.attr("stroke-width", this.ringStrokeWidth());
		} else if (this.ring) {
			this.ring.remove();
			this.ring = null;
		}
	}

	// TODO: find a better name for this method
	private setVisualPosition(x: number, y: number): void {
		this.body.attr({
			cx: x,
			cy: y
		});

		if (this.ring) {
			this.ring.attr({
				cx: x,
				cy: y
			});
		}

		if (this.initial) {
			// TODO: update initial mark
			this.renderInitialMark();
		}

		this.setPosition(x, y);
	}

	public render(canvas: RaphaelPaper): void {
		this.renderBody(canvas);
		this.renderInitialMark(canvas);
		this.renderFinalMark(canvas);
	}

	public node(): RaphaelElement {
		return this.body;
	}

	public html(): SVGElement {
		if (this.body) {
			return this.body.node;
		}
		return null;
	}

	public drag(moveCallback: (event?: any) => void,
				endCallback: (distSquared: number, event: any) => boolean): void {
		// TODO: find a new home for all these functions
		let begin = function(x, y, event) {
			this.ox = this.attr("cx");
			this.oy = this.attr("cy");
			return null;
		};

		let self = this;
		let move = function(dx, dy, x, y, event) {
			self.setVisualPosition(this.ox + dx, this.oy + dy);
			moveCallback.call(this, event);
			return null;
		};

		let end = function(event) {
			let dx = this.attr("cx") - this.ox;
			let dy = this.attr("cy") - this.oy;
			let distanceSquared = dx * dx + dy * dy;
			let accepted = endCallback.call(this, distanceSquared, event);
			if (!accepted) {
				self.setVisualPosition(this.ox, this.oy);
				moveCallback.call(this, event);
			}
			return null;
		};

		this.body.drag(move, begin, end);
	}

	private body: RaphaelElement = null;
	private ring: RaphaelElement = null;
	private arrowParts: RaphaelElement[] = [];
	private x: number;
	private y: number;
	private radius: number;
	private name: string = "";
	private initial: boolean = false;
	private final: boolean = false;
	private highlighted: boolean = false;

	// TODO: don't use any
	private initialMarkOffsets: {x: number, y: number}[] = [];
}
