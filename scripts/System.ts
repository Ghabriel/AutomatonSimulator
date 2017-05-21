import {Keyboard} from "./Keyboard"
import {Settings} from "./Settings"

interface KeyboardObserver {
	keys: string[];
	callback: () => void;
	group: string;
}

interface KeyboardKeyPress {
	altKey: boolean;
	ctrlKey: boolean;
	shiftKey: boolean;
	keyCode: number;
	preventDefault: () => void;
}

interface LanguageChangeObserver {
	onLanguageChange: () => void;
}

const modifiers = ["alt", "ctrl", "shift"];

function propertyName(type) {
	return type + "Key";
}

export class System {
	// Changes the system language and then notifies all
	// the language change observers.
	static changeLanguage(language): void {
		Settings.changeLanguage(language);
		for (let listener of this.languageChangeObservers) {
			listener.onLanguageChange();
		}
	}

	// Registers a new language change observer, which will be notified
	// when the system language changes.
	static addLanguageChangeObserver(observer: LanguageChangeObserver): void {
		this.languageChangeObservers.push(observer);
	}

	static emitKeyEvent(keys: string[]): void {
		let event = {
			preventDefault: function() {}
		};

		for (let modifier of modifiers) {
			event[propertyName(modifier)] = false;
		}

		for (let key of keys) {
			if (modifiers.indexOf(key) >= 0) {
				event[propertyName(key)] = true;
			} else {
				event["keyCode"] = Keyboard.keys[key.toUpperCase()];
			}
		}

		this.keyEvent(<KeyboardKeyPress> event);
	}

	// Notifies every non-locked keyboard observer that is 'interested'
	// in the triggered keyboard event.
	static keyEvent(event: KeyboardKeyPress): boolean {
		let triggered = false;
		for (let observer of this.keyboardObservers) {
			let keys = observer.keys;
			if (!this.locked(observer) && this.shortcutMatches(event, keys)) {
				observer.callback();
				triggered = true;
			}
		}

		if (triggered) {
			event.preventDefault();
			return false;
		}
		return true;
	}

	// Binds a keyboard shortcut to the page.
	static bindShortcut(keys: string[], callback: () => void, group?: string): void {
		this.keyboardObservers.push({
			keys: keys,
			callback: callback,
			group: group
		});
	}

	// Disables all shortcuts in a given shortcut group.
	static lockShortcutGroup(group: string): void {
		this.lockedGroups[group] = true;
	}

	// Enables all shortcuts in a given shortcut group.
	static unlockShortcutGroup(group: string): void {
		delete this.lockedGroups[group];
	}

	// Sets a global lock for keyboard shortcuts.
	static blockEvents(): void {
		this.eventBlock = true;
	}

	// Unsets the keyboard shortcuts global lock.
	static unblockEvents(): void {
		this.eventBlock = false;
	}

	// Checks if a given keyboard event matches a given group of keys.
	private static shortcutMatches(event: KeyboardKeyPress, keys: string[]): boolean {
		if (this.eventBlock) {
			// Ignore all keyboard events if there's an active event block.
			return false;
		}

		let expectedModifiers = [];
		for (let key of keys) {
			if (modifiers.indexOf(key) >= 0) {
				expectedModifiers.push(key);
				if (!event[propertyName(key)]) {
					return false;
				}
			} else if (event.keyCode != Keyboard.keys[key]) {
				return false;
			}
		}

		// Ignores the key combination if there are extra modifiers being pressed
		for (let modifier of modifiers) {
			if (expectedModifiers.indexOf(modifier) == -1) {
				if (event[propertyName(modifier)]) {
					return false;
				}
			}
		}

		return true;
	}

	// Checks if a given keyboard observer is locked.
	private static locked(observer: KeyboardObserver): boolean {
		return this.lockedGroups.hasOwnProperty(observer.group);
	}

	private static keyboardObservers: KeyboardObserver[] = [];
	private static languageChangeObservers: LanguageChangeObserver[] = [];
	private static eventBlock: boolean = false;
	private static lockedGroups: {[g: string]: boolean} = {};
}
