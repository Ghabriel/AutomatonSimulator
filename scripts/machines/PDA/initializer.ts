import {Initializable} from "../../Initializer"
import {Keyboard} from "../../Keyboard"
import {Menu} from "../../interface/Menu"
import {AcceptingHeuristic, ActionInformation} from "./PDA"
import {PDAController} from "./PDAController"
import {Settings, Strings} from "../../Settings"
import {SignalEmitter} from "../../SignalEmitter"
import {System} from "../../System"
import {Table} from "../../interface/Table"
import {utils} from "../../Utils"

const sanitize = utils.sanitize;

enum ActionNotation {
	Tuple,
	Table
}

export class initPDA implements Initializable {
	public init(): void {
		// console.log("[PDA] Initializing...");
		let menuList: Menu[] = [
			this.buildRecognitionMenu(),
			this.buildStackContentMenu(),
			this.buildActionTreeMenu(),
			this.buildMultipleRecognitionMenu()
		];

		this.bindRecognitionEvents();

		Settings.machines[Settings.Machine.PDA].sidebar = menuList;

		this.addCustomSettings();

		// console.log("[PDA] Initialized successfully");
	}

	public onEnter(): void {
		this.bindShortcuts();
		System.unlockShortcutGroup(this.shortcutGroup);
		// console.log("[PDA] Bound events");
	}

	public onExit(): void {
		this.stopRecognition.click();
		System.lockShortcutGroup(this.shortcutGroup);
		// console.log("[PDA] Unbound events");
	}

	readonly shortcutGroup = "PDA";
	private boundShortcuts = false;
	private actionNotation: ActionNotation = ActionNotation.Tuple;

	private testCaseInput: HTMLInputElement;
	private fastRecognition: HTMLImageElement;
	private stepRecognition: HTMLImageElement;
	private stopRecognition: HTMLImageElement;
	private finalStateCheckbox: HTMLInputElement;
	private emptyStackCheckbox: HTMLInputElement;
	private progressContainer: HTMLDivElement;
	private stackContainer: HTMLDivElement;
	private actionTreeContainer: HTMLDivElement;
	private multipleCaseArea: HTMLTextAreaElement;
	private multipleCaseResults: HTMLDivElement;
	private multipleCaseButton: HTMLImageElement;

	private addCustomSettings(): void {
		let select = utils.createSelect([
			Strings.PDA_TUPLE_NOTATION,
			Strings.PDA_TABLE_NOTATION
		]);

		select.selectedIndex = this.actionNotation;

		let self = this;
		select.addEventListener("change", function() {
			if (ActionNotation.hasOwnProperty(this.selectedIndex.toString())) {
				self.actionNotation = this.selectedIndex;
			}
		});

		Settings.addCustomSetting(Strings.PDA_ACTION_NOTATION, select);
	}

