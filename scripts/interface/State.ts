/// <reference path="../defs/raphael.d.ts" />
/// <reference path="../types.ts" />

import {Browser} from "../Browser"
import {GUI} from "./GUI"
import {Renderer} from "./Renderer"
import {Settings} from "../Settings"
import {StatePalette} from "../Palette"
import {utils} from "../Utils"

/**
 * Represents the visual representation of a state.
 */
export class UIState implements State {
	// The position and radius of this state
	public x: number;
	public y: number;

	// Is this the initial state?
	public initial: boolean = false;

	// Is this the final state?
	public final: boolean = false;

	// Name of this state (which is written in its body)
	public name: string = "";

	public type: "state";

	constructor(base?: State) {
		if (base) {
			this.x = base.x;
			this.y = base.y;
			this.initial = base.initial;
			this.final = base.final;
			this.name = base.name;
		}

		this.radius = Settings.stateRadius;
	}

	public getPosition(): Point {
		return {
			x: this.x,
			y: this.y
		};
	}

	public getRadius(): number {
		return this.radius;
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

	public render(canvas: GUI.Canvas): void {
		this.renderBody(canvas);
		this.renderInitialMark(canvas);
		this.renderFinalMark(canvas);
		this.renderText(canvas);
	}

	public node(): GUI.Element|null {
		return this.body;
	}

	public html(): SVGElement|null {
		if (!this.body) {
			return null;
		}

		return this.body.node;
	}

	public drag(moveCallback: (event?: any) => void,
				endCallback: (distSquared: number, event: any) => boolean): void {

		if (!this.body) {
			throw Error("Cannot call drag() on a non-rendered state");
		}

		interface MovingEntity {
			ox: number;
			oy: number;
		}

		let self = this;

		// TODO: find a new home for all these functions
		let begin = function(this: MovingEntity, x: any, y: any, event: any) {
			let position = self.getPosition();
			this.ox = position.x;
			this.oy = position.y;
			return {};
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
		let move = function(this: MovingEntity, dx: number, dy: number,
			x: any, y: any, event: any) {

			self.setVisualPosition(this.ox + dx, this.oy + dy);
			if (moveController == 0) {
				moveCallback.call(this, event);
			}

			moveController = (moveController + 1) % callbackFrequency;
			return {};
		};

		let end = function(this: MovingEntity, event: any) {
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
			return {};
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

	private renderBody(canvas: GUI.Canvas): void {
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

	private renderInitialMark(canvas?: GUI.Canvas): void {
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
				if (!canvas) {
					// shouldn't happen, just for type safety
					throw Error();
				}

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

	private renderFinalMark(canvas: GUI.Canvas): void {
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

	private renderText(canvas?: GUI.Canvas): void {
		if (!this.textContainer) {
			this.textContainer = canvas!.text(this.x, this.y, this.name);
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
		this.x = x;
		this.y = y;

		this.body!.attr({
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

	private radius: number;

	// Used to calculate the coordinates of the
	// 'initial state arrow'.
	private initialMarkOffsets: {x: number, y: number}[] = [];

	// The default and current palettes of this state.
	private defaultPalette: StatePalette = Settings.stateDefaultPalette;
	private palette: StatePalette = this.defaultPalette;

	// The GUI components of this state.
	private body: GUI.Element|null = null;
	private ring: GUI.Element|null = null;
	private arrowParts: GUI.Element[] = [];
	private textContainer: GUI.Element|null = null;
}
