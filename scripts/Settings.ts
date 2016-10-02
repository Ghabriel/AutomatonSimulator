import {english} from "./languages/English"
import {Renderer} from "./Renderer"

export namespace Settings {
	export var sidebarID = "sidebar";
	export var mainbarID = "mainbar";

	export var language = english;
}

export const Strings = Settings.language.strings;
