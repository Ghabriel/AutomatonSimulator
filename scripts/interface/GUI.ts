
/**
 * Encapsulates the expected behaviors of the GUI framework used. Any
 * framework that respects these interfaces can be used by the application.
 */
export namespace GUI {
	export interface Element {
		attr(key: string, value: any): void;
		attr(key: string): any;
		attr(params: {[key: string]: any}): Element;
		click(handler: Function): Element;
		drag(onmove: (dx: number, dy: number, x: number, y: number, event: DragEvent) => { },
			 onstart: (x: number, y: number, event: DragEvent) => { },
			 onend: (DragEvent: any) => { }): Element;
		node: SVGElement;
		remove(): void;
		rotate(degrees: number): Element;
		transform(instructions: string): Element;
		unclick(handler: Function): Element;
	}

	export interface Canvas {
		// constructor(node: HTMLElement, width: number, height: number);
		circle(x: number, y: number, r: number): Element;
		path(instructions: string): Element;
		setSize(width: number, height: number): void;
		text(x: number, y: number, content: string): Element;
	}
}
