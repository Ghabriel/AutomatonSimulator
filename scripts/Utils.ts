/// <reference path="defs/jQuery.d.ts" />

import {Keyboard} from "./Keyboard"
import {Settings, Strings} from "./Settings"
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

	export function toDegrees(angle: number) {
		return angle * 180 / Math.PI;
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

	// Checks if two points are equal. If either point is null,
	// returns false.
	export function samePoint(p1: Point, p2: Point) {
		return p1 && p2 && p1.x == p2.x && p1.y == p2.y;
	}

	// Adds a keyboard shortcut to the page.
	export function bindShortcut(keys: string[], callback: () => void, group?: string): void {
		System.addKeyObserver(keys, callback, group);
	}

	export function lockShortcutGroup(group: string): void {
		System.lockShortcutGroup(group);
	}

	export function unlockShortcutGroup(group: string): void {
		System.unlockShortcutGroup(group);
	}

	// Calls a function asynchronously
	export function async(callback: () => void): void {
		setTimeout(callback, 0);
	}

	// TODO: make this more flexible (regarding the input fields)
	// (maybe also move it to System?)
	export function prompt(message: string, numFields: number,
						   success: (t: string[]) => void,
						   fail?: () => void): void {

		let blocker = this.create("div", {
			className: "click_blocker"
		});

		let container = this.create("div", {
			id: "system_prompt"
		});
		container.innerHTML = message + "<br>";

		let mainbar = this.id(Settings.mainbarID);

		let dismiss = function() {
			// Removes the click blocker from the page
			document.body.removeChild(blocker);

			// Removes the keyboard block
			System.unblockEvents();

			$(container).slideUp(Settings.promptSlideInterval, function() {
				mainbar.removeChild(container);
			});
		};

		let inputs: HTMLInputElement[] = [];

		let ok = this.create("input", {
			type: "button",
			value: Strings.PROMPT_CONFIRM,
			click: function() {
				let contents: string[] = [];
				for (let input of inputs) {
					contents.push(input.value);
				}
				dismiss();
				success(contents);
			}
		});

		let cancel = this.create("input", {
			type: "button",
			value: Strings.PROMPT_CANCEL,
			click: function() {
				dismiss();
				if (fail) {
					fail();
				}
			}
		});

		for (let i = 0; i < numFields; i++) {
			let input = <HTMLInputElement> this.create("input", {
				type: "text"
			});

			input.addEventListener("keydown", function(e) {
				if (e.keyCode == Keyboard.keys.ENTER) {
					ok.click();
				} else if (e.keyCode == Keyboard.keys.ESC) {
					cancel.click();
				}
			});

			inputs.push(input);
			container.appendChild(input);
		}

		container.appendChild(ok);
		container.appendChild(cancel);

		// Adds the "click blocker" to the page
		document.body.insertBefore(blocker, document.body.children[0]);

		// Sets up a keyboard block
		System.blockEvents();

		$(container).toggle();
		// Adds the prompt to the page
		mainbar.insertBefore(container, mainbar.children[0]);
		$(container).slideDown(Settings.promptSlideInterval, function() {
			inputs[0].focus();
		});
	}
}
