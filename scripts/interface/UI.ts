import {Mainbar} from "./Mainbar"
import {Renderer} from "./Renderer"
import {Settings} from "../Settings"
import {Sidebar} from "./Sidebar"
import {System} from "../System"
import {utils} from "../Utils"

export class UI {
	constructor() {
		this.components = [
			[Settings.sidebarID, new Sidebar()],
			[Settings.mainbarID, new Mainbar()]
		];
		this.bindComponents();
	}

	render(): void {
		for (let pair of this.components) {
			pair[1].render();
		}
		console.log("Interface ready.");
	}

	bindComponents(): void {
		for (let pair of this.components) {
			pair[1].bind(utils.id(pair[0]));
		}
	}

	private components: [string, Renderer][] = [];
}
