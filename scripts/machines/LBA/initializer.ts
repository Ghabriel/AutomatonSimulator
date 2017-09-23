import {Keyboard} from "../../Keyboard"
import {LBAController} from "./LBAController"
import {Menu} from "../../interface/Menu"
import {Settings, Strings} from "../../Settings"
import {SignalEmitter} from "../../SignalEmitter"
import {System} from "../../System"
import {Table} from "../../interface/Table"
import {utils} from "../../Utils"

export class initLBA {
	public init(): void {
		console.log("[LBA] Initializing...");
		let menuList: Menu[] = [];

		let recognitionMenu = new Menu(Strings.RECOGNITION);
		let rows: HTMLElement[][] = [];

		this.buildTestCaseInput(rows);
		this.buildRecognitionControls(rows);
		this.buildTape(rows);
		this.buildRecognitionProgress(rows);

		this.addRows(rows, recognitionMenu);
		menuList.push(recognitionMenu);

		let multipleRecognitionMenu = new Menu(Strings.MULTIPLE_RECOGNITION);
		rows = [];

		this.buildMultipleRecognition(rows);

		this.addRows(rows, multipleRecognitionMenu);
		menuList.push(multipleRecognitionMenu);

		this.bindRecognitionEvents();

		Settings.machines[Settings.Machine.LBA].sidebar = menuList;
		console.log("[LBA] Initialized successfully");
	}

	public onEnter(): void {
		this.bindShortcuts();
		System.unlockShortcutGroup(this.shortcutGroup);
		console.log("[LBA] Bound events");
	}

	public onExit(): void {
		this.stopRecognition.click();
		System.lockShortcutGroup(this.shortcutGroup);
		console.log("[LBA] Unbound events");
	}

	readonly shortcutGroup = "LBA";
	private boundShortcuts = false;
	private testCaseInput: HTMLInputElement;
	private fastRecognition: HTMLImageElement;
	private stepRecognition: HTMLImageElement;
	private stopRecognition: HTMLImageElement;
	private progressContainer: HTMLDivElement;
	private tapeContainer: HTMLDivElement;
	private multipleCaseArea: HTMLTextAreaElement;
	private multipleCaseResults: HTMLDivElement;
	private multipleCaseButton: HTMLImageElement;

	private addRows(rows: HTMLElement[][], menu: Menu): void {
		for (let row of rows) {
			let div = utils.create("div", {
				className: "row"
			});
			for (let node of row) {
				div.appendChild(node);
			}
			menu.add(div);
		}
	}

	private testCase(): string {
		return this.testCaseInput.value;
	}

	private buildTestCaseInput(container: HTMLElement[][]): void {
		let input = utils.create("input", {
			type: "text",
			placeholder: Strings.TEST_CASE
		});
		container.push([input]);
		this.testCaseInput = input;
	}

	private highlightCurrentStates(): void {
		let states = Settings.controller().currentStates();
		SignalEmitter.emitSignal({
			targetID: Settings.automatonRendererSignalID,
			identifier: "recognitionHighlight",
			data: [states]
		});
	}

	private buildRecognitionControls(container: HTMLElement[][]): void {
		const disabledClass = Settings.disabledButtonClass;

		this.fastRecognition = utils.create("img", {
			className: "image_button",
			src: "images/fastforward.svg",
			title: Strings.FAST_RECOGNITION
		});

		this.stopRecognition = utils.create("img", {
			className: "image_button " + disabledClass,
			src: "images/stop.svg",
			title: Strings.STOP_RECOGNITION
		});

		this.stepRecognition = utils.create("img", {
			className: "image_button",
			src: "images/play.svg",
			title: Strings.STEP_RECOGNITION
		});

		container.push([this.fastRecognition, this.stepRecognition,
						this.stopRecognition]);
	}

