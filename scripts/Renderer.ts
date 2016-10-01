export abstract class Renderer {
	bind(node: Element): void {
		this.node = node;
	}

	render(): void {
		if (this.node) {
			this.node.innerHTML = "";
			this.onRender();
		}
	}

	protected abstract onRender(): void;

	protected node: Element;
}
