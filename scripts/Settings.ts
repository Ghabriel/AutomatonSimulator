import * as automata from "./lists/MachineList"
import * as controllers from "./lists/ControllerList"
import * as lang from "./lists/LanguageList"
import * as init from "./lists/InitializerList"

// import {Regex} from "./misc/Regex"
import {Controller} from "./Controller"
import {Initializable, Initializer} from "./Initializer"
import {StatePalette, EdgePalette} from "./Palette"
import {utils} from "./Utils"

interface MachineTraits {
	name: string;
	abbreviatedName: string;
	sidebar: any[];
	controller: Controller;
	initializer: Initializable;
}

/**
 * Encapsulates the constants used by the application and
 * other configurable variables (notably, the current language
 * and the current machine).
 */
export namespace Settings {
	export const sidebarID = "sidebar";
	export const mainbarID = "mainbar";

	export const sidebarSignalID = "sidebar";
	export const automatonRendererSignalID = "automatonRenderer";

	export const disabledButtonClass = "disabled";

	export const canvasShortcutID = "canvas";

	export var undoMaxAmount = 2;

	export const menuSlideInterval = 300;
	export const promptSlideHideInterval = 100;
	export const promptSlideShowInterval = 200;
	export const machineSelectionColumns = 1;
	export const machineActionColumns = 2;

	export const tapeDisplayedChars = 7; // should be odd

	export const multRecognitionAreaRows = 8;
	export const multRecognitionAreaCols = 15;

	export const stateRadius = 32;
	export const stateRingRadius = 27;
	export const stateDragTolerance = 50;

	export const stateLabelFontFamily = "arial";
	export const stateLabelFontSize = 20;
	export const stateLabelFontColor = "black";

	export const stateInitialMarkLength = 40;
	export const stateInitialMarkHeadLength = 15;
	export const stateInitialMarkAngle = utils.toRadians(20);
	export const stateInitialMarkColor = "blue";
	export const stateInitialMarkThickness = 2;

	export const stateDefaultPalette: StatePalette = {
		fillColor: "white",
		strokeColor: "black",
		strokeWidth: 1,
		ringStrokeWidth: 1
	};

	export const stateHighlightPalette: StatePalette = {
		fillColor: "#FFD574",
		strokeColor: "red",
		strokeWidth: 3,
		ringStrokeWidth: 2
	};

	export const stateRecognitionPalette: StatePalette = {
		fillColor: "#CCC",
		strokeColor: "black",
		strokeWidth: 3,
		ringStrokeWidth: 2
	};

	export const edgeDefaultPalette: EdgePalette = {
		strokeColor: "black",
		arrowThickness: 2,
		arrowLength: 30,
		arrowAngle: utils.toRadians(30),
		textFontFamily: "arial",
		textFontSize: 20,
		textFontColor: "black"
	};

	export const edgeHighlightPalette: EdgePalette = {
		strokeColor: "red",
		arrowThickness: edgeDefaultPalette.arrowThickness,
		arrowLength: edgeDefaultPalette.arrowLength,
		arrowAngle: edgeDefaultPalette.arrowAngle,
		textFontFamily: edgeDefaultPalette.textFontFamily,
		textFontSize: edgeDefaultPalette.textFontSize,
		textFontColor: edgeDefaultPalette.textFontColor
	};

	export const edgeFormalDefinitionHoverPalette: EdgePalette = {
		strokeColor: "blue",
		arrowThickness: 3,
		arrowLength: edgeDefaultPalette.arrowLength,
		arrowAngle: edgeDefaultPalette.arrowAngle,
		textFontFamily: edgeDefaultPalette.textFontFamily,
		textFontSize: edgeDefaultPalette.textFontSize,
		textFontColor: edgeDefaultPalette.textFontColor
	};

	export const acceptedTestCaseColor = "green";
	export const rejectedTestCaseColor = "red";

	export const shortcuts = {
		// File-related controls
		save: ["ctrl", "S"],
		open: ["ctrl", "O"],
		// Automaton-related controls
		toggleInitial: ["I"],
		toggleFinal: ["F"],
		dimSelection: ["ESC"],
		deleteEntity: ["DELETE"],
		clearMachine: ["C"],
		left: ["LEFT"],
		right: ["RIGHT"],
		up: ["UP"],
		down: ["DOWN"],
		undo: ["ctrl", "Z"],
		redo: ["ctrl", "Y"],
		// Recognition-related controls
		focusTestCase: ["ctrl", "I"],
		dimTestCase: ["ENTER"], // must be unitary since it's not bound via bindShortcut
		fastForward: ["R"], // "R"ecognize (is there a better alternative?)
		step: ["ENTER"],
		stop: ["ESC"],
	};

	export const languages: {[moduleName: string]: any} = lang;

	export const Machine = automata.Machine;

	// TODO: maybe using a cookie to get the default language is a good idea
	export var language = lang.english;

	export type Language = typeof language;
	type LanguageLabel = keyof typeof language.strings;

	// The current machine being operated on. Defaults to the first machine
	// of the Machine enum (unless changed, that means FA)
	export var currentMachine = 0;

	export var machines: {[m: number]: MachineTraits} = {};

	export var controllerMap: {[m: number]: Controller} = {};
	export var initializerMap: {[m: number]: Initializable} = {};

	// Helper method to get the current controller
	export function controller(): Controller {
		return machines[currentMachine].controller;
	}

	function getController(name: string): Controller {
		return new (<any> controllers)[name + "Controller"]();
	}

	function getInitializable(name: string): Initializable {
		return new (<any> init)["init" + name]();
	}

	let firstUpdate = true;
	export function update(): void {
		if (firstUpdate) {
			for (let index in Machine) {
				if (Machine.hasOwnProperty(index) && !isNaN(parseInt(index))) {
					// controllerMap[index] = new controllers[Machine[index] + "Controller"]();
					// initializerMap[index] = new init["init" + Machine[index]]();
					controllerMap[index] = getController(Machine[index]);
					initializerMap[index] = getInitializable(Machine[index]);
				}
			}
		}

		let machineList: typeof machines = {};
		for (let index in Machine) {
			if (Machine.hasOwnProperty(index) && !isNaN(parseInt(index))) {
				// Stores the traits of this machine. Note that the
				// "sidebar" property is filled by the init* classes.
				machineList[index] = {
					name: language.strings[<LanguageLabel> Machine[index]],
					abbreviatedName: Machine[index],
					sidebar: [],
					controller: controllerMap[index],
					initializer: initializerMap[index]
				};
			}
		}

		utils.foreach(machineList, function(key, value) {
			machines[parseInt(key)] = value;
		});

		Initializer.exec(initializerMap);

		if (firstUpdate) {
			machines[currentMachine].initializer.onEnter();
		}

		firstUpdate = false;
	}

	export function changeLanguage(newLanguage: Language): void {
		language = newLanguage;
		Strings = language.strings;
		update();
	}

	export function changeMachine(machineIndex: number): void {
		machines[currentMachine].initializer.onExit();
		currentMachine = machineIndex;
		machines[currentMachine].initializer.onEnter();
	}
}

export var Strings = Settings.language.strings;

// Settings.update();
// Initializer.exec();
