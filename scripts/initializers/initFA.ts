import {Menu} from "../interface/Menu"
import {Settings, Strings} from "../Settings"
import {utils} from "../Utils"

export namespace initFA {
	export function init() {
		let menuList: Menu[] = [];

		let temp = new Menu(Strings.RECOGNITION);
		let input = <HTMLInputElement> utils.create("input", {
			type: "text",
			placeholder: Strings.TEST_CASE
		});
		temp.add(input);
		menuList.push(temp);

		Settings.machines[Settings.Machine.FA].sidebar = menuList;
	}
}
