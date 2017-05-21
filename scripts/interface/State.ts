/// <reference path="../defs/raphael.d.ts" />

import {Browser} from "../Browser"
import {Renderer} from "./Renderer"
import {Settings} from "../Settings"
import {StatePalette} from "../StatePalette"
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

	public setName(name: string): void {
		this.name = name;
	}

	public getName(): string {
		return this.name;
	}

	public applyPalette(palette: StatePalette): void {
		this.palette = palette;
	}

	public removePalette(): void {
		this.palette = this.defaultPalette;
	}

	public remove(): void {
		if (this.body) {
			this.body.remove();
			this.body = null;
		}

		if (this.ring) {
			this.ring.remove();
			this.ring = null;
		}

		for (let part of this.arrowParts) {
			part.remove();
		}
		this.arrowParts = [];

		if (this.textContainer) {
			this.textContainer.remove();
			this.textContainer = null;
		}
	}

	public render(canvas: RaphaelPaper): void {
		this.renderBody(canvas);
		this.renderInitialMark(canvas);
		this.renderFinalMark(canvas);
		this.renderText(canvas);
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

		let self = this;

		// TODO: find a new home for all these functions
		let begin = function(x, y, event) {
			let position = self.getPosition();
			this.ox = position.x;
			this.oy = position.y;
			return null;
		};

		// This is used to optimize the dragging process. The
		// "callbackFrequency" variable controls the frequency in
		// which dragging pixels actually trigger the move callback.
		let moveController = 0;
		let callbackFrequency: number;
		// TODO: check the performance in other browsers
		if (Browser.name == "chrome") {
			// Chrome is really good at rendering SVG
			callbackFrequency = 3;
		} else {
			callbackFrequency = 4;
		}
		let move = function(dx, dy, x, y, event) {
			self.setVisualPosition(this.ox + dx, this.oy + dy);
			if (moveController == 0) {
				moveCallback.call(this, event);
			}

			moveController = (moveController + 1) % callbackFrequency;
			return null;
		};

		let end = function(event) {
			let position = self.getPosition();
			let dx = position.x - this.ox;
			let dy = position.y - this.oy;
			let distanceSquared = dx * dx + dy * dy;
			let accepted = endCallback.call(this, distanceSquared, event);
			// TODO: check if we really shouldn't call
			// moveCallback when dx = dy = 0
			if (!accepted && (dx != 0 || dy != 0)) {
				self.setVisualPosition(this.ox, this.oy);
			}

			// Calls the moveCallback here to prevent the visual
			// detachment of edges in low callback frequency rates
			// after the dragging has stopped.
			moveCallback.call(this, event);
			return null;
		};

		this.body.drag(move, begin, end);
		if (this.textContainer) {
			this.textContainer.drag(move, begin, end);
		}
	}

	private fillColor(): string {
		return this.palette.fillColor;
	}

	private strokeColor(): string {
		return this.palette.strokeColor;
	}

	private strokeWidth(): number {
		return this.palette.strokeWidth;
	}

	private ringStrokeWidth(): number {
		return this.palette.ringStrokeWidth;
	}

	private renderBody(canvas: RaphaelPaper): void {
		if (!this.body) {
			this.body = canvas.circle(this.x, this.y, this.radius);
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

	private updateInitialMarkOffsets(): void {
		if (this.initialMarkOffsets.length) {
			return;
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
				let strokeColor = Settings.stateInitialMarkColor;
				let strokeWidth = Settings.stateInitialMarkThickness;

				let body = utils.line(canvas, x - length, y, x, y);
				body.attr("stroke", strokeColor);
				body.attr("stroke-width", strokeWidth);

				this.updateInitialMarkOffsets();

				let topOffsets = this.initialMarkOffsets[0];
				let botOffsets = this.initialMarkOffsets[1];

				let topLine = utils.line(canvas, topOffsets.x + x, topOffsets.y + y,
												 x, y);
				topLine.attr("stroke", strokeColor);
				topLine.attr("stroke-width", strokeWidth);

				let bottomLine = utils.line(canvas, botOffsets.x + x, botOffsets.y + y,
													x, y);
				bottomLine.attr("stroke", strokeColor);
				bottomLine.attr("stroke-width", strokeWidth);

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

	private renderText(canvas?: RaphaelPaper): void {
		if (!this.textContainer) {
			this.textContainer = canvas.text(this.x, this.y, this.name);
			this.textContainer.attr("font-family", Settings.stateLabelFontFamily);
			this.textContainer.attr("font-size", Settings.stateLabelFontSize);
			this.textContainer.attr("stroke", Settings.stateLabelFontColor);
			this.textContainer.attr("fill", Settings.stateLabelFontColor);
		} else {
			this.textContainer.attr("x", this.x);
			this.textContainer.attr("y", this.y);
			this.textContainer.attr("text", this.name);
		}
	}

	// TODO: find a better name for this method
	private setVisualPosition(x: number, y: number): void {
		this.setPosition(x, y);

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

		this.renderText();
	}

	private x: number;
	private y: number;
	private radius: number;
	private initial: boolean = false;
	private final: boolean = false;
	private name: string = "";
	private initialMarkOffsets: {x: number, y: number}[] = [];

	private defaultPalette: StatePalette = {
		fillColor: Settings.stateFillColor,
		strokeColor: Settings.stateStrokeColor,
		strokeWidth: Settings.stateStrokeWidth,
		ringStrokeWidth: Settings.stateRingStrokeWidth
	};
	private palette: StatePalette = this.defaultPalette;

	private body: RaphaelElement = null;
	private ring: RaphaelElement = null;
	private arrowParts: RaphaelElement[] = [];
	private textContainer: RaphaelElement = null;
}
