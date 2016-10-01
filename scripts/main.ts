/// <reference path="jQuery.d.ts" />

import {Settings} from "./Settings"
import {UI} from "./UI"

$(document).ready(function() {
	var ui = new UI(Settings.sidebarRenderer, Settings.mainbarRenderer);
	ui.render();
});
