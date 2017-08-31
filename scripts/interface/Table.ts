import {Renderer} from "./Renderer"
import {utils} from "../Utils"

/**
 * Represents an easily expansible HTML table with a fixed number of columns.
 */
export class Table extends Renderer {
	constructor(numColumns: number) {
		super();
		this.numColumns = numColumns;
		this.children = [];
	}

	public add(elem: Element, colspan?: number): void {
		if (colspan) {
			this.customColspans[this.children.length] = colspan;
		}
		this.children.push(elem);
	}

	public html(): HTMLTableElement {
		let wrapper = utils.create("table");
		let index = 0;
		while (index < this.children.length) {
			let tr = utils.create("tr");
			for (let j = 0; j < this.numColumns; j++) {
				let td = <HTMLTableCellElement> utils.create("td");
				// the following condition won't be true if the table
				// is incomplete (e.g 9 cells in a table with 5 columns)
				if (index < this.children.length) {
					if (this.customColspans.hasOwnProperty(index + "")) {
						let colSpan = this.customColspans[index];
						td.colSpan = colSpan;
						j += colSpan - 1;
					}
					td.appendChild(this.children[index]);
				}
				tr.appendChild(td);
				index++;
			}
			wrapper.appendChild(tr);
		}
		return <HTMLTableElement> wrapper;
	}

	protected onRender(): void {
		this.node.appendChild(this.html());
	}

	private numColumns: number;
	private customColspans: {[i: number]: number} = {};
	private children: Element[];
}
