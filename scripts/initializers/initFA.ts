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

	let testCaseInput: HTMLInputElement = null;

	function testCase(): string {
		return testCaseInput.value;
	}

	function buildTestCaseInput(container: HTMLElement[][]) {
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

	function buildRecognitionControls(container: HTMLElement[][]) {
		const disabledClass = Settings.disabledButtonClass;
		let fastForwardEnabled = true;
		let stopEnabled = false;

		let fastRecognition = <HTMLImageElement> utils.create("img", {
			className: "image_button",
			src: "images/fastforward.svg",
			title: Strings.FAST_RECOGNITION,
			click: function() {
				if (fastForwardEnabled) {
					let input = testCase();
					Settings.controller().fastForward(input);
					highlightCurrentStates();
				}
			}
		});

		let stopRecognition = <HTMLImageElement> utils.create("img", {
			className: "image_button " + disabledClass,
			src: "images/stop.svg",
			title: Strings.STOP_RECOGNITION
		});

		stopRecognition.addEventListener("click", function() {
			if (stopEnabled) {
				// TODO
				// alert("TODO: stop");
				Settings.controller().stop();
				Settings.automatonRenderer.recognitionDim();

				fastForwardEnabled = true;
				fastRecognition.classList.remove(disabledClass);

				testCaseInput.disabled = false;

				stopEnabled = false;
				stopRecognition.classList.add(disabledClass);
			}
		});

		let stepRecognition = <HTMLImageElement> utils.create("img", {
			className: "image_button",
			src: "images/play.svg",
			title: Strings.STEP_RECOGNITION,
			click: function() {
				// TODO
				fastForwardEnabled = false;
				fastRecognition.classList.add(disabledClass);

				testCaseInput.disabled = true;

				stopEnabled = true;
				stopRecognition.classList.remove(disabledClass);

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

		utils.bindShortcut(Settings.shortcuts.fastForward, function() {
			fastRecognition.click();
		});

		utils.bindShortcut(Settings.shortcuts.step, function() {
			stepRecognition.click();
		});

		utils.bindShortcut(Settings.shortcuts.stop, function() {
			stopRecognition.click();
		});
	}
}
