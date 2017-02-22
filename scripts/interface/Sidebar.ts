/// <reference path="../defs/filesaver.d.ts" />

import * as automata from "../lists/MachineList"
import {Menu} from "./Menu"
import {Renderer} from "./Renderer"
import {Settings} from "../Settings"
import {Strings} from "../Settings"
import {System} from "../System"
import {Table} from "./Table"
import {utils} from "../Utils"

// TODO: remake pretty much this entire class (except the internationalization
// part, which works well). It's a very new class which already has some weird
// bugs and does not seem efficient at all.
// (pretty sure I already remade this?)
export class Sidebar extends Renderer {
	constructor() {
		super();
		this.build();
	}

	public build(): void {
		this.languageSelection = new Menu(Strings.SELECT_LANGUAGE);
		this.fileManipulation = new Menu(Strings.FILE_MENUBAR);
		this.machineSelection = new Menu(Strings.SELECT_MACHINE);
		this.otherMenus = [];

		this.buildLanguageSelection();
		this.buildFileManipulation();
		this.buildMachineSelection();

		if (this.node) {
			this.onBind();
		}
	}

	protected onBind(): void {
		this.languageSelection.bind(this.node);
		this.fileManipulation.bind(this.node);
		this.machineSelection.bind(this.node);
		for (let menu of this.otherMenus) {
			menu.bind(this.node);
		}
	}

	protected onRender(): void {
		this.languageSelection.render();
		this.fileManipulation.render();
		this.machineSelection.render();
		this.renderDynamicMenus();
	}

	private renderDynamicMenus(): void {
		for (let menu of this.otherMenus) {
			menu.render();
		}
	}

	private loadMachine(machine: automata.Machine): void {
		for (let menu of this.otherMenus) {
			$(menu.html()).remove();
		}

		this.otherMenus = Settings.machines[machine].sidebar;
		for (let menu of this.otherMenus) {
			menu.bind(this.node);
		}
	}

	private buildLanguageSelection(): void {
		let select = <HTMLSelectElement> utils.create("select");
		let languages = Settings.languages;
		let languageTable = {};
		let i = 0;
		utils.foreach(languages, function(moduleName, obj) {
			let option = <HTMLOptionElement> utils.create("option");
			option.value = i.toString();
			option.innerHTML = obj.strings.LANGUAGE_NAME;
			select.appendChild(option);
			languageTable[i] = moduleName;
			if (obj == Settings.language) {
				select.selectedIndex = i;
			}
			i++;
		});
		this.languageSelection.clear();
		this.languageSelection.add(select);
		this.languageSelection.toggle();

		select.addEventListener("change", function(e) {
			let option = this.options[this.selectedIndex];
			let index = option.value;
			let name = option.innerHTML;
			let confirmation = confirm(Strings.CHANGE_LANGUAGE.replace("%", name));
			if (confirmation) {
				System.changeLanguage(languages[languageTable[index]]);
			}
		});
	}

	private buildFileManipulation(): void {
		this.fileManipulation.clear();
		let save = <HTMLInputElement> utils.create("input");
		save.classList.add("file_manip_btn");
		save.type = "button";
		save.value = Strings.SAVE;
		save.addEventListener("click", function() {
			// TODO
		    let content = "Hello, world!";
		    let blob = new Blob([content], {type: "text/plain; charset=utf-8"});
		    saveAs(blob, "file.txt");
		});
		utils.bindShortcut(Settings.shortcuts.save, function() {
			save.click();
		});
		this.fileManipulation.add(save);

		let open = <HTMLInputElement> utils.create("input");
		open.classList.add("file_manip_btn");
		open.type = "button";
		open.value = Strings.OPEN;
		open.addEventListener("click", function() {
			// TODO
			alert("Not yet implemented");
		});
		utils.bindShortcut(Settings.shortcuts.open, function() {
			open.click();
		});
		this.fileManipulation.add(open);
	}

	private buildMachineSelection(): void {
		let table = new Table(Settings.machineSelRows, Settings.machineSelColumns);
		let machineButtonMapping = {};
		let self = this;
		utils.foreach(Settings.machines, function(type, props) {
			let button = <HTMLInputElement> utils.create("input");
			button.classList.add("machine_selection_btn");
			button.type = "button";
			button.value = props.name;
			button.disabled = (type == Settings.currentMachine);
			button.addEventListener("click", function() {
				machineButtonMapping[Settings.currentMachine].disabled = false;
				machineButtonMapping[type].disabled = true;
				// Firefox ignores keyboard events triggered while focusing
				// a disabled input, so blur it.
				machineButtonMapping[type].blur();
				Settings.currentMachine = type;
				self.loadMachine(type);
				self.renderDynamicMenus();
			});
			table.add(button);
			machineButtonMapping[type] = button;
		});

		utils.bindShortcut(["M"], function() {
			let buttons = document.querySelectorAll(".machine_selection_btn");
			for (let i = 0; i < buttons.length; i++) {
				let button = <HTMLInputElement> buttons[i];
				if (!button.disabled) {
					button.focus();
					break;
				}
			}
		});

		this.machineSelection.clear();
		this.machineSelection.add(table.html());
		this.loadMachine(Settings.currentMachine);
	}

	private languageSelection: Menu;
	private fileManipulation: Menu;
	private machineSelection: Menu;
	private otherMenus: Menu[];
}
