import {Settings} from "../Settings"
import {State} from "./State"
import {utils} from "../Utils"

interface Point {
	x: number;
	y: number;
}

export class Edge {
	public setOrigin(origin: State): void {
		this.origin = origin;
	}

	public setTarget(target: State): void {
		this.target = target;
	}

	public setVirtualTarget(target: Point): void {
		this.virtualTarget = target;
	}

	public render(canvas: RaphaelPaper): void {
		this.renderBody(canvas);
		this.renderHead(canvas);
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

	// The state that this edge comes from
	private origin: State = null;

	// The state that this edge points to
	private target: State = null;

	// If this edge is not yet completed, it might point to
	// a position in space rather than a state
	private virtualTarget: Point = null;

	private body: RaphaelElement = null;
	private head: RaphaelElement[] = [];
}
