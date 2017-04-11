/// <reference path="../defs/filesaver.d.ts" />

import * as automata from "../lists/MachineList"
import {Menu} from "./Menu"
import {Renderer} from "./Renderer"
import {Settings} from "../Settings"
import {Strings} from "../Settings"
import {System} from "../System"
import {Table} from "./Table"
import {utils} from "../Utils"

export class Sidebar extends Renderer {
	constructor() {
		super();
		this.build();
	}

	public build(): void {
		this.mainMenus = {
			languageSelection: new Menu(Strings.SELECT_LANGUAGE),
			fileManipulation: new Menu(Strings.FILE_MENUBAR),
			selectedEntity: new Menu(Strings.SELECTED_ENTITY),
			machineSelection: new Menu(Strings.SELECT_MACHINE),
			actionMenu: new Menu(Strings.ACTION_LIST),
		};

		this.buildLanguageSelection();
		this.buildFileManipulation();
		this.buildSelectedEntityArea();
		this.buildMachineSelection();
		this.buildActionMenu();
		// this.loadMachine(Settings.currentMachine);

		// Re-binds all menus when the system language is changed
		if (this.node) {
			this.onBind();
		}
	}

	public setSelectedEntityContent(content: HTMLElement): void {
		let node = this.mainMenus.selectedEntity.content();
		$(node.querySelector(".none")).hide();
		node.appendChild(content);
	}

	public unsetSelectedEntityContent(): void {
		let node = this.mainMenus.selectedEntity.content();
		while (node.children.length > 1) {
			node.removeChild(node.children[node.children.length - 1]);
		}
		$(node.querySelector(".none")).show();
	}

	protected onBind(): void {
		let self = this;
		utils.foreach(this.mainMenus, function(name, menu) {
			menu.bind(self.node);
		});

		for (let menu of this.otherMenus) {
			menu.bind(this.node);
		}
		Settings.sidebar = this;
	}

	protected onRender(): void {
		utils.foreach(this.mainMenus, function(name, menu) {
			menu.render();
		});
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

		// TODO
		// console.log(Settings.machines[Settings.currentMachine].name);
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

		let languageSelection = this.mainMenus.languageSelection;
		languageSelection.clear();
		languageSelection.add(select);
		languageSelection.toggle();

		select.addEventListener("change", function(e) {
			let node = <HTMLSelectElement> this;
			let option = node.options[node.selectedIndex];
			let index = option.value;
			let name = option.innerHTML;
			let confirmation = confirm(Strings.CHANGE_LANGUAGE.replace("%", name));
			if (confirmation) {
				System.changeLanguage(languages[languageTable[index]]);
			}
		});
	}

	private buildFileManipulation(): void {
		let fileManipulation = this.mainMenus.fileManipulation;
		fileManipulation.clear();
		let save = <HTMLInputElement> utils.create("input", {
			className: "file_manip_btn",
			type: "button",
			value: Strings.SAVE,
			click: function() {
				let content = Settings.automatonRenderer.save();
				let blob = new Blob([content], {type: "text/plain; charset=utf-8"});
				saveAs(blob, "file.txt");
			}
		});
		utils.bindShortcut(Settings.shortcuts.save, function() {
			save.click();
		});
		fileManipulation.add(save);


		let fileSelector = <HTMLInputElement> utils.create("input", {
			id: "file_selector",
			type: "file"
		});
		fileSelector.addEventListener("change", function(e) {
			// TODO: change these <any> casts
			let file = (<any> e.target).files[0];
			(<HTMLInputElement> this).value = "";
			if (file) {
				let reader = new FileReader();
				reader.onload = function(e) {
					Settings.automatonRenderer.load((<any> e.target).result);
				};
				reader.readAsText(file);
			}
		});
		// TODO: do we need to append fileSelector to the DOM?
		// fileManipulation.add(fileSelector);


		let open = <HTMLInputElement> utils.create("input", {
			className: "file_manip_btn",
			type: "button",
			value: Strings.OPEN,
			click: function() {
				fileSelector.click();
				this.blur();
			}
		});
		utils.bindShortcut(Settings.shortcuts.open, function() {
			open.click();
		});
		fileManipulation.add(open);
	}

	private buildSelectedEntityArea(): void {
		let none = <HTMLSpanElement> utils.create("span", {
			className: "none",
			innerHTML: Strings.NO_SELECTED_ENTITY
		});
		this.mainMenus.selectedEntity.add(none);
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
				if (Settings.automatonRenderer.empty()
				 || confirm(Strings.CHANGE_MACHINE_WARNING)) {
					Settings.automatonRenderer.clear();

					machineButtonMapping[Settings.currentMachine].disabled = false;
					machineButtonMapping[type].disabled = true;
					// Firefox ignores keyboard events triggered while focusing
					// a disabled input, so blur it.
					machineButtonMapping[type].blur();
					Settings.currentMachine = type;
					self.loadMachine(type);
					self.renderDynamicMenus();
				}
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

		let machineSelection = this.mainMenus.machineSelection;
		machineSelection.clear();
		machineSelection.add(table.html());
		this.loadMachine(Settings.currentMachine);
	}

	private buildActionMenu(): void {
		let table = new Table(Settings.machineActionRows, Settings.machineActionColumns);
		let createState = <HTMLInputElement> utils.create("input", {
			title: Strings.CREATE_STATE_INSTRUCTIONS,
			type: "button",
			value: Strings.CREATE_STATE,
			click: function() {
				Settings.automatonRenderer.stateManualCreation();
			}
		});
		table.add(createState);

		let createEdge = <HTMLInputElement> utils.create("input", {
			title: Strings.CREATE_EDGE_INSTRUCTIONS,
			type: "button",
			value: Strings.CREATE_EDGE,
			click: function() {
				Settings.automatonRenderer.edgeManualCreation();
			}
		});
		table.add(createEdge);

		let clearMachine = <HTMLInputElement> utils.create("input", {
			title: utils.printShortcut(Settings.shortcuts.clearMachine),
			type: "button",
			value: Strings.CLEAR_MACHINE,
			click: function() {
				System.emitKeyEvent(Settings.shortcuts.clearMachine);
			}
		});
		table.add(clearMachine);

		let undo = <HTMLInputElement> utils.create("input", {
			title: utils.printShortcut(Settings.shortcuts.undo),
			type: "button",
			value: Strings.UNDO,
			click: function() {
				System.emitKeyEvent(Settings.shortcuts.undo);
			}
		});
		table.add(undo);

		let actionMenu = this.mainMenus.actionMenu;
		let tableElement = table.html();
		tableElement.id = "machine_actions";
		actionMenu.add(tableElement);
	}

	// private mainMenus = {
	// 	languageSelection: new Menu(Strings.SELECT_LANGUAGE),
	// 	fileManipulation: new Menu(Strings.FILE_MENUBAR),
	// 	selectedEntity: new Menu(Strings.SELECTED_ENTITY),
	// 	machineSelection: new Menu(Strings.SELECT_MACHINE),
	// 	actionMenu: new Menu("Actions"),
	// };
	private mainMenus;
	private otherMenus: Menu[] = [];
}
