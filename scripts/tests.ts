import {FATests} from "./tests/FATests"
import {PDATests} from "./tests/PDATests"
import {Test} from "./tests/Test"

$(document).ready(function() {
	let container = <HTMLDivElement> document.getElementById("container");
	let test = new Test(container);
	test.addTestPlan(new FATests());
	test.addTestPlan(new PDATests());
	test.runTests();
});
