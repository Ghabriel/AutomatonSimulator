/// <reference path="defs/jQuery.d.ts" />

import {Settings} from "./Settings"
import {System} from "./System"
import {UI} from "./interface/UI"

// Allows the Settings to trigger the machine initializers.
// This can't be in the Settings file itself because then
// the initializers wouldn't have access to System (since it
// wouldn't be initialized yet). Also note that importing
// System in Settings wouldn't work either since the circular
// dependency would cause the update method to still be called
// before System is defined.
Settings.update();

$(document).ready(function() {
	let ui = new UI();
	ui.render();

	document.body.addEventListener("keydown", function(e) {
		// TODO: make this look better
		if (document.activeElement.tagName.toLowerCase() != "input") {
			return System.keyEvent(e);
		}
		return true;
	});
});