	private buildTape(container: HTMLElement[][]): void {
		this.tapeContainer = utils.create("div", {
			id: "tape"
		});

		this.tapeContainer.style.display = "none";

		let displayedChars = Settings.tapeDisplayedChars;

		for (let i = 0; i < displayedChars; i++) {
			let cell = utils.create("div", {
				className: "tape_cell"
			});

			this.tapeContainer.appendChild(cell);
		}

		this.tapeContainer.children[(displayedChars - 1) / 2].classList.add("center");

		container.push([this.tapeContainer]);
	}

	private buildRecognitionProgress(container: HTMLElement[][]): void {
		this.progressContainer = utils.create("div", {
			id: "recognition_progress"
		});

		this.progressContainer.style.display = "none";

		container.push([this.progressContainer]);
	}

	private buildMultipleRecognition(container: HTMLElement[][]): void {
		this.multipleCaseArea = utils.create("textarea");
		this.multipleCaseArea.rows = Settings.multRecognitionAreaRows;
		this.multipleCaseArea.cols = Settings.multRecognitionAreaCols;

		this.multipleCaseResults = utils.create("div");

		let testCaseArea = utils.create("div", {
			id: "multiple_recognition"
		});
		testCaseArea.appendChild(this.multipleCaseArea);
		testCaseArea.appendChild(this.multipleCaseResults);
		container.push([testCaseArea]);

		this.multipleCaseButton = utils.create("img", {
			className: "image_button",
			src: "images/play.svg",
			title: Strings.START_MULTIPLE_RECOGNITION
		});
		container.push([this.multipleCaseButton]);
	}


	private showAcceptanceStatus(): void {
		let controller = <LBAController> Settings.controller();
		if (controller.accepts()) {
			this.progressContainer.style.color = Settings.acceptedTestCaseColor;
			this.progressContainer.innerHTML = Strings.INPUT_ACCEPTED;
		} else {
			this.progressContainer.style.color = Settings.rejectedTestCaseColor;
			if (controller.exhausted()) {
				this.progressContainer.innerHTML = Strings.INPUT_LOOPING;
			} else {
				this.progressContainer.innerHTML = Strings.INPUT_REJECTED;
			}
		}
	}

	private showTapeContent(): void {
		let controller = <LBAController> Settings.controller();
		let tapeContent = controller.getTapeContent();
		let headPosition = controller.getHeadPosition();

		let displayedChars = Settings.tapeDisplayedChars;
		let offset = (displayedChars - 1) / 2;

		let startIndex = headPosition - offset;

		// Adds blank symbols to the left if needed
		if (startIndex < 0) {
			let buffer: string[] = [];

			for (let i = 0; i < -startIndex; i++) {
				buffer.push("_");
			}

			tapeContent = buffer.concat(tapeContent);
			startIndex = 0;
		}

		// Adds blank symbols to the right if needed
		if (startIndex + displayedChars > tapeContent.length) {
			let delta = startIndex + displayedChars - tapeContent.length;
			for (let i = 0; i < delta; i++) {
				tapeContent.push("_");
			}
		}

		let displayedContent = tapeContent.slice(startIndex, startIndex + displayedChars);

		for (let i = 0; i < displayedChars; i++) {
			this.tapeContainer.children[i].innerHTML = displayedContent[i];
		}
	}

