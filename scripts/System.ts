interface KeyboardObserver {
	keys: string[];
	callback: () => void;
}

export class System {
	static reload(): void {
		// TODO
	}

	static keyEvent(event: KeyboardEvent): boolean {
		let triggered = false;
		for (let observer of this.keyboardObservers) {
			let keys = observer.keys;
			if (this.shortcutMatches(event, keys)) {
				observer.callback();
				triggered = true;
			}
		}
		// if (event.ctrlKey && event.keyCode == 83) {

		if (triggered) {
			event.preventDefault();
			return false;
		}
		return true;
	}

	static addKeyObserver(keys: string[], callback: () => void): void {
		this.keyboardObservers.push({
			keys: keys,
			callback: callback
		});
	}

	private static shortcutMatches(event: KeyboardEvent, keys: string[]): boolean {
		console.log(event, keys);
		for (let key of keys) {
			console.log("[KEY] " + key);
			switch (key) {
				case "alt":
				case "ctrl":
				case "shift":
					if (!event[key + "Key"]) {
						return false;
					}
					break;
				default:
					// TODO: remove the usage of event.key
					if (event.key != key) {
						console.log("[NO]");
						return false;
					}
			}
		}
		// TODO: check if there are modifiers (alt/ctrl/shift) that shouldn't
		// be on
		console.log("[YES]");
		return true;
	}

	private static keyboardObservers: KeyboardObserver[] = [];
}
