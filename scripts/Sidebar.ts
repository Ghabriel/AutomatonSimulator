import {Renderer} from "./Renderer"

export class Sidebar extends Renderer {
	protected onRender(): void {
		this.node.innerHTML = "sidebar";
	}
}
