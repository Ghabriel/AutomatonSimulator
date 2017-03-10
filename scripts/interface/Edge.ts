import {Settings} from "../Settings"
import {State} from "./State"
import {Point, utils} from "../Utils"

export class Edge {
	public setOrigin(origin: State): void {
		this.origin = origin;
	}

	public getOrigin(): State {
		return this.origin;
	}

	public setTarget(target: State): void {
		this.target = target;
	}

	public getTarget(): State {
		return this.target;
	}

	public setVirtualTarget(target: Point): void {
		this.virtualTarget = target;
	}

	public setText(text: string): void {
		this.text = text;
	}

	public render(canvas: RaphaelPaper): void {
		let preservedOrigin = this.origin
						   && utils.samePoint(this.prevOriginPosition,
											  this.origin.getPosition());
		let preservedTarget = this.target
						   && utils.samePoint(this.prevTargetPosition,
											  this.target.getPosition());

		// Don't re-render this edge if neither the origin nor the target
		// states have moved since we last rendered this edge.
		if (!preservedOrigin || !preservedTarget) {
			this.renderBody(canvas);
			this.renderHead(canvas);

			if (this.origin) {
				this.prevOriginPosition = this.origin.getPosition();
			}

			if (this.target) {
				this.prevTargetPosition = this.target.getPosition();
			}
		}

		// Only re-renders this edge's text if either the text has
		// changed or if the origin/target states have moved.
		// Also, don't render any text if this edge is incomplete
		// (i.e it doesn't have a target state yet)
		if (this.target && (!preservedOrigin || !preservedTarget || this.textChanged)) {
			this.renderText(canvas);
		}
	}

	public remove(): void {
		if (this.body) {
			this.body.remove();
			this.body = null;
		}

		for (let elem of this.head) {
			elem.remove();
		}
		this.head = [];
	}

	private renderBody(canvas: RaphaelPaper): void {
		let origin = this.origin.getPosition();
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
		let angle = Math.atan2(dy, dx);
		let sin = Math.sin(angle);
		let cos = Math.cos(angle);
		let offsetX = Settings.stateRadius * cos;
		let offsetY = Settings.stateRadius * sin;
		// Makes the edge start at the border of the state rather than
		// at its center.
		origin.x += offsetX;
		origin.y += offsetY;

		if (this.target) {
			// Adjusts the edge so that it points to the border of the state
			// rather than its center.
			target.x -= offsetX;
			target.y -= offsetY;
		}

		// TODO: handle self-edge correctly
		// TODO: handle cases where two connected states are very close to each other
		if (!this.body) {
			this.body = utils.line(canvas,
					origin.x, origin.y,
					target.x, target.y);
		} else {
			this.body.attr("path", utils.linePath(
				origin.x, origin.y,
				target.x, target.y
			));
		}
	}

	private renderHead(canvas: RaphaelPaper): void {
		if (!this.target) {
			// Don't render the head of the arrow if there's no target
			// TODO: change this behavior?
			return;
		}

		let origin = this.origin.getPosition();
		let target = this.target.getPosition();

		let dx = target.x - origin.x;
		let dy = target.y - origin.y;
		// TODO: don't copy and paste
		let angle = Math.atan2(dy, dx);
		let sin = Math.sin(angle);
		let cos = Math.cos(angle);
		let offsetX = Settings.stateRadius * cos;
		let offsetY = Settings.stateRadius * sin;
		target.x -= offsetX;
		target.y -= offsetY;
		dx -= offsetX;
		dy -= offsetY;

		// Arrow head
		let arrowLength = Settings.edgeArrowLength;
		let alpha = Settings.edgeArrowAngle;
		let edgeLength = Math.sqrt(dx * dx + dy * dy);
		let u = 1 - arrowLength / edgeLength;
		let ref = {
			x: origin.x + u * dx,
			y: origin.y + u * dy
		};


		// The reference points of the arrow head
		let p1 = utils.rotatePoint(ref, target, alpha);
		let p2 = utils.rotatePoint(ref, target, -alpha);

		if (!this.head.length) {
			this.head.push(utils.line(canvas,
				p1.x, p1.y,
				target.x, target.y));

			this.head.push(utils.line(canvas,
				p2.x, p2.y,
				target.x, target.y));
		} else {
			this.head[0].attr("path", utils.linePath(
				p1.x, p1.y,
				target.x, target.y
			));

			this.head[1].attr("path", utils.linePath(
				p2.x, p2.y,
				target.x, target.y
			));
		}
	}

	private renderText(canvas: RaphaelPaper): void {
		// We can assume that there's a target state, since
		// otherwise we wouldn't be rendering the text.
		let origin = this.origin.getPosition();
		let target = this.target.getPosition();
		let x = (origin.x + target.x) / 2;
		let y = (origin.y + target.y) / 2;

		if (!this.textContainer) {
			this.textContainer = canvas.text(x, y, this.text);
			this.textContainer.attr("font-family", Settings.edgeTextFontFamily);
			this.textContainer.attr("font-size", Settings.edgeTextFontSize);
			this.textContainer.attr("stroke", Settings.edgeTextFontColor);
			this.textContainer.attr("fill", Settings.edgeTextFontColor);
		} else {
			this.textContainer.attr("x", x);
			this.textContainer.attr("y", y);
			if (this.textChanged) {
				this.textContainer.attr("text", this.text);
			}
			this.textContainer.transform("");
		}

		let angleRad = Math.atan2(target.y - origin.y, target.x - origin.x);
		let angle = utils.toDegrees(angleRad);

		if (angle < -90 || angle > 90) {
			angle = (angle + 180) % 360;
		}

		this.textContainer.rotate(angle);

		y -= Settings.edgeTextFontSize * .6;
		this.textContainer.attr("y", y);
	}

	// The state that this edge comes from
	private origin: State = null;

	// The state that this edge points to
	private target: State = null;

	// The position where the origin state was when we last rendered
	// this edge. Used to optimize rendering when both the origin and
	// the target didn't move since the previous rendering.
	private prevOriginPosition: Point = null;

	// The position where the target state was when we last rendered
	// this edge. See prevOriginPosition for more context.
	private prevTargetPosition: Point = null;

	// If this edge is not yet completed, it might point to
	// a position in space rather than a state
	private virtualTarget: Point = null;

	// Flag used to check if this edge's text has changed
	// since the last rendering of this edge.
	private textChanged: boolean = true;

	// The text written in this edge
	private text: string = "a, A → ε";

	private textContainer: RaphaelElement = null;
	private body: RaphaelElement = null;
	private head: RaphaelElement[] = [];
}
