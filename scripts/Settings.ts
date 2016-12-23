import * as lang from "./lists/LanguageList"
import * as automata from "./lists/MachineList"

import {FA} from "./machines/FA"
import {Initializer} from "./Initializer"
import {Renderer} from "./interface/Renderer"
import {utils} from "./Utils"

interface MachineTraits {
	name: string;
	sidebar: any[];
}

// TODO: make it more flexible to add/remove machine types. See how
// the internationalization was implemented for reference.
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

	export const edgeArrowLength = 30;
	export const edgeArrowAngle = 30;

	export const shortcuts = {
		save: ["ctrl", "S"],
		open: ["ctrl", "O"]
	};

	export const languages = lang;

	export const Machine = automata.Machine;

	// TODO: maybe using a cookie to get the default language is a good idea
	export var language = lang.english;
	export var currentMachine = Machine.FA;

	export var machines: {[m: number]: MachineTraits} = {};

	let firstUpdate = true;
	export function update() {
		let machineList: typeof machines = {};
		for (let index in Machine) {
			if (Machine.hasOwnProperty(index) && !isNaN(parseInt(index))) {
				machineList[index] = {
					name: language.strings[Machine[index]],
					sidebar: []
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

		firstUpdate = false;
		Initializer.exec();
	}

	export function changeLanguage(newLanguage): void {
		language = newLanguage;
		Strings = language.strings;
		update();
	}
}

export var Strings = Settings.language.strings;

Settings.update();
// Initializer.exec();
