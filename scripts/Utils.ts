/// <reference path="defs/raphael.d.ts" />

import {GUI} from "./interface/GUI"

export interface Point {
	x: number;
	y: number;
}

/**
 * Utility functions in general that have no better place.
 */
export namespace utils {
	export function select(selector: string): Element {
		return document.querySelector(selector);
	}

	export function id(selector: string): Element {
		return select("#" + selector);
	}

	// Creates a tag with a given name and optionally given properties.
	export function create(tag: string, props?: Object): Element {
		let result = document.createElement(tag);
		if (props) {
			this.foreach(props, function(key, value) {
				// TODO: handle other events
				if (key == "click") {
					result.addEventListener("click", value);
				} else {
					result[key] = value;
				}
			});
		}
		return result;
	}

	// Iterates over an object, applying a callback to each property.
	export function foreach<T>(obj: {[key: string]: T}, callback: (string, T) => boolean|void): void {
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				if (callback(i, obj[i]) === false) {
					break;
				}
			}
		}
	}

	// Checks if a given event represents a right click
	export function isRightClick(event: any): boolean {
		if ("which" in event) { // Gecko (Firefox), WebKit (Chrome/Safari), Opera
			return event.which == 3;
		} else if ("button" in event) { // IE, Opera
			return event.button == 2;
		}
		// Unknown browser
		console.log("[WARNING] Right click events will not work properly in this browser.");
		return false;
	}

	export function linePath(x1: number, y1: number, x2: number, y2: number): string {
		return "M" + x1 + " " + y1 + " L" + x2 + " " + y2;
	}

	// Draws a line from (x1,y1) to (x2,y2)
	export function line(canvas: GUI.Canvas, x1: number, y1: number, x2: number, y2: number) {
		var line = canvas.path(this.linePath(x1, y1, x2, y2));
		// TODO: make the stroke color flexible
		line.attr("stroke", "black");
		return line;
	}

	// Converts a given angle from degrees to radians
	export function toRadians(angle: number): number {
		return angle * Math.PI / 180;
	}

	// Converts a given angle from radians to degrees
	export function toDegrees(angle: number): number {
		return angle * 180 / Math.PI;
	}

	// Rotates a point around an axis by a given angle.
	export function rotatePoint(point: Point,
								center: Point,
								angle: number): Point {
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

	// Checks if two points are equal. If either point is null,
	// returns false.
	export function samePoint(p1: Point, p2: Point): boolean {
		return p1 && p2 && p1.x == p2.x && p1.y == p2.y;
	}

	// Calls a function asynchronously
	export function async(callback: () => void): void {
		setTimeout(callback, 0);
	}

	// Returns a string representation of a keyboard shortcut
	export function printShortcut(keys: string[]): string {
		return keys.join(" ").toLowerCase();
	}

	// Can be used by the machines to sanitize user input
	export function optionalSymbolValidator(input: string): boolean {
		return input.length <= 1;
	}

	// Can be used by the machines to sanitize user input
	export function singleSymbolValidator(input: string): boolean {
		return input.length == 1;
	}

	// Can be used by the machines to sanitize user input
	export function nonEmptyStringValidator(input: string): boolean {
		return input.length > 0;
	}
}
