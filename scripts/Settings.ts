import {english} from "./languages/English"
import {Initializer} from "./Initializer"
import {Renderer} from "./interface/Renderer"

interface MachineTraits {
	name: string;
	sidebar: any[];
}

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

	export var machines: {[m: number]: MachineTraits} = {};
	machines[Machine.FA] = {
		name: language.strings.FA,
		sidebar: []
	};

	machines[Machine.PDA] = {
		name: language.strings.PDA,
		sidebar: []
	};

	machines[Machine.LBA] = {
		name: language.strings.LBA,
		sidebar: []
	};
}

export const Strings = Settings.language.strings;

Initializer.exec();
