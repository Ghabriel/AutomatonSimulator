import {Renderer} from "./Renderer"

export class Menu extends Renderer {
	constructor(title: string) {
		super();
		this.title = title;
	}

	add(elem: Element): void {
		this.children.push(elem);
	}

	onRender(): void {
		var node = this.node;
		node.innerHTML = this.title;
	}

	private title: string;
	private children: Element[];
}
