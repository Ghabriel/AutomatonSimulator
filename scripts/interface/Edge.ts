/// <reference path="../types.ts" />

import {GUI} from "./GUI"
import {Settings} from "../Settings"
import {UIState} from "./State"
import {EdgePalette} from "../Palette"
import {Point, utils} from "../Utils"

enum EdgeType {
	NORMAL,
	LOOP,
	CURVED
}

/**
 * Represents the visual representation of an edge,
 * which may contain multiple transitions.
 */
export class PartialUIEdge implements PartialEdge<UIState> {
	// The state that this edge comes from
	public origin?: UIState;

	// The state that this edge points to
	public target?: UIState;

	// A list of texts written in this edge
	public textList: string[] = [];

	// A list of data lists used by the controllers to
	// precisely define this transition
	public dataList: string[][] = [];

	public type: "edge";

	public constructor() {
		let self = this;
		this.clickCallback = function(e) {
			for (let callback of self.clickHandlers) {
				// Only call the callback if this edge is visible
				// (in particular, this disables events for removed edges).
				// TODO: currently removed this restriction, is it necessary?
				// if (self.body.length > 0) {
					callback.call(self);
				// }
			}
		};
	}

	public setVirtualTarget(target: Point): void {
		this.virtualTarget = target;
	}

	public setCurveFlag(flag: boolean): void {
		this.forcedRender = this.forcedRender || (this.curved != flag);
		this.curved = flag;
	}

	public isCurved(): boolean {
		return this.curved;
	}

	public removed(): boolean {
		return this.deleted;
	}

	public addClickHandler(callback: () => void): void {
		this.clickHandlers.push(callback);
		this.rebindClickHandlers();
	}

	public remove(): void {
		for (let elem of this.body) {
			elem.remove();
		}
		this.body = [];

		for (let elem of this.head) {
			elem.remove();
		}
		this.head = [];

		if (this.textContainer) {
			this.textContainer.remove();
			this.textContainer = null;
		}

		this.deleted = true;
	}

	public applyPalette(palette: EdgePalette): void {
		this.palette = palette;
		this.forcedRender = true;
	}

	public removePalette(): void {
		this.palette = this.defaultPalette;
		this.forcedRender = true;
	}

	public render(canvas: GUI.Canvas): void {
		let preservedOrigin = this.origin
						   && utils.samePoint(this.prevOriginPosition,
											  this.origin.getPosition());
		let preservedTarget = this.target
						   && utils.samePoint(this.prevTargetPosition,
											  this.target.getPosition());

		// Don't re-render this edge if neither the origin nor the target
		// states have moved since we last rendered this edge, unless
		// the forced re-render is active.
		if (!preservedOrigin || !preservedTarget || this.forcedRender) {
			this.renderBody(canvas);
			this.renderHead(canvas);

			if (this.origin) {
				this.prevOriginPosition = this.origin.getPosition();
			}

			if (this.target) {
				this.prevTargetPosition = this.target.getPosition();
			}

			this.forcedRender = false;
		}

		for (let elem of this.body) {
			elem.attr("stroke", this.palette.strokeColor);
		}

		for (let elem of this.head) {
			elem.attr("stroke", this.palette.strokeColor);
		}

		// Only re-renders this edge's text if this edge is
		// complete (i.e it already has a target state)
		if (this.target) {
			this.renderText(canvas);
		}
	}

	// Re-binds all click events of this edge.
	private rebindClickHandlers(): void {
		for (let elem of this.body) {
			elem.unclick(this.clickCallback);
			elem.click(this.clickCallback);
		}
	}

	private stateCenterOffsets(dx: number, dy: number): Point {
		let angle = Math.atan2(dy, dx);
		let sin = Math.sin(angle);
		let cos = Math.cos(angle);
		let offsetX = Settings.stateRadius * cos;
		let offsetY = Settings.stateRadius * sin;
		return {
			x: offsetX,
			y: offsetY
		};
	}

	private renderBody(canvas: GUI.Canvas): void {
		let origin = this.origin!.getPosition();
		let target: typeof origin;
		if (!this.target) {
			if (this.virtualTarget) {
				target = {
					x: this.virtualTarget.x,
					y: this.virtualTarget.y
				};
				let dx = target.x - origin.x;
				let dy = target.y - origin.y;
				// The offsets are necessary to ensure that mouse events are
				// still correctly fired, since not using them makes the edge
				// appear directly below the cursor.
				target.x = origin.x + dx * 0.98;
				target.y = origin.y + dy * 0.98;
			} else {
				target = origin;
			}
		} else {
			target = this.target.getPosition();
		}

		let dx = target.x - origin.x;
		let dy = target.y - origin.y;
		let radius = Settings.stateRadius;
		let offsets = this.stateCenterOffsets(dx, dy);
		// Makes the edge start at the border of the state rather than
		// at its center, unless the virtual target is inside the state.
		// That condition makes it easier to create loops.
		if (dx * dx + dy * dy > radius * radius) {
			origin.x += offsets.x;
			origin.y += offsets.y;
		}

		if (this.target) {
			// Adjusts the edge so that it points to the border of the state
			// rather than its center.
			target.x -= offsets.x;
			target.y -= offsets.y;
		}

		// TODO: handle cases where two connected states are very close to each other
		if (this.origin == this.target) {
			this.loop(canvas);
		} else if (this.isCurved()) {
			this.curve(canvas, origin, target);
		} else {
			this.normal(canvas, origin, target);
		}
	}

