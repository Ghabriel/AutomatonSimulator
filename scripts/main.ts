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

/**
 * The entry point of the application. Starts when the page
 * is completely loaded.
 */
$(document).ready(function() {
	let ui = new UI();
	ui.render();

	let resizeSidebar = function() {
		let pageHeight = $("body").height();
		let footerHeight = $("#footer").height();
		let contentHeight = pageHeight - footerHeight;
		$("#wrapper").css("height", contentHeight);
		$("#sidebar").css("height", contentHeight);
		$("#sidebar_content").css("max-height", contentHeight);
	};

	$(window).resize(resizeSidebar);
	resizeSidebar();

	document.body.addEventListener("keydown", function(e) {
		let activeElementTag = document.activeElement.tagName.toLowerCase();
		let inhibitors = ["input", "textarea"];
		if (inhibitors.indexOf(activeElementTag) == -1) {
			return System.keyEvent(e);
		}
		return true;
	});
});
