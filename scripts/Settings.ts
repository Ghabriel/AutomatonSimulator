import * as automata from "./lists/MachineList"
import * as controllers from "./lists/ControllerList"
import * as lang from "./lists/LanguageList"
import * as init from "./lists/InitializerList"

// import {Regex} from "./misc/Regex"
import {Controller} from "./Controller"
import {Initializable, Initializer} from "./Initializer"
import {StatePalette} from "./StatePalette"
import {utils} from "./Utils"

interface MachineTraits {
	name: string;
	abbreviatedName: string;
	sidebar: any[];
	controller: Controller;
	initializer: Initializable;
}

export namespace Settings {
	export const sidebarID = "sidebar";
	export const mainbarID = "mainbar";

	export const disabledButtonClass = "disabled";

	export const canvasShortcutID = "canvas";

	export var undoMaxAmount = 2;

	export const menuSlideInterval = 300;
	export const promptSlideInterval = 200;
	export const machineSelRows = 3;
	export const machineSelColumns = 1;
	export const machineActionRows = 3;
	export const machineActionColumns = 2;

	export const tapeDisplayedChars = 7; // should be odd

	export const multRecognitionAreaRows = 4;
	export const multRecognitionAreaCols = 15;

	export const stateRadius = 32;
	export const stateRingRadius = 27;
	export const stateDragTolerance = 50;
	export const stateFillColor = "white";
	export const stateStrokeColor = "black";
	export const stateStrokeWidth = 1;
	export const stateRingStrokeWidth = 1;

	export const stateLabelFontFamily = "arial";
	export const stateLabelFontSize = 20;
	export const stateLabelFontColor = "black";

	export const stateInitialMarkLength = 40;
	export const stateInitialMarkHeadLength = 15;
	export const stateInitialMarkAngle = utils.toRadians(20);
	export const stateInitialMarkColor = "blue";
	export const stateInitialMarkThickness = 2;

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

	export const edgeStrokeColor = "black";
	export const edgeHighlightColor = "red";

	export const edgeArrowThickness = 2;
	export const edgeArrowLength = 30;
	export const edgeArrowAngle = utils.toRadians(30);

	export const edgeTextFontFamily = "arial";
	export const edgeTextFontSize = 20;
	export const edgeTextFontColor = "black";

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
		step: ["N"], // "N"ext step
		stop: ["S"],
		multipleRecognition: ["M"],
	};

	export const languages = lang;

	export const Machine = automata.Machine;

	// TODO: maybe using a cookie to get the default language is a good idea
	export var language = lang.english;

	// The current machine being operated on. Defaults to the first machine
	// of the Machine enum (unless changed, that means FA)
	export var currentMachine = 0;

	export var machines: {[m: number]: MachineTraits} = {};

	export var controllerMap: {[m: number]: Controller} = {};
	export var initializerMap: {[m: number]: Initializable} = {};

	// export var sidebar: Sidebar = null;
	// export var automatonRenderer: AutomatonRenderer = null;
	export var sidebar = null;
	export var automatonRenderer = null;

	export function controller(): Controller {
		return this.machines[this.currentMachine].controller;
	}

	let firstUpdate = true;
	// TODO: check if we only need to instantiate the controllers once or
	// if it's needed everytime (like with the sidebar)
	export function update(): void {
		if (firstUpdate) {
			for (let index in Machine) {
				if (Machine.hasOwnProperty(index) && !isNaN(parseInt(index))) {
					controllerMap[index] = new controllers[Machine[index] + "Controller"]();
					initializerMap[index] = new init["init" + Machine[index]]();
				}
			}
		}

		let machineList: typeof machines = {};
		for (let index in Machine) {
			if (Machine.hasOwnProperty(index) && !isNaN(parseInt(index))) {
				// Stores the traits of this machine. Note that the
				// "sidebar" property is filled by the init* classes.
				machineList[index] = {
					name: language.strings[Machine[index]],
					abbreviatedName: Machine[index],
					sidebar: [],
					controller: controllerMap[index],
					initializer: initializerMap[index]
				};
			}
		}

		utils.foreach(machineList, function(key, value) {
			machines[key] = value;
			// if (firstUpdate) {
			// 	machines[key] = value;
			// } else {
			// 	machines[key].name = value.name;
			// }
		});

		Initializer.exec(initializerMap);

		if (firstUpdate) {
			machines[currentMachine].initializer.onEnter();
		}

		firstUpdate = false;
	}

	export function changeLanguage(newLanguage): void {
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
