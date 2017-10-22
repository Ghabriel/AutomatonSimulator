import {GUI} from "./interface/GUI"

type StringMap<T> = {[key: string]: T};
type Map<T>
	= {[key: string]: T}
	| {[key: number]: T};
type ArbitraryMap = Map<any>;

type MapIteratorCallback<V>
	= ((key: string, value: V) => boolean)
	| ((key: string, value: V) => void);

/**
 * Utility functions in general that have no better place.
 */
export namespace utils {
	export function select(selector: string): Element|null {
		return document.querySelector(selector);
	}

	export function id(selector: string): Element|null {
		return select("#" + selector);
	}

	// Creates a tag with a given name and optionally given properties.
	export function create<T extends keyof HTMLElementTagNameMap>(tag: T,
		props?: ArbitraryMap): HTMLElementTagNameMap[T] {

		let result = document.createElement(tag);
		if (props) {
			foreach(props, function(key, value) {
				// TODO: handle other events
				if (key == "click") {
					result.addEventListener("click", value);
				} else {
					result[<keyof typeof result> key] = value;
				}
			});
		}
		return result;
	}

	// Utility functions for commonly used tags
	export function createSelect(options: string[]): HTMLSelectElement {
		let result = create("select");

		let i = 0;
		for (let text of options) {
			let option = utils.create("option", { value: i, innerHTML: text });
			result.appendChild(option);
			i++;
		}

		return result;
	}

	export function span(content: string): HTMLSpanElement {
		return create("span", { innerHTML: content });
	}

	export function checkbox(checked: boolean = false): HTMLInputElement {
		return create("input", {
			checked: checked,
			type: "checkbox"
		});
	}

	// Iterates over an object, applying a callback to each property.
	export function foreach<T>(obj: Map<T>, callback: MapIteratorCallback<T>): void {
		for (let i in obj) {
			if (obj.hasOwnProperty(i)) {
				if (callback(i, (<StringMap<T>> obj)[i]) === false) {
					break;
				}
			}
		}
	}

	export function clone<T>(value: T): T {
		if (value instanceof Array) {
			return cloneArray(value);
		}

		if (typeof value != "object") {
			return value;
		}

		let copy: Partial<T> = {};
		for (let key in value) {
			copy[key] = clone(value[key]);
		}

		return <T> copy;
	}

	function cloneArray<T, A extends T[]>(values: A): A {
		let copy: T[] = [];
		for (let value of values) {
			copy.push(clone(value));
		}

		for (let key in values) {
			if (isNaN(parseInt(key))) {
				copy[key] = clone(values[key]);
			}
		}

		return <A> copy;
	}

	export function isSameArray<T>(first: T[], second: T[]): boolean {
		if (first.length != second.length) {
			return false;
		}

		for (let i = 0; i < first.length; i++) {
			if (first[i] != second[i]) {
				return false;
			}
		}

		return true;
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
		var line = canvas.path(linePath(x1, y1, x2, y2));
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

	/**
	 * Given two paths, returns two substrings of them
	 * starting at the point where they diverge.
	 * Example:
	 * 	divergence("a/b/css/styles.css", "a/b/scripts/main.js")
	 * Returns:
	 * 	["css/styles.css", "scripts/main.js"]
	 */
	export function divergence(first: string, second: string): string[] {
		let i = 0;
		while (first[i] == second[i]) {
			i++;
		}

		return [
			first.substr(i),
			second.substr(i)
		];
	}

	/**
	 * Given a file path, returns its directory name.
	 * Note that this function expects a simple path of the form:
	 * 	[folder name][directory separator][file name].[extension]
	 * The actual directory separator is irrelevant as long as it
	 * doesn't match the regular expression /[A-Za-z0-9]/ and has
	 * a length equal to 1.
	 *
	 * Example:
	 * 	dirname("css/styles.css")
	 * Returns:
	 * 	"css"
	 * @param  {string} path The path of a file
	 * @return {string} The name of the directory that contains the file.
	 */
	export function dirname(path: string): string {
		function reverse(input: string): string {
			return input.split("").reverse().join("");
		}

		// Evaluate everything backwards to let the greedy
		// + operator match the entire filename.
		let matcher = /[A-Za-z]+\.[A-Za-z0-9]+(.*)/;
		let matches = reverse(path).match(matcher);
		if (matches === null) {
			return "";
		}
		return reverse(matches[1].substr(1));
	}

	// Returns a string representation of the cartesian product of a
	// group of fields. This function's main purpose is to increase
	// readability at the call site.
	export function cartesianProduct(...fields: string[]): string {
		return fields.join(" x ");
	}

	// Used for type checking and throwing exceptions
	// on code that should be unreachable
	export function assertNever(value: never): never {
		throw Error("Invalid value: " + value);
	}

	export function toJSON<T>(obj: T): JSONData<T> {
		return {
			brand: <T> <any> null,
			data: JSON.stringify(obj)
		};
	}

	export function fromJSON<T>(json: JSONData<T>): T {
		return JSON.parse(json.data);
	}

	// Re-routes every edge in an indexed edge group when a state renaming occurs
	export function rerouteEdges<T extends State, TEdge extends Edge<T>>(
		edgeList: IndexedEdgeGroup<TEdge>, oldName: string, newName: string): void {

		if (edgeList.hasOwnProperty(oldName)) {
			edgeList[newName] = edgeList[oldName];
			delete edgeList[oldName];
		}

		utils.foreach(edgeList, (origin, indexedByTarget) => {
			if (indexedByTarget.hasOwnProperty(oldName)) {
				indexedByTarget[newName] = indexedByTarget[oldName];
				delete indexedByTarget[oldName];
			}
		});
	}

	/**
	 * Sanitizes a string to show it in the interface.
	 * This basically replaces < with &lt; and > with &gt;.
	 * If the parameter is not a string, nothing happens.
	 */
	export function sanitize(value: any): any {
		if (typeof value == "string") {
			value = value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		}

		return value;
	}
}
