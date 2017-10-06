import {UIState} from "./UIState"
import {Strings} from "../Settings"
import {Table} from "./Table"
import {utils} from "../Utils"

export const stateInfoPrinter = (state: State) => {
	let container = utils.create("div");

	let renameButton = utils.create("input", {
		type: "button",
		value: Strings.RENAME_STATE
	});

	let toggleInitialButton = utils.create("input", {
		type: "button",
		value: Strings.TOGGLE_PROPERTY
	});

	let toggleFinalButton = utils.create("input", {
		type: "button",
		value: Strings.TOGGLE_PROPERTY
	});

	let deleteButton = utils.create("input", {
		type: "button",
		value: Strings.DELETE_STATE
	});

	let table = new Table(3);
	table.add(utils.create("span", { innerHTML: Strings.STATE_NAME + ":" }));
	table.add(utils.create("span", {
		innerHTML: state.name,
		className: "property_value",
		id: "entity_name"
	}));
	table.add(renameButton);

	table.add(utils.create("span", { innerHTML: Strings.STATE_IS_INITIAL + ":" }));
	table.add(utils.create("span", {
		innerHTML: state.initial ? Strings.YES : Strings.NO,
		className: "property_value",
		id: "entity_initial"
	}));
	table.add(toggleInitialButton);

	table.add(utils.create("span", { innerHTML: Strings.STATE_IS_FINAL + ":" }));
	table.add(utils.create("span", {
		innerHTML: state.final ? Strings.YES : Strings.NO,
		className: "property_value",
		id: "entity_final"
	}));
	table.add(toggleFinalButton);

	table.add(deleteButton, 3);

	container.appendChild(table.html());

	return {
		container,
		renameButton,
		toggleInitialButton,
		toggleFinalButton,
		deleteButton
	};
};
