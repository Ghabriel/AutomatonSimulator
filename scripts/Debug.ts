
const colors: Map<string> = {
	AutomatonRenderer: "orange",
	MainController: "lime",
	FAController: "red",
	PDAController: "red",
	LBAController: "red",
};

let level = 0;

export function debug<T>(instance: T): T {
	let proxy: any = {};

	function call(key: keyof T, ...args: any[]) {
		let className = (<any> instance.constructor).name;
		let signature = "[" + className + "] " + key;

		log(level, "%c[" + className + "]", "color: " + colors[className],
			key, ...args);
		level++;

		let result = (<any> instance[key]).call(proxy, ...args);

		level--;
		if (typeof result != "undefined") {
			log(level, "=>", result);
		}

		return result;
	}

	for (let key in instance) {
		if (instance[key] instanceof Function) {
			proxy[key] = (...args: any[]) => call(key, ...args);
		} else {
			proxy[key] = instance[key];
		}
	}

	return <T> proxy;
}

function log(level: number, ...args: any[]): void {
	let debugMode = !!(<any> window)["debugMode"];
	if (!debugMode) return;

	let tabs: string = "";
	for (let i = 0; i < level; i++) {
		tabs += " | ";
	}

	if (args.length > 0 && typeof args[0] == "string") {
		// Preserves color in method calls
		args[0] = tabs + args[0];
		tabs = "";
	}

	if (tabs.length > 0) {
		console.log(tabs, ...args);
	} else {
		console.log(...args);
	}
}
