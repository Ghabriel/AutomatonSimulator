import {AutomatonRenderer} from "./AutomatonRenderer"
import {FormalDefinition, TransitionTable} from "../Controller"
import {EdgeUtils} from "../EdgeUtils"
import {UIEdge} from "./UIEdge"
import {Keyboard} from "../Keyboard"
import {Settings, Strings} from "../Settings"
import {Table} from "./Table"
import {utils} from "../Utils"

export class FormalDefinitionRenderer {
	constructor(automatonRenderer: AutomatonRenderer) {
		this.automatonRenderer = automatonRenderer;
	}

	public render(parent: HTMLElement, formalDefinition: FormalDefinition): void {
		let tupleSequence = formalDefinition.tupleSequence;
		parent.innerHTML = "M = (" + tupleSequence.join(", ") + ")";
		parent.innerHTML += Strings.DEFINITION_WHERE_SUFFIX + "<br>";

		for (let parameter of formalDefinition.parameterSequence) {
			let value = formalDefinition.parameterValues[parameter];
			let container = utils.create("span");

			this.renderParameter(container, parameter, value);

			parent.appendChild(container);
			parent.appendChild(utils.create("br"));
		}
	}

	private renderParameter(container: HTMLElement, parameter: string, value: any): void {
		let type = typeof value;

		if (type == "number" || type == "string") {
			container.innerHTML += parameter + " = " + value;
		} else if (value instanceof Array) {
			container.innerHTML += parameter + " = ";
			container.innerHTML += "{" + value.join(", ") + "}";
		} else if (type == "undefined") {
			let content: string = "";
			content += parameter + " = ";
			content += "<span class='none'>";
			content += Strings.NO_INITIAL_STATE;
			content += "</span>";
			container.innerHTML += content;
		} else if (value.hasOwnProperty("list")) {
			this.renderTransitionTable(container, parameter, value);
		} else {
			container.innerHTML += "unspecified type";
		}
	}

	private renderTransitionTable(container: HTMLElement,
		parameter: string, transitionTable: TransitionTable): void {

		this.renderFunctionSignature(container, parameter, transitionTable);

		let {header, list, metadata} = transitionTable;

		if (list.length == 0) {
			let content: string = "";
			content += "<br>";
			content += "<span class='none'>";
			content += Strings.NO_TRANSITIONS;
			content += "</span>";
			container.innerHTML += content;
			return;
		}

		let table = new Table(list[0].length);
		this.addSimpleRow(table, header);

		let htmlTable = table.html();
		this.renderTransitionTableBody(htmlTable, list, metadata);
		htmlTable.id = "transition_table";

		container.appendChild(htmlTable);
	}

	private renderFunctionSignature(container: HTMLElement,
		parameter: string, table: TransitionTable): void {

		let {domain, codomain, header, list, metadata} = table;
		let arrow = Keyboard.symbols.rightArrow;

		container.innerHTML += parameter + ": ";
		container.innerHTML += domain + " " + arrow + " " + codomain;
	}

	private addSimpleRow(table: Table, cellContents: string[]): void {
		for (let content of cellContents) {
			table.add(utils.create("span", {
				innerHTML: content
			}));
		}
	}

	private renderTransitionTableBody(table: HTMLTableElement,
		contentMatrix: string[][], metadata: [string, string][]): void {

		for (let i = 0; i < contentMatrix.length; i++) {
			let row = utils.create("tr");
			for (let j = 0; j < contentMatrix[i].length; j++) {
				let cell = utils.create("td");
				cell.innerHTML = contentMatrix[i][j];
				row.appendChild(cell);
			}

			this.bindRowEvents(row, metadata[i]);
			table.appendChild(row);
		}
	}

	private bindRowEvents(row: HTMLTableRowElement, metadata: [string, string]): void {
		let automatonRenderer = this.automatonRenderer;
		let highlightedEdge: UIEdge|null = null;
		let highlightPalette = Settings.edgeHighlightPalette;
		let hoverPalette = Settings.edgeFormalDefinitionHoverPalette;

		let unselect = function(): void {
			if (!highlightedEdge) {
				return;
			}

			if (automatonRenderer.isEdgeSelected(highlightedEdge)) {
				highlightedEdge.applyPalette(highlightPalette);
			} else {
				highlightedEdge.removePalette();
			}

			highlightedEdge.render(automatonRenderer.getCanvas());
			highlightedEdge = null;
		};

		row.addEventListener("mouseenter", function() {
			let [origin, target] = metadata;
			let edge = automatonRenderer.getEdge(origin, target);

			if (edge) {
				unselect();
				edge.applyPalette(hoverPalette);
				edge.render(automatonRenderer.getCanvas());
				highlightedEdge = edge;
			}
		});

		row.addEventListener("mouseleave", unselect);

		row.addEventListener("click", function() {
			if (highlightedEdge) {
				automatonRenderer.selectEdge(highlightedEdge);
				unselect();
			}
		});
	}

	private automatonRenderer: AutomatonRenderer;
}
