import {Keyboard} from "./Keyboard"
import {Sidebar} from "./interface/Sidebar"
import {Settings, Strings} from "./Settings"
import {utils} from "./Utils"

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

const modifiers = ["alt", "ctrl", "shift"];

function propertyName(type) {
	return type + "Key";
}

export class System {
	static changeLanguage(language): void {
		Settings.changeLanguage(language);
		this.reload();
	}

	static reload(): void {
		utils.id(Settings.sidebarID).innerHTML = "";
		this.sidebar.build();
		this.sidebar.render();
	}

	static bindSidebar(sidebar: Sidebar): void {
		this.sidebar = sidebar;
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

	static addKeyObserver(keys: string[], callback: () => void, group?: string): void {
		this.keyboardObservers.push({
			keys: keys,
			callback: callback,
			group: group
		});
	}

	static lockShortcutGroup(group: string): void {
		this.lockedGroups[group] = true;
	}

	static unlockShortcutGroup(group: string): void {
		delete this.lockedGroups[group];
	}

	static blockEvents(): void {
		this.eventBlock = true;
	}

	static unblockEvents(): void {
		this.eventBlock = false;
	}

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

	private static locked(observer: KeyboardObserver): boolean {
		return this.lockedGroups.hasOwnProperty(observer.group);
	}

	private static keyboardObservers: KeyboardObserver[] = [];
	private static sidebar: Sidebar;
	private static eventBlock: boolean = false;
	private static lockedGroups: {[g: string]: boolean} = {};
}
