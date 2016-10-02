export abstract class Renderer {
	bind(node: Element): void {
		this.node = node;
		this.onBind();
	}

	render(): void {
		if (this.node) {
			this.node.innerHTML = "";
			this.onRender();
		}
	}

	protected onBind(): void {}
	protected abstract onRender(): void;

	protected node: Element;
}
