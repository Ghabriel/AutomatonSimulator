import {Renderer} from "./Renderer"
import {utils} from "../Utils"

export class Table extends Renderer {
	constructor(numRows: number, numColumns: number) {
		super();
		this.numRows = numRows;
		this.numColumns = numColumns;
		this.children = [];
	}

	add(elem: Element): void {
		this.children.push(elem);
	}

	html(): HTMLTableElement {
		let wrapper = utils.create("table");
		let index = 0;
		for (let i = 0; i < this.numRows; i++) {
			let tr = utils.create("tr");
			for (let j = 0; j < this.numColumns; j++) {
				let td = utils.create("td");
				if (index < this.children.length) {
					td.appendChild(this.children[index]);
				}
				tr.appendChild(td);
				index++;
			}
			wrapper.appendChild(tr);
		}
		return <HTMLTableElement> wrapper;
	}

	onRender(): void {
		this.node.appendChild(this.html());
	}

	private numColumns: number;
	private numRows: number;
	private children: Element[];
}
