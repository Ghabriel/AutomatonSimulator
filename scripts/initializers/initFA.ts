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
		buildRecognitionProgress(rows);
		bindRecognitionEvents();
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
	let progressContainer: HTMLDivElement = null;

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

		container.push([fastRecognition, stepRecognition,
						stopRecognition]);
	}

	function buildRecognitionProgress(container: HTMLElement[][]): void {
		progressContainer = <HTMLDivElement> utils.create("div", {
			id: "recognition_progress"
		});

		progressContainer.style.display = "none";

		container.push([progressContainer]);
	}

	function showAcceptanceStatus(): void {
		if (Settings.controller().accepts()) {
			progressContainer.style.color = Settings.acceptedTestCaseColor;
			progressContainer.innerHTML = Strings.INPUT_ACCEPTED;
		} else {
			progressContainer.style.color = Settings.rejectedTestCaseColor;
			progressContainer.innerHTML = Strings.INPUT_REJECTED;
		}
	}

	function bindRecognitionEvents(): void {
		const disabledClass = Settings.disabledButtonClass;
		let fastForwardEnabled = true;
		let stepEnabled = true;
		let stopEnabled = false;

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
				Settings.automatonRenderer.lock();
				let input = testCase();
				let controller = Settings.controller();
				controller.fastForward(input);
				highlightCurrentStates();

				progressContainer.style.display = "";
				showAcceptanceStatus();

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
				Settings.automatonRenderer.unlock();

				progressContainer.style.color = "black";
				progressContainer.style.display = "none";

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
				if (controller.isStopped()) {
					Settings.automatonRenderer.lock();
					progressContainer.style.display = "";
					let sidebar = <HTMLDivElement> utils.id(Settings.sidebarID);
					let width = sidebar.offsetWidth;
					width -= 10; // twice the progress container padding
					width -= 1; // sidebar border
					progressContainer.style.width = width + "px";
				}

				let finished = controller.finished(input);
				if (!finished) {
					controller.step(input);
					highlightCurrentStates();
					finished = controller.finished(input);
				}

				let position = controller.stepPosition();
				let displayedText = input.substr(position);
				if (displayedText == "") {
					showAcceptanceStatus();
				} else {
					progressContainer.innerHTML = displayedText;
				}

				if (finished) {
					stepStatus(false);
				}
			}
		});
	}

	function bindShortcuts(): void {
		// Avoids a problem where changing the system language would make
		// these shortcuts be rebound, which would effectively make them
		// trigger multiple times by one keystroke.
		if (!boundShortcuts) {
			utils.bindShortcut(Settings.shortcuts.focusTestCase, function() {
				testCaseInput.focus();
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

		// Must be always rebound since the system's internal shortcut handler
		// is not used here and the test case input vanishes when the system
		// language is changed.
		testCaseInput.addEventListener("keydown", function(e) {
			if (e.keyCode == Keyboard.keys[Settings.shortcuts.dimTestCase[0]]) {
				if (testCaseInput == document.activeElement) {
					testCaseInput.blur();
				}
			}
		});
	}
}
