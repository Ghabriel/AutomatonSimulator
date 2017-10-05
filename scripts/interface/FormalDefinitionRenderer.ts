import {AutomatonRenderer} from "./AutomatonRenderer"
import {FormalDefinition, TransitionTable} from "../Controller"
import {UIEdge} from "./Edge"
import {EdgeUtils} from "../EdgeUtils"
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
			let container = utils.create("span");

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
			let content: string = "";
			content += "<br>";
			content += "<span class='none'>";
			content += Strings.NO_TRANSITIONS;
			content += "</span>";
			container.innerHTML += content;
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
			let row = utils.create("tr");
			for (let j = 0; j < list[i].length; j++) {
				let cell = utils.create("td");
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
