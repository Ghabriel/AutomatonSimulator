import {english} from "./languages/English"
import {Renderer} from "./interface/Renderer"

export namespace Settings {
	export var sidebarID = "sidebar";
	export var mainbarID = "mainbar";

	export var slideInterval = 300;
	export var machineSelRows = 3;
	export var machineSelColumns = 1;

	export var stateLabelFontFamily = "sans-serif";
	export var stateLabelFontSize = 20;
	export var stateRadius = 32;
	export var stateRingRadius = 27;
	export var stateDragTolerance = 50;
	export var stateFillColor = "white";
	export var stateStrokeColor = "black";

	export enum Machine {
		FA, PDA, LBA
	}

	export var language = english;
	export var currentMachine = Machine.FA;

	export var machines = {};
	machines[Machine.FA] = {
		name: language.strings.FA
	};

	machines[Machine.PDA] = {
		name: language.strings.PDA
	};

	machines[Machine.LBA] = {
		name: language.strings.LBA
	};
}

export const Strings = Settings.language.strings;