	// Adjusts the this.body array so that its length and its type
	// is equal to given values. If the current type is different
	// than the passed type, all event clicks are rebound to ensure
	// that they still work properly with a body of a potentially
	// different size.
	private adjustBody(canvas: GUI.Canvas, length: number, type: EdgeType): void {
		while (this.body.length > length) {
			this.body[this.body.length - 1].remove();
			this.body.pop();
		}

		// Expands the array to the correct length
		while (this.body.length < length) {
			this.body.push(utils.line(canvas, 0, 0, 0, 0));
		}

		if (type != this.currentEdgeType) {
			this.currentEdgeType = type;

			// Re-binds all click events
			this.rebindClickHandlers();
		}
	}

	// Renders a loop-style body.
	private loop(canvas: GUI.Canvas): void {
		let radius = Settings.stateRadius;
		let pos = this.origin!.getPosition();
		this.adjustBody(canvas, 4, EdgeType.LOOP);
		for (let elem of this.body) {
			elem.attr("stroke-width", this.palette.arrowThickness);
		}

		this.body[0].attr("path", utils.linePath(
			pos.x + radius, pos.y,
			pos.x + 2 * radius, pos.y
		));
		this.body[1].attr("path", utils.linePath(
			pos.x + 2 * radius, pos.y,
			pos.x + 2 * radius, pos.y - 2 * radius
		));
		this.body[2].attr("path", utils.linePath(
			pos.x + 2 * radius, pos.y - 2 * radius,
			pos.x, pos.y - 2 * radius
		));
		this.body[3].attr("path", utils.linePath(
			pos.x, pos.y - 2 * radius,
			pos.x, pos.y - radius
		));
	}

	// Renders a curved body.
	private curve(canvas: GUI.Canvas, origin: Point, target: Point): void {
		let dx = target.x - origin.x;
		let dy = target.y - origin.y;

		let hypot = Math.sqrt(dx * dx + dy * dy);

		// A normalized vector that is perpendicular to the
		// line joining the origin and the target.
		let perpVector: Point = {
			x: dy / hypot,
			y: -dx / hypot
		};

		let distance = 30;
		let offsets = {
			x: distance * perpVector.x,
			y: distance * perpVector.y
		};

		this.adjustBody(canvas, 3, EdgeType.CURVED);
		for (let elem of this.body) {
			elem.attr("stroke-width", this.palette.arrowThickness);
		}

		this.body[0].attr("path", utils.linePath(
			origin.x, origin.y,
			origin.x + offsets.x + dx * 0.125, origin.y + offsets.y + dy * 0.125
		));

		this.body[1].attr("path", utils.linePath(
			origin.x + offsets.x + dx * 0.125, origin.y + offsets.y + dy * 0.125,
			origin.x + offsets.x + dx * 0.875, origin.y + offsets.y + dy * 0.875
		));

		this.body[2].attr("path", utils.linePath(
			origin.x + offsets.x + dx * 0.875, origin.y + offsets.y + dy * 0.875,
			target.x, target.y
		));
	}

	// Renders a normal body (i.e a straight line)
	private normal(canvas: GUI.Canvas, origin: Point, target: Point): void {
		this.adjustBody(canvas, 1, EdgeType.NORMAL);
		for (let elem of this.body) {
			elem.attr("stroke-width", this.palette.arrowThickness);
		}

		this.body[0].attr("path", utils.linePath(
			origin.x, origin.y,
			target.x, target.y
		));
	}

