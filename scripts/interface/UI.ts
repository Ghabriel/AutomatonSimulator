import {Mainbar} from "./Mainbar"
import {Renderer} from "./Renderer"
import {Settings} from "../Settings"
import {Sidebar} from "./Sidebar"
import {System} from "../System"
import {utils} from "../Utils"

export class UI {
	constructor() {
		let sidebar = new Sidebar();
		let mainbar = new Mainbar();
		this.bindSidebar(sidebar);
		this.bindMain(mainbar);
	}

	render(): void {
		this.sidebarRenderer.render();
		this.mainRenderer.render();
		console.log("Interface ready.");
	}

	bindSidebar(renderer: Renderer): void {
		renderer.bind(utils.id(Settings.sidebarID));
		this.sidebarRenderer = renderer;
	}

	bindMain(renderer: Renderer): void {
		renderer.bind(utils.id(Settings.mainbarID));
		this.mainRenderer = renderer;
	}

	private sidebarRenderer: Renderer;
	private mainRenderer: Renderer;
}
