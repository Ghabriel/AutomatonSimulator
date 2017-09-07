/// <reference path="../defs/filesaver.d.ts" />

import * as automata from "../lists/MachineList"
import {Keyboard} from "../Keyboard"
import {Menu} from "./Menu"
import {Renderer} from "./Renderer"
import {Settings} from "../Settings"
import {Strings} from "../Settings"
import {Signal, SignalEmitter, SignalResponse} from "../SignalEmitter"
import {System} from "../System"
import {Table} from "./Table"
import {utils} from "../Utils"

/**
 * Encapsulates the sidebar and all its behaviors.
 */
export class Sidebar extends Renderer {
	constructor() {
		super();
		this.build();

		let self = this;
		// Re-creates the sidebar when the system language is changed
		System.addLanguageChangeObserver({
			onLanguageChange: function() {
				utils.id(Settings.sidebarID).innerHTML = "";
				self.build();
				self.render();
			}
		});

		SignalEmitter.addSignalObserver(this);
	}

	// Constructs every menu that belongs to the sidebar.
	public build(): void {
		this.mainMenus = {
			settings: new Menu(Strings.SETTINGS),
			fileManipulation: new Menu(Strings.FILE_MENUBAR),
			machineSelection: new Menu(Strings.SELECT_MACHINE),
			formalDefinition: new Menu(Strings.FORMAL_DEFINITION),
			selectedEntity: new Menu(Strings.SELECTED_ENTITY),
			actionMenu: new Menu(Strings.ACTION_LIST),
		};

		this.buildSettings();
		this.buildFileManipulation();
		this.buildSelectedEntityArea();
		this.buildMachineSelection();
		this.buildActionMenu();

		this.contentWrapper = <HTMLDivElement> utils.create("div", {
			id: "sidebar_content"
		});

		// Re-binds all menus when the system language is changed
		if (this.node) {
			this.onBind();
		}
	}

	public receiveSignal(signal: Signal): SignalResponse|null {
		if (signal.targetID == Settings.sidebarSignalID) {
			return {
				reacted: true,
				response: this[signal.identifier].apply(this, signal.data)
			};
		}

		return null;
	}

	// Sets the content of the "selected entity area".
	public setSelectedEntityContent(content: HTMLElement): void {
		let node = this.mainMenus.selectedEntity.content();
		$(node.querySelector(".none")).hide();
		this.clearSelectedEntityArea();
		node.appendChild(content);
	}

	// Clears the "selected entity area" and shows the "none container".
	public unsetSelectedEntityContent(): void {
		let node = this.mainMenus.selectedEntity.content();
		this.clearSelectedEntityArea();
		$(node.querySelector(".none")).show();
	}

	// Sets/clears the "formal definition area".
	public updateFormalDefinition(content?: HTMLElement): void {
		let node = this.mainMenus.formalDefinition.content();
		node.innerHTML = "";
		if (content) {
			node.appendChild(content);
		}
	}

	public changeMachineType(type: number): void {
		SignalEmitter.emitSignal({
			targetID: Settings.automatonRendererSignalID,
			identifier: "clear",
			data: []
		});

		this.machineButtonMapping[Settings.currentMachine].disabled = false;
		this.machineButtonMapping[type].disabled = true;
		// Firefox ignores keyboard events triggered while focusing
		// a disabled input, so blur it.
		this.machineButtonMapping[type].blur();
		System.changeMachine(type);
		this.loadMachine(type);
		this.renderDynamicMenus();
	}

	protected onBind(): void {
		let self = this;

		if (this.contentWrapper.parentElement === null) {
			this.node.appendChild(this.contentWrapper);
		}

		utils.foreach(this.mainMenus, function(name, menu) {
			menu.bind(self.contentWrapper);
		});

		for (let menu of this.otherMenus) {
			menu.bind(this.contentWrapper);
		}
	}

	protected onRender(): void {
		utils.foreach(this.mainMenus, function(name, menu) {
			menu.render();
		});
		this.renderDynamicMenus();
	}

	// Clears the "selected entity area" except for the "none container".
	private clearSelectedEntityArea() {
		let node = this.mainMenus.selectedEntity.content();
		while (node.children.length > 1) {
			node.removeChild(node.children[node.children.length - 1]);
		}
	}

	private renderDynamicMenus(): void {
		for (let menu of this.otherMenus) {
			menu.render();
		}
	}

	private loadMachine(machine: automata.Machine): void {
		for (let menu of this.otherMenus) {
			let body = menu.html();
			if (body) {
				$(body).remove();
			}
		}

		this.otherMenus = Settings.machines[machine].sidebar;
		for (let menu of this.otherMenus) {
			menu.bind(this.contentWrapper);
		}
	}

	private buildSettings(): void {
		let settings = this.mainMenus.settings;
		settings.clear();

		let table = new Table(2);

		let undoMaxAmountInput = <HTMLInputElement> utils.create("input", {
			className: "property_value",
			type: "text",
			value: Settings.undoMaxAmount
		});

		let originalMaxCount;
		undoMaxAmountInput.addEventListener("focus", function() {
			originalMaxCount = this.value;
		});

		undoMaxAmountInput.addEventListener("blur", function() {
			let value = parseInt(this.value);
			if (!isNaN(value)) {
				let increasedMagnitude = (originalMaxCount >= 0 && value > originalMaxCount);
				let becameNegative = (originalMaxCount >= 0 && value < 0);

				let ok = (!increasedMagnitude && !becameNegative);
				ok = ok || (increasedMagnitude && confirm(Strings.MEMORY_CONSUMPTION_WARNING));
				ok = ok || (becameNegative && confirm(Strings.INFINITE_UNDO_WARNING));

				if (ok) {
					Settings.undoMaxAmount = value;
				}
				this.value = Settings.undoMaxAmount.toString();
			}
		});

		undoMaxAmountInput.addEventListener("keyup", function(e) {
			if (e.keyCode == Keyboard.keys.ENTER) {
				this.blur();
			}
		});

		this.buildLanguageSelection(table);
		table.add(utils.create("span", { innerHTML: Strings.UNDO_MAX_COUNT + ":" }));
		table.add(undoMaxAmountInput);
		settings.add(table.html());

		settings.toggle();
	}

