/// <reference path="defs/jQuery.d.ts" />

import {Settings} from "./Settings"
import {System} from "./System"
import {UI} from "./interface/UI"
import {utils} from "./Utils"

/**
 * Given two paths, returns two substrings of them
 * starting at the point where they diverge.
 * Example:
 * 	divergence("a/b/css/styles.css", "a/b/scripts/main.js")
 * Returns:
 * 	["css/styles.css", "scripts/main.js"]
 */
function divergence(first: string, second: string): string[] {
	let i = 0;
	while (first[i] == second[i]) {
		i++;
	}

	return [
		first.substr(i),
		second.substr(i)
	];
}

/**
 * Given a file path, returns its directory name.
 * Note that this function expects a simple path of the form:
 * 	[folder name][directory separator][file name].[extension]
 * The actual directory separator is irrelevant as long as it
 * doesn't match the regular expression /[A-Za-z0-9]/ and has
 * a length equal to 1.
 *
 * Example:
 * 	dirname("css/styles.css")
 * Returns:
 * 	"css"
 * @param  {string} path The path of a file
 * @return {string} The name of the directory that contains the file.
 */
function dirname(path: string): string {
	function reverse(input: string): string {
		return input.split("").reverse().join("");
	}

	// Evaluate everything backwards to let the greedy
	// + operator match the entire filename.
	let matcher = /[A-Za-z]+\.[A-Za-z0-9]+(.*)/;
	let matches = reverse(path).match(matcher);
	if (matches === null) {
		return "";
	}
	return reverse(matches[1].substr(1));
}

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

		let sidebar = <HTMLDivElement> utils.id(Settings.sidebarID);
		sidebar.innerHTML = "";

		// Determine the new base resource path to fix
		// future dynamic images
		let linkTag = document.getElementsByTagName("link")[0];
		let scriptTag = document.getElementsByTagName("script")[0];

		let [linkPath, scriptPath] = divergence(linkTag.href, scriptTag.src);
		let libFolder = dirname(linkPath);
		let scriptFolder = dirname(scriptPath);
		console.log("[LIB]", libFolder);
		console.log("[SRC]", scriptFolder);
	}

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
