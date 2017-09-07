import {Keyboard} from "../../Keyboard"
import {PDAController} from "./PDAController"
import {Menu} from "../../interface/Menu"
import {Settings, Strings} from "../../Settings"
import {SignalEmitter} from "../../SignalEmitter"
import {System} from "../../System"
import {Table} from "../../interface/Table"
import {utils} from "../../Utils"

export class initPDA {
	public init(): void {
		console.log("[PDA] Initializing...");
		let menuList: Menu[] = [
			this.buildRecognitionMenu(),
			this.buildStackContentMenu(),
			this.buildActionTreeMenu(),
			this.buildMultipleRecognitionMenu()
		];

		this.bindRecognitionEvents();

		Settings.machines[Settings.Machine.PDA].sidebar = menuList;
		console.log("[PDA] Initialized successfully");
	}

	public onEnter(): void {
		this.bindShortcuts();
		System.unlockShortcutGroup(this.shortcutGroup);
		console.log("[PDA] Bound events");
	}

	public onExit(): void {
		System.lockShortcutGroup(this.shortcutGroup);
		console.log("[PDA] Unbound events");
	}

	readonly shortcutGroup = "PDA";
	private boundShortcuts = false;
	private testCaseInput: HTMLInputElement;
	private fastRecognition: HTMLImageElement;
	private stepRecognition: HTMLImageElement;
	private stopRecognition: HTMLImageElement;
	private progressContainer: HTMLDivElement;
	private stackContainer: HTMLDivElement;
	private actionTreeContainer: HTMLDivElement;
	private multipleCaseArea: HTMLTextAreaElement;
	private multipleCaseResults: HTMLDivElement;
	private multipleCaseButton: HTMLImageElement;

	private buildRecognitionMenu(): Menu {
		let recognitionMenu = new Menu(Strings.RECOGNITION);
		let rows: HTMLElement[][] = [];

		this.buildTestCaseInput(rows);
		this.buildRecognitionControls(rows);
		// this.buildStack(rows);
		// this.buildActionTree(rows);
		this.buildRecognitionProgress(rows);
		this.addRows(rows, recognitionMenu);

		return recognitionMenu;
	}

	private buildStackContentMenu(): Menu {
		let stackMenu = new Menu(Strings.STACK_MENUBAR);
		let rows: HTMLElement[][] = [];

		this.buildStack(rows);
		this.addRows(rows, stackMenu);

		return stackMenu;
	}

	private buildActionTreeMenu(): Menu {
		let actionTreeMenu = new Menu(Strings.ACTION_TREE_MENUBAR);
		let rows: HTMLElement[][] = [];

		this.buildActionTree(rows);
		this.addRows(rows, actionTreeMenu);

		return actionTreeMenu;
	}

	private buildMultipleRecognitionMenu(): Menu {
		let multipleRecognitionMenu = new Menu(Strings.MULTIPLE_RECOGNITION);
		let rows: HTMLElement[][] = [];

		this.buildMultipleRecognition(rows);
		this.addRows(rows, multipleRecognitionMenu);

		return multipleRecognitionMenu;
	}

