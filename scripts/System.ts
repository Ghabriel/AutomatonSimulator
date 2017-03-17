import {Keyboard} from "./Keyboard"
import {Sidebar} from "./interface/Sidebar"
import {Settings, Strings} from "./Settings"
import {utils} from "./Utils"

interface KeyboardObserver {
	keys: string[];
	callback: () => void;
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

	static keyEvent(event: KeyboardEvent): boolean {
		let triggered = false;
		for (let observer of this.keyboardObservers) {
			let keys = observer.keys;
			if (this.shortcutMatches(event, keys)) {
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

	static addKeyObserver(keys: string[], callback: () => void): void {
		this.keyboardObservers.push({
			keys: keys,
			callback: callback
		});
	}

	static blockEvents(): void {
		this.eventBlock = true;
	}

	static unblockEvents(): void {
		this.eventBlock = false;
	}

	private static shortcutMatches(event: KeyboardEvent, keys: string[]): boolean {
		if (this.eventBlock) {
			// Ignore all keyboard events if there's an active event block.
			return false;
		}

		function propertyName(type) {
			return type + "Key";
		}

		const modifiers = ["alt", "ctrl", "shift"];
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

	private static keyboardObservers: KeyboardObserver[] = [];
	private static sidebar: Sidebar;
	private static eventBlock: boolean = false;
}
