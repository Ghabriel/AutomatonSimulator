import {Renderer} from "./Renderer"
import {Settings} from "./Settings"
import {utils} from "./Utils"

export class UI {
	constructor(...renderers: Renderer[]) {
		this.bindSidebar(renderers[0]);
		this.bindMain(renderers[1]);
	}

	render(): void {
		this.sidebarRenderer && this.sidebarRenderer.render();
		this.mainRenderer && this.mainRenderer.render();
		console.log("Interface ready.");
	}

	bindSidebar(renderer: Renderer): void {
		if (renderer) {
			renderer.bind(utils.id(Settings.sidebarID));
		}
		this.sidebarRenderer = renderer;
	}

	bindMain(renderer: Renderer): void {
		if (renderer) {
			renderer.bind(utils.id(Settings.mainbarID));
		}
		this.mainRenderer = renderer;
	}

	private sidebarRenderer: Renderer;
	private mainRenderer: Renderer;
}
