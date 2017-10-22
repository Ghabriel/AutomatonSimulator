import {Mainbar} from "./Mainbar"
import {Renderer} from "./Renderer"
import {Settings} from "../Settings"
import {Sidebar} from "./Sidebar"
import {utils} from "../Utils"

/**
 * Core UI class. Contains a list of pairs [id, Renderer] representing
 * the internal components of the UI. New components (e.g a right sidebar)
 * can be added by simply adding new entries to the components array.
 */
export class UI {
	constructor() {
		this.components = [
			[Settings.sidebarID, new Sidebar()],
			[Settings.mainbarID, new Mainbar()]
		];
		this.bindComponents();
	}

	public render(): void {
		for (let pair of this.components) {
			pair[1].render();
		}
	}

	public bindComponents(): void {
		for (let pair of this.components) {
			pair[1].bind(<HTMLElement> utils.id(pair[0])!);
		}
	}

	private components: [string, Renderer][] = [];
}
