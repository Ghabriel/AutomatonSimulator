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

	private static shortcutMatches(event: KeyboardEvent, keys: string[]): boolean {
		for (let key of keys) {
			switch (key) {
				case "alt":
				case "ctrl":
				case "shift":
					if (!event[key + "Key"]) {
						return false;
					}
					break;
				default:
					if (event.keyCode != Keyboard.keys[key]) {
						return false;
					}
			}
		}
		// TODO: check if there are modifiers (alt/ctrl/shift) that shouldn't
		// be on
		return true;
	}

	private static keyboardObservers: KeyboardObserver[] = [];
	private static sidebar: Sidebar;
}
