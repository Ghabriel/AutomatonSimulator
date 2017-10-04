/// <reference path="defs/jQuery.d.ts" />

import {Settings} from "./Settings"
import {System} from "./System"
import {UI} from "./interface/UI"
import {utils} from "./Utils"

/**
 * The entry point of the application. Starts when the page
 * is completely loaded.
 */
$(document).ready(function() {
	let mainbar = <HTMLDivElement> utils.id(Settings.mainbarID);
	let mainbarIsAlreadyRendered = (mainbar.innerHTML.length != 0);
	if (mainbarIsAlreadyRendered) {
		// If the mainbar is already rendered, the user
		// probably downloaded this application and is running
		// it locally. In this case, trying to render the
		// interface normally would actually result in two
		// interfaces appearing, so it's necessary to remove
		// the saved one.
		mainbar.innerHTML = "";

		// Remove the sidebar as well
		let sidebar = <HTMLDivElement> utils.id(Settings.sidebarID);
		sidebar.innerHTML = "";

		// Determine the new base resource path to fix
		// future dynamic images. If .css and .js files are not
		// in the same directory, we assume that the overall
		// directory structure is preserved.
		let linkTag = document.getElementsByTagName("link")[0];
		let scriptTag = document.getElementsByTagName("script")[0];

		let [linkFullPath, scriptFullPath] = [linkTag.href, scriptTag.src];
		let [linkPath, scriptPath] = utils.divergence(linkFullPath, scriptFullPath);
		let cssFolder = utils.dirname(linkPath);
		let scriptFolder = utils.dirname(scriptPath);

		if (cssFolder === scriptFolder) {
			// The browser's save mechanism puts all resources
			// in the same folder.
			Settings.imageFolder = scriptFullPath.replace(scriptPath, "");
		}
	}

	// Allows the Settings to trigger the machine initializers.
	// This can't be in the Settings file itself because then
	// the initializers wouldn't have access to System (since it
	// wouldn't be initialized yet). Also note that importing
	// System in Settings wouldn't work either since the circular
	// dependency would cause the update method to still be called
	// before System is defined.
	Settings.update();

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
