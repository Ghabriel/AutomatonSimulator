import {Keyboard} from "./Keyboard"
import {Settings} from "./Settings"

interface KeyboardObserver {
	keys: string[];
	callback: () => void;
	group?: string;
}

interface SpecialKeyMapping {
	altKey: boolean;
	ctrlKey: boolean;
	shiftKey: boolean;
}

type SpecialKey = keyof SpecialKeyMapping;

interface KeyboardKeyPress extends SpecialKeyMapping {
	keyCode: number;
	preventDefault: () => void;
}

interface LanguageChangeObserver {
	onLanguageChange: () => void;
}

interface MachineChangeObserver {
	onMachineChange: () => void;
}

const modifiers = ["alt", "ctrl", "shift"];

function propertyName(type: string) {
	return type + "Key";
}

/**
 * Handles keybinding management and a publish-subscribe system
 * for the main events of the application (i.e language-change
 * and machine-change).
 */
export class System {
	// Changes the system language and then notifies all
	// the language change observers.
	static changeLanguage(language: Settings.Language): void {
		Settings.changeLanguage(language);
		for (let listener of this.languageChangeObservers) {
			listener.onLanguageChange();
		}
	}

	// Changes the current machine and then notifies all
	// the machine change observers.
	static changeMachine(type: number): void {
		Settings.changeMachine(type);
		for (let listener of this.machineChangeObservers) {
			listener.onMachineChange();
		}
	}

	// Registers a new language change observer, which will be notified
	// when the system language changes.
	static addLanguageChangeObserver(observer: LanguageChangeObserver): void {
		this.languageChangeObservers.push(observer);
	}

	// Registers a new machine change observer, which will be notified
	// when the system machine changes.
	static addMachineChangeObserver(observer: MachineChangeObserver): void {
		this.machineChangeObservers.push(observer);
	}

	// Triggers a key event as if the user himself
	// had pressed the corresponding keys.
	static emitKeyEvent(keys: string[]): void {
		let event: Partial<KeyboardKeyPress> = {
			preventDefault: function() {}
		};

		for (let modifier of modifiers) {
			event[<SpecialKey> propertyName(modifier)] = false;
		}

		for (let key of keys) {
			if (modifiers.indexOf(key) >= 0) {
				event[<SpecialKey> propertyName(key)] = true;
			} else {
				event.keyCode = Keyboard.keys[<Keyboard.Key> key.toUpperCase()];
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

		let expectedModifiers: string[] = [];
		for (let key of keys) {
			if (modifiers.indexOf(key) >= 0) {
				expectedModifiers.push(key);
				if (!event[<SpecialKey> propertyName(key)]) {
					return false;
				}
			} else if (event.keyCode != Keyboard.keys[<Keyboard.Key> key]) {
				return false;
			}
		}

		// Ignores the key combination if there are extra modifiers being pressed
		for (let modifier of modifiers) {
			if (expectedModifiers.indexOf(modifier) == -1) {
				if (event[<SpecialKey> propertyName(modifier)]) {
					return false;
				}
			}
		}

		return true;
	}

	// Checks if a given keyboard observer is locked.
	private static locked(observer: KeyboardObserver): boolean {
		if (!observer.group) {
			return false;
		}

		return this.lockedGroups.hasOwnProperty(observer.group);
	}

	private static keyboardObservers: KeyboardObserver[] = [];
	private static languageChangeObservers: LanguageChangeObserver[] = [];
	private static machineChangeObservers: MachineChangeObserver[] = [];
	private static eventBlock: boolean = false;
	private static lockedGroups: {[g: string]: boolean} = {};
}
