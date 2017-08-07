import {Keyboard} from "../../Keyboard"
import {LBAController} from "./LBAController"
import {Menu} from "../../interface/Menu"
import {Settings, Strings} from "../../Settings"
import {System} from "../../System"
import {Table} from "../../interface/Table"
import {utils} from "../../Utils"

export class initLBA {
	public init(): void {
		console.log("[LBA] Initializing...");
		let menuList: Menu[] = [];

		let menu = new Menu(Strings.RECOGNITION);
		let rows: HTMLElement[][] = [];

		this.buildTestCaseInput(rows);
		this.buildRecognitionControls(rows);
		this.buildTape(rows);
		this.buildRecognitionProgress(rows);
		this.bindRecognitionEvents();

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

		Settings.machines[Settings.Machine.LBA].sidebar = menuList;
		console.log("[LBA] Initialized successfully");
	}

	public onEnter(): void {
		this.bindShortcuts();
		System.unlockShortcutGroup(this.shortcutGroup);
		console.log("[LBA] Bound events");
	}

	public onExit(): void {
		System.lockShortcutGroup(this.shortcutGroup);
		console.log("[LBA] Unbound events");
	}

	readonly shortcutGroup = "LBA";
	private boundShortcuts = false;
	private testCaseInput: HTMLInputElement = null;
	private fastRecognition: HTMLImageElement = null;
	private stepRecognition: HTMLImageElement = null;
	private stopRecognition: HTMLImageElement = null;
	private progressContainer: HTMLDivElement = null;
	private tapeContainer: HTMLDivElement = null;

	private testCase(): string {
		return this.testCaseInput.value;
	}

	private buildTestCaseInput(container: HTMLElement[][]): void {
		let input = <HTMLInputElement> utils.create("input", {
			type: "text",
			placeholder: Strings.TEST_CASE
		});
		container.push([input]);
		this.testCaseInput = input;
	}

	private highlightCurrentStates(): void {
		let states = Settings.controller().currentStates();
		Settings.automatonRenderer.recognitionHighlight(states);
	}

	private buildRecognitionControls(container: HTMLElement[][]): void {
		const disabledClass = Settings.disabledButtonClass;

		this.fastRecognition = <HTMLImageElement> utils.create("img", {
			className: "image_button",
			src: "images/fastforward.svg",
			title: Strings.FAST_RECOGNITION
		});

		this.stopRecognition = <HTMLImageElement> utils.create("img", {
			className: "image_button " + disabledClass,
			src: "images/stop.svg",
			title: Strings.STOP_RECOGNITION
		});

		this.stepRecognition = <HTMLImageElement> utils.create("img", {
			className: "image_button",
			src: "images/play.svg",
			title: Strings.STEP_RECOGNITION
		});

		container.push([this.fastRecognition, this.stepRecognition,
						this.stopRecognition]);
	}

	private buildTape(container: HTMLElement[][]): void {
		this.tapeContainer = <HTMLDivElement> utils.create("div", {
			id: "tape"
		});

		this.tapeContainer.style.display = "none";

		let displayedChars = Settings.tapeDisplayedChars;

		for (let i = 0; i < displayedChars; i++) {
			let cell = <HTMLDivElement> utils.create("div", {
				className: "tape_cell"
			});

			this.tapeContainer.appendChild(cell);
		}

		this.tapeContainer.children[(displayedChars - 1) / 2].classList.add("center");

		container.push([this.tapeContainer]);
	}

	private buildRecognitionProgress(container: HTMLElement[][]): void {
		this.progressContainer = <HTMLDivElement> utils.create("div", {
			id: "recognition_progress"
		});

		this.progressContainer.style.display = "none";

		container.push([this.progressContainer]);
	}

	private showAcceptanceStatus(): void {
		if (Settings.controller().accepts()) {
			this.progressContainer.style.color = Settings.acceptedTestCaseColor;
			this.progressContainer.innerHTML = Strings.INPUT_ACCEPTED;
		} else {
			this.progressContainer.style.color = Settings.rejectedTestCaseColor;
			this.progressContainer.innerHTML = Strings.INPUT_REJECTED;
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

		// let displayedContent = tapeContent.substr(startIndex, displayedChars);
		let displayedContent = tapeContent.slice(startIndex, startIndex + displayedChars);

		for (let i = 0; i < displayedContent.length; i++) {
			this.tapeContainer.children[i].innerHTML = displayedContent[i];
		}
	}

	private bindRecognitionEvents(): void {
		const disabledClass = Settings.disabledButtonClass;
		let fastForwardEnabled = true;
		let stepEnabled = true;
		let stopEnabled = false;
		let self = this;

		let fastForwardStatus = function(enabled) {
			fastForwardEnabled = enabled;
			self.fastRecognition.classList[enabled ? "remove" : "add"](disabledClass);
		};

		let stepStatus = function(enabled) {
			stepEnabled = enabled;
			self.stepRecognition.classList[enabled ? "remove" : "add"](disabledClass);
		};

		let stopStatus = function(enabled) {
			stopEnabled = enabled;
			self.stopRecognition.classList[enabled ? "remove" : "add"](disabledClass);
		};

		this.fastRecognition.addEventListener("click", function() {
			if (fastForwardEnabled) {
				Settings.automatonRenderer.lock();
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
				Settings.automatonRenderer.recognitionDim();
				Settings.automatonRenderer.unlock();

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

					Settings.automatonRenderer.lock();
					self.progressContainer.style.display = "";
					let sidebar = <HTMLDivElement> utils.id(Settings.sidebarID);
					let width = sidebar.offsetWidth;
					width -= 10; // twice the progress container padding
					width -= 1; // sidebar border
					self.progressContainer.style.width = width + "px";

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
					self.showAcceptanceStatus();
				}
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
			if (e.keyCode == Keyboard.keys[Settings.shortcuts.dimTestCase[0]]) {
				if (self.testCaseInput == document.activeElement) {
					self.testCaseInput.blur();
				}
			}
		});
	}
}
