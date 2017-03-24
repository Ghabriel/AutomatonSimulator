import {Keyboard} from "../Keyboard"
import {Menu} from "../interface/Menu"
import {Settings, Strings} from "../Settings"
import {utils} from "../Utils"

export namespace initFA {
	export function init() {
		let menuList: Menu[] = [];

		let menu = new Menu(Strings.RECOGNITION);
		let rows: HTMLElement[][] = [];

		buildTestCaseInput(rows);
		buildRecognitionControls(rows);
		bindShortcuts();

		for (let row of rows) {
			let div = <HTMLDivElement> utils.create("div", {
				className: "row"
			});
			for (let node of row) {
				div.appendChild(node);
			}
			menu.add(div);
		}

		menuList.push(menu);

		Settings.machines[Settings.Machine.FA].sidebar = menuList;
	}

	let boundShortcuts = false;
	let testCaseInput: HTMLInputElement = null;
	let fastRecognition: HTMLImageElement = null;
	let stepRecognition: HTMLImageElement = null;
	let stopRecognition: HTMLImageElement = null;

	function testCase(): string {
		return testCaseInput.value;
	}

	function buildTestCaseInput(container: HTMLElement[][]): void {
		let input = <HTMLInputElement> utils.create("input", {
			type: "text",
			placeholder: Strings.TEST_CASE
		});
		container.push([input]);
		testCaseInput = input;
	}

	function highlightCurrentStates(): void {
		let states = Settings.controller().currentStates();
		Settings.automatonRenderer.recognitionHighlight(states);
	}

	function buildRecognitionControls(container: HTMLElement[][]): void {
		const disabledClass = Settings.disabledButtonClass;
		let fastForwardEnabled = true;
		let stepEnabled = true;
		let stopEnabled = false;

		fastRecognition = <HTMLImageElement> utils.create("img", {
			className: "image_button",
			src: "images/fastforward.svg",
			title: Strings.FAST_RECOGNITION
		});

		stopRecognition = <HTMLImageElement> utils.create("img", {
			className: "image_button " + disabledClass,
			src: "images/stop.svg",
			title: Strings.STOP_RECOGNITION
		});

		stepRecognition = <HTMLImageElement> utils.create("img", {
			className: "image_button",
			src: "images/play.svg",
			title: Strings.STEP_RECOGNITION
		});

		let fastForwardStatus = function(enabled) {
			fastForwardEnabled = enabled;
			fastRecognition.classList[enabled ? "remove" : "add"](disabledClass);
		};

		let stepStatus = function(enabled) {
			stepEnabled = enabled;
			stepRecognition.classList[enabled ? "remove" : "add"](disabledClass);
		};

		let stopStatus = function(enabled) {
			stopEnabled = enabled;
			stopRecognition.classList[enabled ? "remove" : "add"](disabledClass);
		};

		fastRecognition.addEventListener("click", function() {
			if (fastForwardEnabled) {
				let input = testCase();
				Settings.controller().fastForward(input);
				highlightCurrentStates();

				fastForwardStatus(false);
				stepStatus(false);
				stopStatus(true);
				testCaseInput.disabled = true;
			}
		});

		stopRecognition.addEventListener("click", function() {
			if (stopEnabled) {
				Settings.controller().stop();
				Settings.automatonRenderer.recognitionDim();

				fastForwardStatus(true);
				stepStatus(true);
				stopStatus(false);
				testCaseInput.disabled = false;
			}
		});

		stepRecognition.addEventListener("click", function() {
			if (stepEnabled) {
				fastForwardStatus(false);
				stopStatus(true);
				testCaseInput.disabled = true;

				let input = testCase();
				let controller = Settings.controller();
				if (!controller.finished(input)) {
					controller.step(input);
					highlightCurrentStates();
				}

				// restartEnabled = !restartEnabled;
				// let method = restartEnabled ? "remove" : "add";
				// restartRecognition.classList[method]("disabled");
			}
		});

		container.push([fastRecognition, stepRecognition,
						stopRecognition]);
	}

	function bindShortcuts(): void {
		// Avoids a problem where changing the system language would make
		// these shortcuts be rebound, which would effectively make them
		// trigger multiple times by one keystroke.
		if (!boundShortcuts) {
			utils.bindShortcut(Settings.shortcuts.focusTestCase, function() {
				testCaseInput.focus();
			});

			testCaseInput.addEventListener("keydown", function(e) {
				if (e.keyCode == Keyboard.keys[Settings.shortcuts.dimTestCase[0]]) {
					if (testCaseInput == document.activeElement) {
						testCaseInput.blur();
					}
				}
			});

			utils.bindShortcut(Settings.shortcuts.fastForward, function() {
				fastRecognition.click();
			});

			utils.bindShortcut(Settings.shortcuts.step, function() {
				stepRecognition.click();
			});

			utils.bindShortcut(Settings.shortcuts.stop, function() {
				stopRecognition.click();
			});

			boundShortcuts = true;
		}
	}
}
