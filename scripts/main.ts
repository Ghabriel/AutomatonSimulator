/// <reference path="jQuery.d.ts" />

import {Mainbar} from "./interface/Mainbar"
import {Settings} from "./Settings"
import {Sidebar} from "./interface/Sidebar"
import {UI} from "./interface/UI"

$(document).ready(function() {
	var ui = new UI(new Sidebar(), new Mainbar());
	ui.render();
});