	private renderHead(canvas: GUI.Canvas): void {
		if (!this.target) {
			// Don't render the head of the arrow if there's no target
			return;
		}

		let origin: Point;
		let target: Point;
		let dx: number;
		let dy: number;

		if (this.origin == this.target) {
			// Loop case
			let pos = this.origin.getPosition();
			let radius = Settings.stateRadius;
			origin = {
				x: pos.x,
				y: pos.y - 2 * radius
			};
			target = {
				x: pos.x,
				y: pos.y - radius
			};

			dx = 0;
			dy = radius;
		} else if (this.isCurved()) {
			let path = this.body[2].attr("path");
			origin = {
				x: path[0][1],
				y: path[0][2],
			};
			target = {
				x: path[1][1],
				y: path[1][2]
			};

			dx = target.x - origin.x;
			dy = target.y - origin.y;
		} else {
			// Non-loop case
			origin = this.origin!.getPosition();
			target = this.target.getPosition();

			dx = target.x - origin.x;
			dy = target.y - origin.y;
			let offsets = this.stateCenterOffsets(dx, dy);
			target.x -= offsets.x;
			target.y -= offsets.y;
			dx -= offsets.x;
			dy -= offsets.y;
		}

		// Arrow head
		let arrowLength = this.palette.arrowLength;
		let alpha = this.palette.arrowAngle;
		let edgeLength = Math.sqrt(dx * dx + dy * dy);
		let u = 1 - arrowLength / edgeLength;
		let ref = {
			x: origin.x + u * dx,
			y: origin.y + u * dy
		};


		// The reference points of the arrow head
		let p1 = utils.rotatePoint(ref, target, alpha);
		let p2 = utils.rotatePoint(ref, target, -alpha);

		let isHeadEmpty = (this.head.length == 0);

		if (isHeadEmpty) {
			this.head.push(utils.line(canvas, 0, 0, 0, 0));
			this.head.push(utils.line(canvas, 0, 0, 0, 0));
		}

		if (this.forcedRender || isHeadEmpty) {
			// Re-set the stroke-width if there's a forced render
			// because it might have been caused by a change of
			// palette.
			for (let elem of this.head) {
				elem.attr("stroke-width", this.palette.arrowThickness);
			}
		}

		this.head[0].attr("path", utils.linePath(
			p1.x, p1.y,
			target.x, target.y
		));

		this.head[1].attr("path", utils.linePath(
			p2.x, p2.y,
			target.x, target.y
		));
	}

	private preparedText(): string {
		return this.textList.join("\n");
	}

	private renderText(canvas: GUI.Canvas): void {
		// We can assume that there's a target state, since
		// otherwise we wouldn't be rendering the text.
		let origin = this.origin!.getPosition();
		let target = this.target!.getPosition();
		let x: number;
		let y: number;

		if (this.origin == this.target) {
			// Loop case
			let radius = Settings.stateRadius;
			x = origin.x + radius;
			y = origin.y - 2 * radius;
		} else if (this.isCurved()) {
			// Curved case
			let path = this.body[1].attr("path");
			let x1 = path[0][1];
			let y1 = path[0][2];
			let x2 = path[1][1];
			let y2 = path[1][2];
			x = (x1 + x2) / 2;
			y = (y1 + y2) / 2;
		} else {
			// Normal case
			x = (origin.x + target.x) / 2;
			y = (origin.y + target.y) / 2;
		}

		if (!this.textContainer) {
			this.textContainer = canvas.text(x, y, this.preparedText());
			this.textContainer.attr("font-family", this.palette.textFontFamily);
			this.textContainer.attr("font-size", this.palette.textFontSize);
			this.textContainer.attr("stroke", this.palette.textFontColor);
			this.textContainer.attr("fill", this.palette.textFontColor);
		} else {
			this.textContainer.attr("x", x);
			this.textContainer.attr("y", y);
			this.textContainer.attr("text", this.preparedText());
			this.textContainer.transform("");
		}

		let angleRad = Math.atan2(target.y - origin.y, target.x - origin.x);
		let angle = utils.toDegrees(angleRad);

		if (angle < -90 || angle > 90) {
			angle = (angle + 180) % 360;
		}

		this.textContainer.rotate(angle);

		y -= this.palette.textFontSize * .6;
		y -= this.palette.textFontSize * (this.textList.length - 1) * .7;
		this.textContainer.attr("y", y);
	}

	// The position where the origin state was when we last rendered
	// this edge. Used to optimize rendering when both the origin and
	// the target didn't move since the previous rendering.
	private prevOriginPosition: Point;

	// The position where the target state was when we last rendered
	// this edge. See prevOriginPosition for more context.
	private prevTargetPosition: Point;

	// If this edge is not yet completed, it might point to
	// a position in space rather than a state
	private virtualTarget: Point|null = null;

	// Is this a curved edge?
	private curved: boolean = false;

	// Should this edge be re-rendered regardless if its position changed?
	private forcedRender: boolean = false;

	// Was this edge previously removed?
	private deleted: boolean = false;

	// The default and current palettes of this edge.
	private defaultPalette: EdgePalette = Settings.edgeDefaultPalette;
	private palette: EdgePalette = this.defaultPalette;

	// The GUI components of this edge.
	private body: GUI.Element[] = [];
	private head: GUI.Element[] = [];
	private textContainer: GUI.Element|null = null;

	// The click events of this edge.
	private clickHandlers: (() => void)[] = [];

	private clickCallback: (event: Event) => void;

	private currentEdgeType: EdgeType;
}

export class UIEdge extends PartialUIEdge implements Edge<UIState> {
	public origin: UIState;
	public target: UIState;
}
