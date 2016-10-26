/// <reference path="defs/jQuery.d.ts" />

import {Mainbar} from "./interface/Mainbar"
import {Settings} from "./Settings"
import {Sidebar} from "./interface/Sidebar"
import {System} from "./System"
import {UI} from "./interface/UI"

$(document).ready(function() {
	let sidebar = new Sidebar();
	let mainbar = new Mainbar();
	let ui = new UI(sidebar, mainbar);
	ui.render();

	System.bindSidebar(sidebar);

	document.body.addEventListener("keydown", function(e) {
		return System.keyEvent(e);
	});
});
