import {AutomatonRenderer} from "./AutomatonRenderer"
import {FormalDefinition, TransitionTable} from "../Controller"
import {Edge} from "./Edge"
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
			let type = typeof value;
			let container = <HTMLSpanElement> utils.create("span");

			if (type == "number" || type == "string") {
				container.innerHTML += parameter + " = " + value;
			} else if (value instanceof Array) {
				container.innerHTML += parameter + " = ";
				container.innerHTML += "{" + value.join(", ") + "}";
			} else if (type == "undefined") {
				container.innerHTML += parameter + " = ";
				container.innerHTML += "<span class='none'>";
				container.innerHTML += Strings.NO_INITIAL_STATE;
				container.innerHTML += "</span>";
			} else if (value.hasOwnProperty("list")) {
				this.renderTransitionTable(container, parameter, value);
			} else {
				container.innerHTML += "unspecified type";
			}

			parent.appendChild(container);
			parent.appendChild(utils.create("br"));
		}
	}

	private renderTransitionTable(container: HTMLElement,
		parameter: string, table: TransitionTable): void {

		let domain = table.domain;
		let codomain = table.codomain;
		let header = table.header;
		let list = table.list;
		let metadata = table.metadata;
		let arrow = Keyboard.symbols.rightArrow;

		container.innerHTML += parameter + ": ";
		container.innerHTML += domain + " " + arrow + " " + codomain;

		if (list.length == 0) {
			container.innerHTML += "<br>";
			container.innerHTML += "<span class='none'>";
			container.innerHTML += Strings.NO_TRANSITIONS;
			container.innerHTML += "</span>";
			return;
		}

		let tableWrapper = new Table(list[0].length);

		for (let i = 0; i < header.length; i++) {
			tableWrapper.add(utils.create("span", {
				innerHTML: header[i]
			}));
		}

		let htmlTable = tableWrapper.html();

		for (let i = 0; i < list.length; i++) {
			let row = <HTMLTableRowElement> utils.create("tr");
			for (let j = 0; j < list[i].length; j++) {
				let cell = <HTMLTableCellElement> utils.create("td");
				cell.innerHTML = list[i][j];
				row.appendChild(cell);
			}

			this.bindRowEvents(row, metadata[i]);
			htmlTable.appendChild(row);
		}

		htmlTable.id = "transition_table";
		container.appendChild(htmlTable);
	}

	private bindRowEvents(row: HTMLTableRowElement, metadata: [string, string]): void {
		let automatonRenderer = this.automatonRenderer;
		let highlightedEdge: Edge|null = null;
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
			let edgeList = automatonRenderer.getEdgeList();
			for (let edge of edgeList) {
				let originName = edge.getOrigin()!.getName();
				let targetName = edge.getTarget()!.getName();
				let sameOrigin = (originName == metadata[0]);
				let sameTarget = (targetName == metadata[1]);
				if (sameOrigin && sameTarget) {
					unselect();
					edge.applyPalette(hoverPalette);
					edge.render(automatonRenderer.getCanvas());
					highlightedEdge = edge;
					break;
				}
			}
		});

		row.addEventListener("mouseleave", unselect);
	}

	private automatonRenderer: AutomatonRenderer;
}
