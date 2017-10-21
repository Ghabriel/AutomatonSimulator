import {UIEdge} from "./UIEdge"
import {Settings, Strings} from "../Settings"
import {Table} from "./Table"
import {utils} from "../Utils"

export const edgeInfoPrinter = <T extends State>(edge: Edge<T>,
	selectedIndex: number) => {

	let container = utils.create("div");

	let changeOriginButton = utils.create("input", {
		type: "button",
		value: Strings.CHANGE_PROPERTY
	});

	let changeTargetButton = utils.create("input", {
		type: "button",
		value: Strings.CHANGE_PROPERTY
	});

	let changeTransitionButton = utils.create("input", {
		type: "button",
		value: Strings.CHANGE_PROPERTY
	});

	let deleteTransitionButton = utils.create("input", {
		type: "button",
		value: Strings.DELETE_SELECTED_TRANSITION
	});

	let deleteAllButton = utils.create("input", {
		title: utils.printShortcut(Settings.shortcuts.deleteEntity),
		type: "button",
		value: Strings.DELETE_ALL_TRANSITIONS
	});

	let textSelector = utils.create("select", {
		id: "entity_transition_list"
	});
	let textList = edge.textList;
	let i = 0;
	for (let text of textList) {
		let option = utils.create("option", { value: i, innerHTML: text });
		textSelector.appendChild(option);
		i++;
	}
	textSelector.selectedIndex = selectedIndex;

	let table = new Table(3);
	table.add(utils.span(Strings.ORIGIN + ":"));
	table.add(utils.create("span", {
		innerHTML: utils.sanitize(edge.origin.name),
		className: "property_value",
		id: "entity_origin"
	}));
	table.add(changeOriginButton);

	table.add(utils.span(Strings.TARGET + ":"));
	table.add(utils.create("span", {
		innerHTML: utils.sanitize(edge.target.name),
		className: "property_value",
		id: "entity_target"
	}));
	table.add(changeTargetButton);

	table.add(utils.span(Strings.TRANSITIONS + ":"));
	table.add(textSelector);
	table.add(changeTransitionButton);

	table.add(deleteTransitionButton, 3);

	table.add(deleteAllButton, 3);

	container.appendChild(table.html());

	return {
		container,
		changeOriginButton,
		changeTargetButton,
		changeTransitionButton,
		deleteTransitionButton,
		deleteAllButton
	};
};
