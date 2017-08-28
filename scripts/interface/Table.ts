import {Renderer} from "./Renderer"
import {utils} from "../Utils"

/**
 * Represents an easily expansible HTML table with a
 * fixed number of rows and columns.
 */
export class Table extends Renderer {
	constructor(numRows: number, numColumns: number) {
		super();
		this.numRows = numRows;
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
		for (let i = 0; i < this.numRows; i++) {
			let tr = utils.create("tr");
			for (let j = 0; j < this.numColumns; j++) {
				let td = <HTMLTableCellElement> utils.create("td");
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

	public onRender(): void {
		this.node.appendChild(this.html());
	}

	private numColumns: number;
	private numRows: number;
	private customColspans: {[i: number]: number} = {};
	private children: Element[];
}
