import {System} from "./System"

export interface Point {
	x: number;
	y: number;
}

export namespace utils {
	export function select(selector: string): Element {
		return document.querySelector(selector);
	}

	export function id(selector: string): Element {
		return select("#" + selector);
	}

	export function create(tag: string, props?: Object): Element {
		let result = document.createElement(tag);
		if (props) {
			this.foreach(props, function(key, value) {
				result[key] = value;
			});
		}
		return result;
	}

	export function foreach(obj: Object, callback): void {
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				if (callback(i, obj[i]) === false) {
					break;
				}
			}
		}
	}

	export function isRightClick(event: any): boolean {
		if ("which" in event) { // Gecko (Firefox), WebKit (Safari/Chrome), Opera
			return event.which == 3;
		} else if ("button" in event) { // IE, Opera
			return event.button == 2;
		}
		// Unknown browser
		console.log("[WARNING] Right click events will not work properly in this browser.");
		return false;
	}

	export function linePath(x1: number, y1: number, x2: number, y2: number) {
		return "M" + x1 + " " + y1 + " L" + x2 + " " + y2;
	}

	export function line(canvas: RaphaelPaper, x1: number, y1: number, x2: number, y2: number) {
		var line = canvas.path(this.linePath(x1, y1, x2, y2));
		// TODO: make the stroke color flexible
		line.attr("stroke", "black");
		return line;
	}

	export function toRadians(angle: number) {
		return angle * Math.PI / 180;
	}

	export function rotatePoint(point: Point,
								center: Point,
								angle: number) {
		let sin = Math.sin(angle);
		let cos = Math.cos(angle);
		let copy = {
			x: point.x,
			y: point.y
		}
		copy.x -= center.x;
		copy.y -= center.y;
		let result = {
			x: copy.x * cos - copy.y * sin,
			y: copy.x * sin + copy.y * cos
		};

		return {
			x: result.x + center.x,
			y: result.y + center.y
		};
	}

	export function bindShortcut(keys: string[], callback: () => void): void {
		System.addKeyObserver(keys, callback);
	}
}
