import {Renderer} from "./Renderer"

export class Mainbar extends Renderer {
	protected onRender(): void {
		this.node.innerHTML = "main";
	}
}
