import {Keyboard} from "./Keyboard"
import {Settings, Strings} from "./Settings"
import {System} from "./System"
import {utils} from "./Utils"

export interface ValuedHTMLElement extends HTMLElement {
	value: string;
}

interface InputProperties {
	initializer?: () => ValuedHTMLElement;
	placeholder?: string;
	validator?: (v: string) => boolean;
}

type SuccessCallback = (t: string[]) => void;
type AbortCallback = () => void;

export class Prompt {
	constructor(message: string) {
		this.message = message;
	}

	public addInput(properties: InputProperties): void {
		this.inputs.push(properties);
	}

	public setPosition(x: number, y: number): void {
		this.explicitPosition = {
			x: x,
			y: y
		};
	}

	public onSuccess(callback: SuccessCallback): void {
		this.successCallback = callback;
	}

	public onAbort(callback: AbortCallback): void {
		this.abortCallback = callback;
	}

	public show(): void {
		let blocker = utils.create("div", {
			className: "click_blocker"
		});

		let container = <HTMLDivElement> utils.create("div", {
			id: "system_prompt"
		});
		container.innerHTML = this.message + "<br>";

		if (this.explicitPosition) {
			container.classList.add("floating");
			let mainbar = <HTMLElement> utils.id(Settings.mainbarID);
			container.style.left = (mainbar.offsetLeft + this.explicitPosition.x) + "px";
			container.style.top = (mainbar.offsetTop + this.explicitPosition.y) + "px";
		}

		let mainbar = utils.id(Settings.mainbarID);
		const inputIdPrefix = "system_prompt_input_";

		let dismiss = function() {
			// Removes the click blocker from the page
			document.body.removeChild(blocker);

			// Removes the keyboard block
			System.unblockEvents();

			// Slides the container up and then removes it from the page
			$(container).slideUp(Settings.promptSlideHideInterval, function() {
				mainbar.removeChild(container);
			});
		};

		let inputs: ValuedHTMLElement[] = [];
		let self = this;

		let allInputsValid = function(): boolean {
			for (let input of inputs) {
				let index = input.id.replace(inputIdPrefix, "");
				let validator = self.inputs[index].validator;
				if (validator && !validator(input.value)) {
					return false;
				}
			}
			return true;
		};

		let ok = <HTMLInputElement> utils.create("input", {
			type: "button",
			value: Strings.PROMPT_CONFIRM,
			click: function() {
				let allValid = true;
				let contents: string[] = [];
				for (let input of inputs) {
					let index = input.id.replace(inputIdPrefix, "");
					let validator = self.inputs[index].validator;
					if (validator && !validator(input.value)) {
						allValid = false;
						break;
					}
					contents.push(input.value);
				}
				dismiss();
				self.successCallback(contents);
			}
		});

		let cancel = <HTMLInputElement> utils.create("input", {
			type: "button",
			value: Strings.PROMPT_CANCEL,
			click: function() {
				dismiss();
				if (self.abortCallback) {
					self.abortCallback();
				}
			}
		});

		for (let i = 0; i < this.inputs.length; i++) {
			let input: ValuedHTMLElement;

			if (this.inputs[i].initializer) {
				input = this.inputs[i].initializer();
			} else {
				input = <HTMLInputElement> utils.create("input", {
					type: "text",
					placeholder: this.inputs[i].placeholder || ""
				});
			}

			input.id = inputIdPrefix + i;

			let isInputText = /input/i.test(input.tagName);
			isInputText = isInputText && (<HTMLInputElement> input).type == "text";

			if (isInputText) {
				input.addEventListener("keydown", function(e) {
					if (e.keyCode == Keyboard.keys.ENTER) {
						ok.click();
					} else if (e.keyCode == Keyboard.keys.ESC) {
						cancel.click();
					}
				});

				input.addEventListener("keyup", function(e) {
					let isEnter = (e.keyCode == Keyboard.keys.ENTER);
					let isEsc = (e.keyCode == Keyboard.keys.ESC);
					if (!isEnter && !isEsc) {
						ok.disabled = !allInputsValid();
					}
				});
			}

			inputs.push(input);
			container.appendChild(input);
		}

		// Initial validity state
		ok.disabled = !allInputsValid();

		container.appendChild(ok);
		container.appendChild(cancel);

		// Adds the "click blocker" to the page
		document.body.insertBefore(blocker, document.body.children[0]);

		// Sets up a keyboard block
		System.blockEvents();

		$(container).toggle();
		// Adds the prompt to the page
		mainbar.insertBefore(container, mainbar.children[0]);
		$(container).slideDown(Settings.promptSlideShowInterval, function() {
			inputs[0].focus();
		});
	}

	// Creates an input prompt with a given message, a given number
	// of input fields and given callbacks for success and failure.
	// TODO: make this more flexible (regarding the input fields)
	public static simple(message: string, numFields: number,
						   success: (t: string[]) => void,
						   fail?: () => void): void {

		let blocker = utils.create("div", {
			className: "click_blocker"
		});

		let container = utils.create("div", {
			id: "system_prompt"
		});
		container.innerHTML = message + "<br>";

		let mainbar = utils.id(Settings.mainbarID);

		// This flag avoids buggy behavior when the user triggers
		// ok/cancel multiple times in the same prompt (e.g by quickly
		// pressing enter/esc multiple times)
		let completedInteraction = false;

		let dismiss = function() {
			// Removes the click blocker from the page
			document.body.removeChild(blocker);

			// Removes the keyboard block
			System.unblockEvents();

			$(container).slideUp(Settings.promptSlideHideInterval, function() {
				mainbar.removeChild(container);
			});
		};

		let inputs: HTMLInputElement[] = [];

		let ok = <HTMLInputElement> utils.create("input", {
			type: "button",
			value: Strings.PROMPT_CONFIRM,
			click: function() {
				if (completedInteraction) {
					return;
				}

				completedInteraction = true;

				let contents: string[] = [];
				for (let input of inputs) {
					contents.push(input.value);
				}
				dismiss();
				success(contents);
			}
		});

		let cancel = <HTMLInputElement> utils.create("input", {
			type: "button",
			value: Strings.PROMPT_CANCEL,
			click: function() {
				if (completedInteraction) {
					return;
				}

				completedInteraction = true;

				dismiss();
				if (fail) {
					fail();
				}
			}
		});

		for (let i = 0; i < numFields; i++) {
			let input = <HTMLInputElement> utils.create("input", {
				type: "text"
			});

			input.addEventListener("keydown", function(e) {
				if (e.keyCode == Keyboard.keys.ENTER) {
					ok.click();
				} else if (e.keyCode == Keyboard.keys.ESC) {
					cancel.click();
				}
			});

			inputs.push(input);
			container.appendChild(input);
		}

		container.appendChild(ok);
		container.appendChild(cancel);

		// Adds the "click blocker" to the page
		document.body.insertBefore(blocker, document.body.children[0]);

		// Sets up a keyboard block
		System.blockEvents();

		$(container).toggle();
		// Adds the prompt to the page
		mainbar.insertBefore(container, mainbar.children[0]);
		$(container).slideDown(Settings.promptSlideShowInterval, function() {
			inputs[0].focus();
		});
	}

	private message: string;
	private inputs: InputProperties[] = [];
	private explicitPosition: {x: number, y: number} = null;
	private successCallback: SuccessCallback = null;
	private abortCallback: AbortCallback = null;
}