	private buildRecognitionMenu(): Menu {
		let recognitionMenu = new Menu(Strings.RECOGNITION);
		let rows: HTMLElement[][] = [];

		this.buildTestCaseInput(rows);
		this.buildRecognitionControls(rows);
		this.buildRecognitionOptions(rows);
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
			targetID: Settings.mainControllerSignalID,
			identifier: "recognitionHighlight",
			data: [states]
		});
	}

	private buildRecognitionControls(container: HTMLElement[][]): void {
		const disabledClass = Settings.disabledButtonClass;

		this.fastRecognition = utils.create("img", {
			className: "image_button",
			src: Settings.getResourcePath("fastforward.svg"),
			title: Strings.FAST_RECOGNITION
		});

		this.stopRecognition = utils.create("img", {
			className: "image_button " + disabledClass,
			src: Settings.getResourcePath("stop.svg"),
			title: Strings.STOP_RECOGNITION
		});

		this.stepRecognition = utils.create("img", {
			className: "image_button",
			src: Settings.getResourcePath("play.svg"),
			title: Strings.STEP_RECOGNITION
		});

		container.push([this.fastRecognition, this.stepRecognition,
						this.stopRecognition]);
	}

	private buildRecognitionOptions(container: HTMLElement[][]): void {
		this.finalStateCheckbox = utils.checkbox(true);
		this.emptyStackCheckbox = utils.checkbox();

		container.push([
			this.finalStateCheckbox,
			utils.span(Strings.ACCEPT_BY_FINAL_STATE)
		]);

		container.push([
			this.emptyStackCheckbox,
			utils.span(Strings.ACCEPT_BY_EMPTY_STACK)
		]);
	}

	private buildStack(container: HTMLElement[][]): void {
		this.stackContainer = utils.create("div", {
			className: "none",
			id: "stack"
		});

		// this.stackContainer.style.display = "none";
		this.stackContainer.innerHTML = Strings.NO_RECOGNITION_IN_PROGRESS;

		container.push([this.stackContainer]);
	}

	private buildActionTree(container: HTMLElement[][]): void {
		this.actionTreeContainer = utils.create("div", {
			className: "none",
			id: "action_tree"
		});

		// this.actionTreeContainer.style.display = "none";
		this.actionTreeContainer.innerHTML = Strings.NO_RECOGNITION_IN_PROGRESS;

		container.push([this.actionTreeContainer]);
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
			src: Settings.getResourcePath("play.svg"),
			title: Strings.START_MULTIPLE_RECOGNITION
		});
		container.push([this.multipleCaseButton]);
	}

	private showAcceptanceStatus(): void {
		let controller = <PDAController> Settings.controller();
		if (!controller.accepts()) {
			this.progressContainer.style.color = Settings.rejectedTestCaseColor;
			this.progressContainer.innerHTML = Strings.INPUT_REJECTED;
			return;
		}

		if (controller.getAcceptingHeuristic() != AcceptingHeuristic.BOTH) {
			this.progressContainer.style.color = Settings.acceptedTestCaseColor;
			this.progressContainer.innerHTML = Strings.INPUT_ACCEPTED;
			return;
		}

		let heuristic = controller.acceptedHeuristic();
		if (heuristic === null) {
			throw Error("Inconsistent accepting status");
		}

		const suffixClass = "acceptance_status_suffix";

		let output = utils.create("div");
		output.appendChild(utils.span(Strings.INPUT_ACCEPTED));

		if (heuristic & AcceptingHeuristic.ACCEPTING_STATE) {
			let span = utils.span(Strings.INPUT_ACCEPTING_STATE_SUFFIX);
			span.className = suffixClass;
			output.appendChild(span);
		}

		if (heuristic & AcceptingHeuristic.EMPTY_STACK) {
			let span = utils.span(Strings.INPUT_EMPTY_STACK_SUFFIX);
			span.className = suffixClass;
			output.appendChild(span);
		}

		this.progressContainer.style.color = Settings.acceptedTestCaseColor;
		this.progressContainer.innerHTML = "";
		this.progressContainer.appendChild(output);
	}

	private showStackContent(): void {
		let controller = <PDAController> Settings.controller();
		let stackContent = controller.getStackContent();

		if (stackContent.length > 0) {
			this.stackContainer.classList.remove("none");
			this.stackContainer.innerHTML = "";
			for (let i = stackContent.length - 1; i >= 0; i--) {
				let span = utils.span(stackContent[i]);
				this.stackContainer.appendChild(span);
			}

			this.stackContainer.children[0].classList.add("top");
		} else {
			this.stackContainer.classList.add("none");
			this.stackContainer.innerHTML = Strings.EMPTY_STACK;
		}
	}

	private showActionTree(): void {
		let controller = <PDAController> Settings.controller();
		let actionTree = controller.getActionTree();

		if (actionTree.length == 0) {
			this.actionTreeContainer.classList.add("none");
			this.actionTreeContainer.innerHTML = Strings.ACTION_TREE_NO_ACTIONS;
			return;
		}

		this.actionTreeContainer.classList.remove("none");
		this.actionTreeContainer.innerHTML = "";

		for (let action of actionTree) {
			let container = utils.create("div", {
				className: "entry"
			});

			this.showAction(container, action);

			this.actionTreeContainer.appendChild(container);
		}
	}

	private showAction(parent: HTMLElement, action: ActionInformation): void {
		// Shows the updated input/stack instead of the current one
		let updatedAction = this.updateAction(action);

		switch (this.actionNotation) {
			case ActionNotation.Table:
				this.showActionAsTable(parent, updatedAction);
				break;
			case ActionNotation.Tuple:
				this.showActionAsTuple(parent, updatedAction);
				break;
			default:
				utils.assertNever(this.actionNotation);
		}
	}

	private updateAction(action: ActionInformation): ActionInformation {
		let result = utils.clone(action);

		const EPSILON_KEY = "";
		if (action.inputRead != EPSILON_KEY) {
			result.currentInput = result.currentInput.slice(1);
		}

		result.currentStack.pop();

		for (let i = 0; i < action.stackWrite.length; i++) {
			result.currentStack.push(action.stackWrite[i]);
		}

		return result;
	}

	private showActionAsTable(parent: HTMLElement, action: ActionInformation): void {
		let stackCopy = utils.clone(action.currentStack);
		let currentStack = stackCopy.reverse().join("");
		let epsilon = Keyboard.symbols.epsilon;

		let table = new Table(2);
		let fieldValues = [
			Strings.PDA_FIELD_INPUT, action.currentInput,
			Strings.PDA_FIELD_STACK, currentStack,
			Strings.PDA_FIELD_READ_INPUT, action.inputRead || epsilon,
			Strings.PDA_FIELD_WRITE, action.stackWrite || epsilon,
			Strings.PDA_FIELD_TARGET_STATE,	action.targetState.toString(),
		];

		for (let fieldValue of fieldValues) {
			let fieldContainer = utils.span(sanitize(fieldValue));

			if (fieldValue.length == 0) {
				fieldContainer.classList.add("none");
				fieldContainer.innerHTML = Strings.EMPTY;
			}

			table.add(fieldContainer);
		}

		parent.appendChild(table.html());
	}

	private showActionAsTuple(parent: HTMLElement, action: ActionInformation): void {
		let stackCopy = utils.clone(action.currentStack);
		let currentStack = stackCopy.reverse().join("");
		let epsilon = Keyboard.symbols.epsilon;

		let parts: string[] = [
			action.targetState,
			action.currentInput || epsilon,
			currentStack
		];

		parent.appendChild(utils.span("(" + sanitize(parts.join(", ")) + ")"));
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
		let finalStateChecked = true;
		let emptyStackChecked = false;
		let self = this;

		let parsedInput = utils.create("span", {
			className: "parsed_input"
		});

		let remainingInput = utils.create("span", {
			className: "remaining_input"
		});

		let appended = false;

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

		let updateAcceptingHeuristic = function() {
			let heuristic: AcceptingHeuristic;

			if (finalStateChecked && emptyStackChecked) {
				heuristic = AcceptingHeuristic.BOTH;
			} else if (finalStateChecked) {
				heuristic = AcceptingHeuristic.ACCEPTING_STATE;
			} else if (emptyStackChecked) {
				heuristic = AcceptingHeuristic.EMPTY_STACK;
			} else {
				heuristic = AcceptingHeuristic.NEVER;
			}

			let controller = <PDAController> Settings.controller();
			controller.setAcceptingHeuristic(heuristic);
		};

		this.fastRecognition.addEventListener("click", function() {
			if (fastForwardEnabled) {
				// SignalEmitter.emitSignal({
				// 	targetID: Settings.mainControllerSignalID,
				// 	identifier: "lock",
				// 	data: []
				// });
				let input = self.testCase();
				let controller = Settings.controller();
				controller.fastForward(input);
				self.highlightCurrentStates();

				self.progressContainer.style.display = "";
				appended = false;

				self.showAcceptanceStatus();
				self.showStackContent();
				self.showActionTree();

				fastForwardStatus(false);
				stepStatus(false);
				stopStatus(true);
				self.testCaseInput.readOnly = true;
			}
		});

		this.stopRecognition.addEventListener("click", function() {
			if (stopEnabled) {
				Settings.controller().stop();
				SignalEmitter.emitSignal({
					targetID: Settings.mainControllerSignalID,
					identifier: "recognitionDim",
					data: []
				});

				SignalEmitter.emitSignal({
					targetID: Settings.mainControllerSignalID,
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
				self.testCaseInput.readOnly = false;
			}
		});

		this.stepRecognition.addEventListener("click", function() {
			if (stepEnabled) {
				fastForwardStatus(false);
				stopStatus(true);
				self.testCaseInput.readOnly = true;

				let input = self.testCase();
				let controller = Settings.controller();

				if (controller.isStopped()) {
					controller.reset();

					SignalEmitter.emitSignal({
						targetID: Settings.mainControllerSignalID,
						identifier: "lock",
						data: []
					});

					self.progressContainer.style.display = "";
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
					appended = false;
					self.showAcceptanceStatus();
					self.clearActionTree();
				} else {
					let position = controller.stepPosition();
					if (!appended) {
						self.progressContainer.innerHTML = "";
						self.progressContainer.appendChild(parsedInput);
						self.progressContainer.appendChild(remainingInput);
						appended = true;
					}

					parsedInput.innerHTML = sanitize(input.substr(0, position));
					remainingInput.innerHTML = sanitize(input.substr(position));
				}
			}
		});

		this.multipleCaseButton.addEventListener("click", function() {
			let testCases = self.multipleCaseArea.value.split("\n");
			let controller = <PDAController> Settings.controller();

			self.multipleCaseResults.innerHTML = "";

			for (let input of testCases) {
				controller.fastForward(input);

				let result = utils.create("span");
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

		this.finalStateCheckbox.addEventListener("change", function(e: Event) {
			finalStateChecked = this.checked;
			updateAcceptingHeuristic();
		});

		this.emptyStackCheckbox.addEventListener("change", function(e: Event) {
			emptyStackChecked = this.checked;
			updateAcceptingHeuristic();
		});

		this.testCaseInput.addEventListener("click", function() {
			if (this.readOnly) {
				self.stopRecognition.click();
				this.focus();
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
