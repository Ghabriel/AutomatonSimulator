/// <reference path="defs/jQuery.d.ts" />

import {Mainbar} from "./interface/Mainbar"
import {Settings} from "./Settings"
import {Sidebar} from "./interface/Sidebar"
import {System} from "./System"
import {UI} from "./interface/UI"

$(document).ready(function() {
	var ui = new UI(new Sidebar(), new Mainbar());
	ui.render();

	document.body.addEventListener("keyup", function(e) {
		return System.keyEvent(e);
	});
});
