/// <reference path="defs/jQuery.d.ts" />

import {System} from "./System"
import {UI} from "./interface/UI"

$(document).ready(function() {
	let ui = new UI();
	ui.render();

	document.body.addEventListener("keydown", function(e) {
		return System.keyEvent(e);
	});
});
