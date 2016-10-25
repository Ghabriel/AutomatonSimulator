/// <reference path="../defs/filesaver.d.ts" />

import {Menu} from "./Menu"
import {Renderer} from "./Renderer"
import {Settings} from "../Settings"
import {Strings} from "../Settings"
import {Table} from "./Table"
import {utils} from "../Utils"

export class Sidebar extends Renderer {
	constructor() {
		super();
		this.languageSelection = new Menu(Strings.SELECT_LANGUAGE);
		this.fileManipulation = new Menu(Strings.FILE_MENUBAR);
		this.machineSelection = new Menu(Strings.SELECT_MACHINE);
		this.otherMenus = [];
		this.build();
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
		for (let menu of this.otherMenus) {
			menu.render();
		}
	}

	private build(): void {
		this.buildLanguageSelection();
		this.buildFileManipulation();
		this.buildMachineSelection();
	}

	private loadMachine(machine: Settings.Machine): void {
		for (let menu of this.otherMenus) {
			$(menu.html()).remove();
		}

		this.otherMenus = Settings.machines[machine].sidebar;
		for (let menu of this.otherMenus) {
			menu.bind(this.node);
			menu.render();
		}
	}

	private buildLanguageSelection(): void {
		let select = <HTMLSelectElement> utils.create("select");
		// TODO: make this more flexible
		let languages = ["English", "Portuguese"];
		for (let i = 0; i < languages.length; i++) {
			let language = languages[i];
			let option = <HTMLOptionElement> utils.create("option");
			option.value = i + "";
			option.innerHTML = language;
			select.appendChild(option);
		}
		this.languageSelection.add(select);
		this.languageSelection.toggle();

		select.addEventListener("change", function(e) {
			let index = this.options[this.selectedIndex].value;
			let language = languages[index];
			let confirmation = confirm("Change the language to " + language + "?");
			if (confirmation) {
				// TODO
				alert("Not yet implemented.");
				// System.reload();
			}
		});
	}

	private buildFileManipulation(): void {
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
		// TODO: make this more flexible
		utils.bindShortcut(["ctrl"," "], function() {
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
				Settings.currentMachine = type;
				self.loadMachine(type);
			});
			table.add(button);
			machineButtonMapping[type] = button;
		});

		this.machineSelection.add(table.html());
		this.loadMachine(Settings.currentMachine);
	}

	private languageSelection: Menu;
	private fileManipulation: Menu;
	private machineSelection: Menu;
	private otherMenus: Menu[];
}
