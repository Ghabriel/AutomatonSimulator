/// <reference path="./defs/jQuery.d.ts" />

import {FATests} from "./tests/FAtests"
import {Test} from "./tests/Test"

console.log("hello");

$(document).ready(function() {
	console.log("world");
	let container = <HTMLDivElement> document.getElementById("container");
	let test = new Test(container);
	test.addTestPlan(new FATests());
	test.runTests();
});
