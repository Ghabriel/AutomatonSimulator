/// <reference path="jQuery.d.ts" />

import {Mainbar} from "./Mainbar"
import {Settings} from "./Settings"
import {Sidebar} from "./Sidebar"
import {UI} from "./UI"

$(document).ready(function() {
	var ui = new UI(new Sidebar(), new Mainbar());
	ui.render();
});
