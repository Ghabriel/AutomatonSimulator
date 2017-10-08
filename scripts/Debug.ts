
const colors: Map<string> = {
	AutomatonRenderer: "orange",
	MainController: "lime",
	FAController: "red",
	PDAController: "red",
	LBAController: "red",
};

const preserveReturnValues = true;

let level = 0;

export function debug<T>(instance: T): T {
	let proxy: any = instance;

	function call(method: keyof T, value: any, ...args: any[]) {
		let className = (<any> instance.constructor).name;
		let signature = "[" + className + "] " + method;

		log(level, "%c[" + className + "]", "color: " + colors[className],
			method, ...args);
		level++;

		let result = value.call(proxy, ...args);

		level--;
		if (typeof result != "undefined") {
			if (preserveReturnValues) {
				try {
					let copy = JSON.parse(JSON.stringify(result));
					log(level, "=>", copy);
				} catch (e) {
					log(level, "=>*", result);
				}
			} else {
				log(level, "=>*", result);
			}
		}

		return result;
	}

	for (let key in instance) {
		let value = instance[key];
		if (value instanceof Function) {
			proxy[key] = (...args: any[]) => call(key, value, ...args);
		} else {
			proxy[key] = value;
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