	private bindRecognitionEvents(): void {
		const disabledClass = Settings.disabledButtonClass;
		let fastForwardEnabled = true;
		let stepEnabled = true;
		let stopEnabled = false;
		let self = this;

		let fastForwardStatus = function(enabled: boolean) {
			fastForwardEnabled = enabled;
			self.fastRecognition.classList[enabled ? "remove" : "add"](disabledClass);
		};

		let stepStatus = function(enabled: boolean) {
			stepEnabled = enabled;
			self.stepRecognition.classList[enabled ? "remove" : "add"](disabledClass);
		};

		let stopStatus = function(enabled: boolean) {
			stopEnabled = enabled;
			self.stopRecognition.classList[enabled ? "remove" : "add"](disabledClass);
		};

		this.fastRecognition.addEventListener("click", function() {
			if (fastForwardEnabled) {
				SignalEmitter.emitSignal({
					targetID: Settings.automatonRendererSignalID,
					identifier: "lock",
					data: []
				});
				let input = self.testCase();
				let controller = Settings.controller();
				controller.fastForward(input);
				self.highlightCurrentStates();

				self.progressContainer.style.display = "";
				self.showAcceptanceStatus();

				self.tapeContainer.style.display = "";
				self.showTapeContent();

				fastForwardStatus(false);
				stepStatus(false);
				stopStatus(true);
				self.testCaseInput.disabled = true;
			}
		});

		this.stopRecognition.addEventListener("click", function() {
			if (stopEnabled) {
				Settings.controller().stop();
				SignalEmitter.emitSignal({
					targetID: Settings.automatonRendererSignalID,
					identifier: "recognitionDim",
					data: []
				});

				SignalEmitter.emitSignal({
					targetID: Settings.automatonRendererSignalID,
					identifier: "unlock",
					data: []
				});

				self.progressContainer.style.color = "black";
				self.progressContainer.style.display = "none";

				self.tapeContainer.style.display = "none";

				fastForwardStatus(true);
				stepStatus(true);
				stopStatus(false);
				self.testCaseInput.disabled = false;
			}
		});

		this.stepRecognition.addEventListener("click", function() {
			if (stepEnabled) {
				fastForwardStatus(false);
				stopStatus(true);
				self.testCaseInput.disabled = true;

				let input = self.testCase();
				let controller = Settings.controller();

				if (controller.isStopped()) {
					controller.reset();

					SignalEmitter.emitSignal({
						targetID: Settings.automatonRendererSignalID,
						identifier: "lock",
						data: []
					});

					self.tapeContainer.style.display = "";
				}

				let finished = controller.finished(input);
				if (!finished) {
					controller.step(input);
					self.highlightCurrentStates();
					finished = controller.finished(input);

					self.showTapeContent();
				}

				if (finished) {
					stepStatus(false);
					self.progressContainer.style.display = "";
					self.showAcceptanceStatus();
				}
			}
		});

		this.multipleCaseButton.addEventListener("click", function() {
			let testCases = self.multipleCaseArea.value.split("\n");
			let controller = <LBAController> Settings.controller();

			self.multipleCaseResults.innerHTML = "";

			for (let input of testCases) {
				controller.fastForward(input);

				let result = utils.create("span");
				if (controller.accepts()) {
					result.style.color = Settings.acceptedTestCaseColor;
					result.innerHTML = Strings.INPUT_ACCEPTED;
				} else {
					result.style.color = Settings.rejectedTestCaseColor;
					if (controller.exhausted()) {
						// TODO: make this look more elegant
						result.innerHTML = Strings.INPUT_LOOPING.split("<br>").join(" ");
					} else {
						result.innerHTML = Strings.INPUT_REJECTED;
					}
				}
				self.multipleCaseResults.appendChild(result);
			}
		});
	}

	private bindShortcuts(): void {
		let self = this;

		// Avoids a problem where changing the system language would make
		// these shortcuts be rebound, which would effectively make them
		// trigger multiple times by one keystroke.
		if (!this.boundShortcuts) {
			System.bindShortcut(Settings.shortcuts.focusTestCase, function() {
				self.testCaseInput.focus();
			}, this.shortcutGroup);

			System.bindShortcut(Settings.shortcuts.fastForward, function() {
				self.fastRecognition.click();
			}, this.shortcutGroup);

			System.bindShortcut(Settings.shortcuts.step, function() {
				self.stepRecognition.click();
			}, this.shortcutGroup);

			System.bindShortcut(Settings.shortcuts.stop, function() {
				self.stopRecognition.click();
			}, this.shortcutGroup);

			this.boundShortcuts = true;
		}

		// Must be always rebound since the system's internal shortcut handler
		// is not used here and the test case input vanishes when the system
		// language is changed.
		this.testCaseInput.addEventListener("keydown", function(e) {
			let key = <Keyboard.Key> Settings.shortcuts.dimTestCase[0];
			if (e.keyCode == Keyboard.keys[key]) {
				self.testCaseInput.blur();
			}
		});
	}
}
