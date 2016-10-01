import {Mainbar} from "./Mainbar"
import {Renderer} from "./Renderer"
import {Sidebar} from "./Sidebar"

export namespace Settings {
	export var sidebarRenderer: Renderer = new Sidebar();
	export var mainbarRenderer: Renderer = new Mainbar();

	export var sidebarID = "sidebar";
	export var mainbarID = "mainbar";
}
