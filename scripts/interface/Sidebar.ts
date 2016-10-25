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
		this.fileManipulation = new Menu(Strings.FILE_MENUBAR);
		this.machineSelection = new Menu(Strings.SELECT_MACHINE);
		this.otherMenus = [];
		this.build();
	}

	protected onBind(): void {
		this.fileManipulation.bind(this.node);
		this.machineSelection.bind(this.node);
		for (let menu of this.otherMenus) {
			menu.bind(this.node);
		}
	}

	protected onRender(): void {
		this.fileManipulation.render();
		this.machineSelection.render();
		for (let menu of this.otherMenus) {
			menu.render();
		}
	}

	private build(): void {
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

	private buildFileManipulation(): void {
		var save = <HTMLInputElement> utils.create("input");
		save.classList.add("file_manip_btn");
		save.type = "button";
		save.value = Strings.SAVE;
		save.addEventListener("click", function() {
			// TODO
		    var content = "Hello, world!";
		    var blob = new Blob([content], {type: "text/plain; charset=utf-8"});
		    saveAs(blob, "file.txt");
		});
		this.fileManipulation.add(save);

		var open = <HTMLInputElement> utils.create("input");
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
		var table = new Table(Settings.machineSelRows, Settings.machineSelColumns);
		var machineButtonMapping = {};
		var self = this;
		utils.foreach(Settings.machines, function(type, props) {
			var button = <HTMLInputElement> utils.create("input");
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

	private fileManipulation: Menu;
	private machineSelection: Menu;
	private otherMenus: Menu[];
}
