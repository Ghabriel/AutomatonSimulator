/// <reference path="../defs/filesaver.d.ts" />
/// <reference path="../defs/jQuery.d.ts" />

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

type SidebarMenus = {
	settings: Menu;
	fileManipulation: Menu;
	machineSelection: Menu;
	formalDefinition: Menu;
	selectedEntity: Menu;
	actionMenu: Menu;
	operationMenu: Menu;
}

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
				utils.id(Settings.sidebarID)!.innerHTML = "";
				self.build();
				self.render();
			}
		});

		System.addMachineChangeObserver({
			onMachineChange: function() {
				self.mainMenus.operationMenu.clearContent();
				self.buildOperationMenu();
				self.mainMenus.operationMenu.render();
			}
		})

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
			operationMenu: new Menu(Strings.OPERATIONS),
		};

		this.buildSettings();
		this.buildFileManipulation();
		this.buildSelectedEntityArea();
		this.buildMachineSelection();
		this.buildActionMenu();
		this.buildOperationMenu();

		// Hides some menus by default
		this.mainMenus.settings.toggle();
		this.mainMenus.operationMenu.toggle();

		this.contentWrapper = utils.create("div", {
			id: "sidebar_content"
		});

		// Re-binds all menus when the system language is changed
		if (this.node) {
			this.onBind();
		}
	}

	public receiveSignal(signal: Signal): SignalResponse|null {
		if (signal.targetID == Settings.sidebarSignalID) {
			let methodName = <keyof this> signal.identifier;
			let method = <Function> <any> this[methodName];

			return {
				reacted: true,
				response: method.apply(this, signal.data)
			};
		}

		return null;
	}

	// Sets the content of the "selected entity area".
	public setSelectedEntityContent(content: HTMLElement): void {
		let node = this.mainMenus.selectedEntity.content()!;
		$(node.querySelector(".none")!).hide();
		this.clearSelectedEntityArea();
		node.appendChild(content);
	}

	// Clears the "selected entity area" and shows the "none container".
	public unsetSelectedEntityContent(): void {
		let node = this.mainMenus.selectedEntity.content()!;
		this.clearSelectedEntityArea();
		$(node.querySelector(".none")!).show();
	}

	// Sets/clears the "formal definition area".
	public updateFormalDefinition(content?: HTMLElement): void {
		let node = this.mainMenus.formalDefinition.content()!;
		node.innerHTML = "";
		if (content) {
			node.appendChild(content);
		}
	}

	public changeMachineType(type: number): void {
		SignalEmitter.emitSignal({
			targetID: Settings.mainControllerSignalID,
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
		let contentWrapper = this.contentWrapper;

		if (contentWrapper.parentElement === null) {
			this.node.appendChild(contentWrapper);
		}

		this.foreachMenu(function(name, menu) {
			menu.bind(contentWrapper);
		});

		for (let menu of this.otherMenus) {
			menu.bind(contentWrapper);
		}
	}

	protected onRender(): void {
		this.foreachMenu(function(name, menu) {
			menu.render();
		});
		this.renderDynamicMenus();
	}

	private foreachMenu(callback: (name: string, menu: Menu) => void) {
		utils.foreach(this.mainMenus, function(name, menu) {
			callback(name, menu);
		});
	}

	// Clears the "selected entity area" except for the "none container".
	private clearSelectedEntityArea() {
		let node = this.mainMenus.selectedEntity.content()!;
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
		let settings: Menu = this.mainMenus.settings;
		settings.clear();

		let table = new Table(2);
		this.buildLanguageSelection(table);
		this.buildUndoMaxCountInput(table);
		settings.add(table.html());
	}

	private buildLanguageSelection(table: Table): void {
		let select = utils.create("select");
		let languages = Settings.languages;
		let languageTable: {[index: number]: string} = {};
		let i = 0;
		utils.foreach(languages, function(moduleName, obj) {
			// There might be an extra field called "__esModule",
			// we need to skip it
			if (!obj.strings) {
				return;
			}

			let option = utils.create("option");
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
			let index = parseInt(option.value);
			let name = option.innerHTML;
			let confirmation = confirm(Strings.CHANGE_LANGUAGE.replace("%", name));
			if (confirmation) {
				System.changeLanguage(languages[languageTable[index]]);
			}
		});

		table.add(utils.create("span", { innerHTML: Strings.SYSTEM_LANGUAGE + ":" }));
		table.add(select);
	}

	private buildUndoMaxCountInput(table: Table): void {
		let undoMaxAmountInput = utils.create("input", {
			className: "property_value",
			type: "text",
			value: Settings.undoMaxAmount
		});

		undoMaxAmountInput.addEventListener("blur", function() {
			let value: number;
			if (this.value.length > 3) {
				value = 999;
			} else {
				value = parseInt(this.value);
			}

			if (!isNaN(value)) {
				let originalMaxCount = Settings.undoMaxAmount;
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

		table.add(utils.create("span", { innerHTML: Strings.UNDO_MAX_COUNT + ":" }));
		table.add(undoMaxAmountInput);
	}

	private buildFileManipulation(): void {
		let fileManipulation = this.mainMenus.fileManipulation;
		fileManipulation.clear();
		let save = utils.create("input", {
			className: "file_manip_btn",
			type: "button",
			value: Strings.SAVE,
			click: function() {
				let content = SignalEmitter.emitSignal({
					targetID: Settings.mainControllerSignalID,
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


		let fileSelector = utils.create("input", {
			id: "file_selector",
			type: "file"
		});
		fileSelector.addEventListener("change", function(e) {
			let file = (<any> e.target).files[0];
			(<HTMLInputElement> this).value = "";
			if (file) {
				let reader = new FileReader();
				reader.onload = function(e) {
					SignalEmitter.emitSignal({
						targetID: Settings.mainControllerSignalID,
						identifier: "load",
						data: [(<any> e.target).result]
					});
				};
				reader.readAsText(file);
			}
		});
		// TODO: do we need to append fileSelector to the DOM?
		// fileManipulation.add(fileSelector);

		let open = utils.create("input", {
			className: "file_manip_btn",
			type: "button",
			value: Strings.OPEN,
			click: function(this: HTMLInputElement) {
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
		let none = utils.create("span", {
			className: "none",
			innerHTML: Strings.NO_SELECTED_ENTITY
		});
		this.mainMenus.selectedEntity.add(none);
	}

	private buildMachineSelection(): void {
		let table = new Table(Settings.machineSelectionColumns);
		let self = this;
		utils.foreach(Settings.machines, function(typeString, props) {
			let type = parseInt(typeString);

			let button = utils.create("input");
			button.classList.add("machine_selection_btn");
			button.type = "button";
			button.value = props.name;
			button.disabled = (type == Settings.currentMachine);
			button.addEventListener("click", function() {
				let empty = SignalEmitter.emitSignal({
					targetID: Settings.mainControllerSignalID,
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
		let createState = utils.create("input", {
			title: Strings.CREATE_STATE_INSTRUCTIONS,
			type: "button",
			value: Strings.CREATE_STATE,
			click: function() {
				SignalEmitter.emitSignal({
					targetID: Settings.mainControllerSignalID,
					identifier: "stateManualCreation",
					data: []
				});
			}
		});
		table.add(createState);

		let createEdge = utils.create("input", {
			title: Strings.CREATE_EDGE_INSTRUCTIONS,
			type: "button",
			value: Strings.CREATE_EDGE,
			click: function() {
				SignalEmitter.emitSignal({
					targetID: Settings.mainControllerSignalID,
					identifier: "edgeManualCreation",
					data: []
				});
			}
		});
		table.add(createEdge);

		let undo = utils.create("input", {
			title: utils.printShortcut(Settings.shortcuts.undo),
			type: "button",
			value: Strings.UNDO,
			click: function() {
				System.emitKeyEvent(Settings.shortcuts.undo);
			}
		});
		table.add(undo);

		let redo = utils.create("input", {
			title: utils.printShortcut(Settings.shortcuts.redo),
			type: "button",
			value: Strings.REDO,
			click: function() {
				System.emitKeyEvent(Settings.shortcuts.redo);
			}
		});
		table.add(redo);

		let clearMachine = utils.create("input", {
			title: utils.printShortcut(Settings.shortcuts.clearMachine),
			type: "button",
			value: Strings.CLEAR_MACHINE,
			click: function() {
				System.emitKeyEvent(Settings.shortcuts.clearMachine);
			}
		});
		table.add(clearMachine, 2);

		let tableElement = table.html();
		tableElement.id = "machine_actions";

		this.mainMenus.actionMenu.add(tableElement);
	}

	private buildOperationMenu(): void {
		let table = new Table(1);
		let controller = Settings.controller();
		let operations = Settings.supportedOperations();

		let hasOperations: boolean = false;
		utils.foreach(operations, function(name, operation) {
			hasOperations = true;

			let button = utils.create("input", {
				type: "button",
				value: Strings[<keyof typeof Strings> name.toUpperCase()],
				click: function() {
					controller.applyOperation(operation);
				}
			});

			table.add(button);
		});

		if (!hasOperations) {
			let none = utils.create("span", {
				className: "none",
				innerHTML: Strings.NO_OPERATIONS
			});

			this.mainMenus.operationMenu.add(none);
			return;
		}

		let tableElement = table.html();
		tableElement.id = "operation_list";
		this.mainMenus.operationMenu.add(tableElement);
	}

	private contentWrapper: HTMLDivElement;
	private mainMenus: SidebarMenus;
	private otherMenus: Menu[] = [];
	private machineButtonMapping: {[type: number]: HTMLInputElement} = {};
}
