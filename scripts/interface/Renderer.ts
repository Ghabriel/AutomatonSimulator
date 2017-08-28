/**
 * Represents an entity that renders one or more HTML
 * elements inside a given parent container.
 */
export abstract class Renderer {
	bind(node: Element): void {
		this.node = node;
		this.onBind();
	}

	render(): void {
		if (this.node) {
			this.onRender();
		}
	}

	protected onBind(): void {}
	protected abstract onRender(): void;

	protected node: Element;
}
