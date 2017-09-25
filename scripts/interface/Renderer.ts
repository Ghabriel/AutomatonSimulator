/**
 * Represents an entity that renders one or more HTML
 * elements inside a given parent container.
 */
export abstract class Renderer {
	public bind(node: HTMLElement): void {
		this.node = node;
		this.onBind();
	}

	public render(): void {
		if (this.node) {
			this.onRender();
		}
	}

	protected onBind(): void {}
	protected abstract onRender(): void;

	protected node: HTMLElement;
}