	private buildLanguageSelection(table: Table): void {
		let select = <HTMLSelectElement> utils.create("select");
		let languages = Settings.languages;
		let languageTable = {};
		let i = 0;
		utils.foreach(languages, function(moduleName, obj) {
			// There might be an extra field called "__esModule",
			// we need to skip it
			if (!obj.strings) {
				return;
			}

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

		select.addEventListener("change", function(e) {
			let node = <HTMLSelectElement> this;
			let option = <HTMLOptionElement> node.options[node.selectedIndex];
			let index = option.value;
			let name = option.innerHTML;
			let confirmation = confirm(Strings.CHANGE_LANGUAGE.replace("%", name));
			if (confirmation) {
				System.changeLanguage(languages[languageTable[index]]);
			}
		});

		table.add(utils.create("span", { innerHTML: Strings.SYSTEM_LANGUAGE + ":" }));
		table.add(select);
	}

	private buildFileManipulation(): void {
		let fileManipulation = this.mainMenus.fileManipulation;
		fileManipulation.clear();
		let save = <HTMLInputElement> utils.create("input", {
			className: "file_manip_btn",
			type: "button",
			value: Strings.SAVE,
			click: function() {
				let content = SignalEmitter.emitSignal({
					targetID: Settings.automatonRendererSignalID,
					identifier: "save",
					data: []
				});

				let blob = new Blob([content], {type: "text/plain; charset=utf-8"});
				saveAs(blob, "file.txt");
			}
		});
		System.bindShortcut(Settings.shortcuts.save, function() {
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
					SignalEmitter.emitSignal({
						targetID: Settings.automatonRendererSignalID,
						identifier: "load",
						data: [(<any> e.target).result]
					});
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
		System.bindShortcut(Settings.shortcuts.open, function() {
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
		let table = new Table(Settings.machineSelectionColumns);
		let self = this;
		utils.foreach(Settings.machines, function(type, props) {
			let button = <HTMLInputElement> utils.create("input");
			button.classList.add("machine_selection_btn");
			button.type = "button";
			button.value = props.name;
			button.disabled = (type == Settings.currentMachine);
			button.addEventListener("click", function() {
				let empty = SignalEmitter.emitSignal({
					targetID: Settings.automatonRendererSignalID,
					identifier: "empty",
					data: []
				});

				if (empty || confirm(Strings.CHANGE_MACHINE_WARNING)) {
					self.changeMachineType(type);
				}
			});
			table.add(button);
			self.machineButtonMapping[type] = button;
		});

		System.bindShortcut(["M"], function() {
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
		let table = new Table(Settings.machineActionColumns);
		let createState = <HTMLInputElement> utils.create("input", {
			title: Strings.CREATE_STATE_INSTRUCTIONS,
			type: "button",
			value: Strings.CREATE_STATE,
			click: function() {
				SignalEmitter.emitSignal({
					targetID: Settings.automatonRendererSignalID,
					identifier: "stateManualCreation",
					data: []
				});
			}
		});
		table.add(createState);

		let createEdge = <HTMLInputElement> utils.create("input", {
			title: Strings.CREATE_EDGE_INSTRUCTIONS,
			type: "button",
			value: Strings.CREATE_EDGE,
			click: function() {
				SignalEmitter.emitSignal({
					targetID: Settings.automatonRendererSignalID,
					identifier: "edgeManualCreation",
					data: []
				});
			}
		});
		table.add(createEdge);

		let undo = <HTMLInputElement> utils.create("input", {
			title: utils.printShortcut(Settings.shortcuts.undo),
			type: "button",
			value: Strings.UNDO,
			click: function() {
				System.emitKeyEvent(Settings.shortcuts.undo);
			}
		});
		table.add(undo);

		let redo = <HTMLInputElement> utils.create("input", {
			title: utils.printShortcut(Settings.shortcuts.redo),
			type: "button",
			value: Strings.REDO,
			click: function() {
				System.emitKeyEvent(Settings.shortcuts.redo);
			}
		});
		table.add(redo);

		let clearMachine = <HTMLInputElement> utils.create("input", {
			title: utils.printShortcut(Settings.shortcuts.clearMachine),
			type: "button",
			value: Strings.CLEAR_MACHINE,
			click: function() {
				System.emitKeyEvent(Settings.shortcuts.clearMachine);
			}
		});
		table.add(clearMachine, 2);

		let actionMenu = this.mainMenus.actionMenu;
		let tableElement = table.html();
		tableElement.id = "machine_actions";
		actionMenu.add(tableElement);
	}

	private contentWrapper: HTMLDivElement;
	private mainMenus;
	private otherMenus: Menu[] = [];
	private machineButtonMapping: {[type: number]: HTMLInputElement} = {};
}
