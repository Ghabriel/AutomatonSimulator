interface DebugTraits {
	[name: string]: ClassDebugTraits;
	default: ClassDebugTraits;
}

interface ClassDebugTraits {
	// The color of the class name in the console
	color: string;

	// Disables debugging inside methods of this class
	restricted?: boolean;
}

const debugTraits: DebugTraits = {
	AutomatonRenderer: {
		color: "orange"
	},
	MainController: {
		color: "lime"
	},
	FAController: {
		color: "red",
		restricted: true
	},
	PDAController: {
		color: "red",
		restricted: true
	},
	LBAController: {
		color: "red",
		restricted: true
	},
	default: {
		color: ""
	}
};

const preserveReturnValues = true;
const levelLimit = -1;

// --------------------------------------------

let debugRestriction = 0;
let level = 0;

export function expose(obj: Map<any>): void {
	for (let key in obj) {
		(<any> window)[key] = obj[key];
	}
}

export function debug<T>(instance: T): T {
	let proxy: any = instance;

	for (let key in instance) {
		let value = instance[key];
		if (value instanceof Function) {
			proxy[key] = (...args: any[]) => call(key, value, ...args);
		} else {
			proxy[key] = value;
		}
	}

	function call(method: keyof T, value: any, ...args: any[]) {
		let className = (<any> instance.constructor).name;
		let traits = debugTraits[className] || debugTraits["default"];
		let temporaryDisable = preventDebugging(traits);

		log(level, "%c[" + className + "]", getColor(traits),
			method, ...args);
		level++;

		if (temporaryDisable) {
			debugRestriction++;
		}

		let result = value.call(proxy, ...args);

		if (temporaryDisable) {
			debugRestriction--;
		}

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

	return <T> proxy;
}

function preventDebugging(traits: ClassDebugTraits): boolean {
	return traits.restricted || (levelLimit > 0 && level >= levelLimit);
}

function isDebugActive(): boolean {
	let globalDebugMode = !!(<any> window)["debugMode"];
	return debugRestriction === 0 && globalDebugMode;
}

function getColor(traits: ClassDebugTraits): string {
	if (traits.color.length == 0) {
		return "";
	}

	return "color: " + traits.color;
}

function log(level: number, ...args: any[]): void {
	if (!isDebugActive()) return;

	let tabs: string = "";
	for (let i = 0; i < level; i++) {
		// tabs += " | ";
		tabs += "    ";
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