	private addRows(rows: HTMLElement[][], menu: Menu): void {
		for (let row of rows) {
			let div = <HTMLDivElement> utils.create("div", {
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
		let input = <HTMLInputElement> utils.create("input", {
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

	private buildStack(container: HTMLElement[][]): void {
		this.stackContainer = <HTMLDivElement> utils.create("div", {
			className: "none",
			id: "stack"
		});

		// this.stackContainer.style.display = "none";
		this.stackContainer.innerHTML = Strings.NO_RECOGNITION_IN_PROGRESS;

		container.push([this.stackContainer]);
	}

	private buildActionTree(container: HTMLElement[][]): void {
		this.actionTreeContainer = <HTMLDivElement> utils.create("div", {
			className: "none",
			id: "action_tree"
		});

		// this.actionTreeContainer.style.display = "none";
		this.actionTreeContainer.innerHTML = Strings.NO_RECOGNITION_IN_PROGRESS;

		container.push([this.actionTreeContainer]);
	}

	private buildRecognitionProgress(container: HTMLElement[][]): void {
		this.progressContainer = <HTMLDivElement> utils.create("div", {
			id: "recognition_progress"
		});

		this.progressContainer.style.display = "none";

		container.push([this.progressContainer]);
	}

	private buildMultipleRecognition(container: HTMLElement[][]): void {
		this.multipleCaseArea = <HTMLTextAreaElement> utils.create("textarea");
		this.multipleCaseArea.rows = Settings.multRecognitionAreaRows;
		this.multipleCaseArea.cols = Settings.multRecognitionAreaCols;

		this.multipleCaseResults = <HTMLDivElement> utils.create("div");

		let testCaseArea = <HTMLDivElement> utils.create("div", {
			id: "multiple_recognition"
		});
		testCaseArea.appendChild(this.multipleCaseArea);
		testCaseArea.appendChild(this.multipleCaseResults);
		container.push([testCaseArea]);

		this.multipleCaseButton = <HTMLImageElement> utils.create("img", {
			className: "image_button",
			src: "images/play.svg",
			title: Strings.START_MULTIPLE_RECOGNITION
		});
		container.push([this.multipleCaseButton]);
	}

	private showAcceptanceStatus(): void {
		let controller = <PDAController> Settings.controller();
		this.progressContainer.style.display = "";
		if (controller.accepts()) {
			this.progressContainer.style.color = Settings.acceptedTestCaseColor;
			this.progressContainer.innerHTML = Strings.INPUT_ACCEPTED;
		} else {
			this.progressContainer.style.color = Settings.rejectedTestCaseColor;
			this.progressContainer.innerHTML = Strings.INPUT_REJECTED;
		}
	}

	private showStackContent(): void {
		let controller = <PDAController> Settings.controller();
		let stackContent = controller.getStackContent();

		// TODO
		this.stackContainer.classList.remove("none");
		this.stackContainer.innerHTML = stackContent.join("");
	}

	private showActionTree(): void {
		let controller = <PDAController> Settings.controller();
		let actionTree = controller.getActionTree();
		let epsilon = Keyboard.symbols.epsilon;

		if (actionTree.length == 0) {
			this.actionTreeContainer.classList.add("none");
			this.actionTreeContainer.innerHTML = Strings.ACTION_TREE_NO_ACTIONS;
		} else {
			this.actionTreeContainer.classList.remove("none");
			this.actionTreeContainer.innerHTML = "";
		}

		for (let action of actionTree) {
			let container = <HTMLDivElement> utils.create("div", {
				className: "entry"
			});

			let table = new Table(2);
			let fieldValues = [
				Strings.PDA_FIELD_INPUT, action.currentInput,
				Strings.PDA_FIELD_STACK, action.currentStack.join(""),
				Strings.PDA_FIELD_READ_INPUT, action.inputRead || epsilon,
				Strings.PDA_FIELD_WRITE, action.stackWrite || epsilon,
				Strings.PDA_FIELD_TARGET_STATE,	action.targetState.toString(),
			];

			for (let fieldValue of fieldValues) {
				let fieldContainer = utils.create("span", {
					innerHTML: fieldValue
				});

				if (fieldValue.length == 0) {
					fieldContainer.classList.add("none");
					fieldContainer.innerHTML = Strings.EMPTY;
				}

				table.add(fieldContainer);
			}

			container.appendChild(table.html());

			this.actionTreeContainer.appendChild(container);
		}
	}

	private clearStackContent(): void {
		this.stackContainer.classList.add("none");
		this.stackContainer.innerHTML = Strings.NO_RECOGNITION_IN_PROGRESS;
	}

	private clearActionTree(): void {
		this.actionTreeContainer.classList.add("none");
		this.actionTreeContainer.innerHTML = Strings.NO_RECOGNITION_IN_PROGRESS;
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
				SignalEmitter.emitSignal({
					targetID: Settings.automatonRendererSignalID,
					identifier: "lock",
					data: []
				});
				let input = self.testCase();
				let controller = Settings.controller();
				controller.fastForward(input);
				self.highlightCurrentStates();

				self.showAcceptanceStatus();
				self.showStackContent();
				self.showActionTree();

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

				self.clearStackContent();
				self.clearActionTree();

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

					// self.stackContainer.style.display = "";
					// self.actionTreeContainer.style.display = "";
					self.stackContainer.classList.remove("none");
					self.actionTreeContainer.classList.remove("none");
				}

				let finished = controller.finished(input);
				if (!finished) {
					controller.step(input);
					self.highlightCurrentStates();
					finished = controller.finished(input);

					self.showStackContent();
					self.showActionTree();
				}

				if (finished) {
					stepStatus(false);
					self.showAcceptanceStatus();
					self.clearActionTree();
				}
			}
		});

		this.multipleCaseButton.addEventListener("click", function() {
			let testCases = self.multipleCaseArea.value.split("\n");
			let controller = <PDAController> Settings.controller();

			self.multipleCaseResults.innerHTML = "";

			for (let input of testCases) {
				controller.fastForward(input);

				let result = <HTMLSpanElement> utils.create("span");
				if (controller.accepts()) {
					result.style.color = Settings.acceptedTestCaseColor;
					result.innerHTML = Strings.INPUT_ACCEPTED;
				} else {
					result.style.color = Settings.rejectedTestCaseColor;
					result.innerHTML = Strings.INPUT_REJECTED;
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
			if (e.keyCode == Keyboard.keys[Settings.shortcuts.dimTestCase[0]]) {
				self.testCaseInput.blur();
			}
		});
	}
}
