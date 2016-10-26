import {english} from "./languages/English"
import {portuguese} from "./languages/Portuguese"

import {Initializer} from "./Initializer"
import {Renderer} from "./interface/Renderer"
import {utils} from "./Utils"

interface MachineTraits {
	name: string;
	sidebar: any[];
}

export namespace Settings {
	export const sidebarID = "sidebar";
	export const mainbarID = "mainbar";

	export const slideInterval = 300;
	export const machineSelRows = 3;
	export const machineSelColumns = 1;

	export const stateLabelFontFamily = "sans-serif";
	export const stateLabelFontSize = 20;
	export const stateRadius = 32;
	export const stateRingRadius = 27;
	export const stateDragTolerance = 50;
	export const stateFillColor = "white";
	export const stateStrokeColor = "black";

	export const shortcuts = {
		save: ["ctrl", "s"],
		open: ["ctrl", "o"]
	};

	export const languages = {
		"English": english,
		"Português": portuguese
	};

	export enum Machine {
		FA, PDA, LBA
	}

	export var language = english;
	export var currentMachine = Machine.FA;

	export var machines: {[m: number]: MachineTraits} = {};

	let firstUpdate = true;
	export function update() {
		let machineList: typeof machines = {};
		machineList[Machine.FA] = {
			name: language.strings.FA,
			sidebar: []
		};

		machineList[Machine.PDA] = {
			name: language.strings.PDA,
			sidebar: []
		};

		machineList[Machine.LBA] = {
			name: language.strings.LBA,
			sidebar: []
		};

		utils.foreach(machineList, function(key, value) {
			if (firstUpdate) {
				machines[key] = value;
			} else {
				machines[key].name = value.name;
			}
		});

		firstUpdate = false;
	}

	export function changeLanguage(newLanguage): void {
		language = newLanguage;
		Strings = language.strings;
		update();
	}
}

export var Strings = Settings.language.strings;

Settings.update();
Initializer.exec();
