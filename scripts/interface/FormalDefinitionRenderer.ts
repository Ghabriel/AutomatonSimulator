import {AutomatonRenderer} from "./AutomatonRenderer"
import {FormalDefinition, TransitionTable} from "../Controller"
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
		let self = this;

		for (let i = 0; i < list.length; i++) {
			let row = utils.create("tr");
			for (let j = 0; j < list[i].length; j++) {
				let cell = <HTMLTableCellElement> utils.create("td");
				cell.innerHTML = list[i][j];
				row.appendChild(cell);
			}

			(function(index) {
				row.addEventListener("mouseenter", function() {
					let automatonRenderer = self.automatonRenderer;
					let edgeList = automatonRenderer.getEdgeList();
					let data = metadata[index];

					for (let edge of edgeList) {
						let originName = edge.getOrigin()!.getName();
						let targetName = edge.getTarget()!.getName();
						let sameOrigin = (originName == data[0]);
						let sameTarget = (targetName == data[1]);
						if (sameOrigin && sameTarget) {
							automatonRenderer.selectEdge(edge);
							break;
						}
					}
				});

				row.addEventListener("mouseleave", function() {
					// TODO
				});
			})(i);

			htmlTable.appendChild(row);
		}

		htmlTable.id = "transition_table";
		container.appendChild(htmlTable);
	}

	private automatonRenderer: AutomatonRenderer;
}
