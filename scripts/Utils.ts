export namespace utils {
	export function select(selector: string): Element {
		return document.querySelector(selector);
	}

	export function id(selector: string): Element {
		return select("#" + selector);
	}

	export function create(tag: string): Element {
		return document.createElement(tag);
	}

	export function foreach(obj: Object, callback) {
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				callback(i, obj[i]);
			}
		}
	}
}
