/// <reference path="../../types.ts" />

import {Controller, FormalDefinition, Operation, TransitionTable} from "../../Controller"
import {Keyboard} from "../../Keyboard"
import {LBA, TransitionInformation} from "./LBA"
import {Prompt} from "../../Prompt"
import {Strings} from "../../Settings"
import {utils} from "../../Utils"

export class LBAController implements Controller {
	constructor() {
		this.machine = new LBA();
	}

	public edgePrompt(callback: (data: string[], text: string) => void,
					  fallback?: () => void): Prompt {

		let prompt = new Prompt(Strings.LBA_ENTER_EDGE_CONTENT);

		// read
		prompt.addInput({
			placeholder: Strings.LBA_ENTER_EDGE_PLACEHOLDER_1,
			validator: utils.singleSymbolValidator
		});

		// write
		prompt.addInput({
			placeholder: Strings.LBA_ENTER_EDGE_PLACEHOLDER_2,
			validator: utils.singleSymbolValidator
		});

		// move direction
		prompt.addInput({
			initializer: function() {
				let node = utils.create("select");

				node.appendChild(utils.create("option", {
					innerHTML: Keyboard.symbols.leftArrow,
					value: "<"
				}));

				node.appendChild(utils.create("option", {
					innerHTML: Keyboard.symbols.rightArrow,
					value: ">"
				}));

				return node;
			}
		});

		prompt.onSuccess((data) => {
			callback(data, this.edgeDataToText(data));
		});

		prompt.onAbort(fallback);

		return prompt;
	}

	public edgeDataToText(data: string[]): string {
		let symbols = Keyboard.symbols;
		let epsilon = symbols.epsilon;
		let formatted = [
			data[0] || epsilon,
			data[1] || epsilon,
			(data[2] == "<") ? symbols.leftArrow : symbols.rightArrow
		];
		return formatted[0] + ", " + formatted[1] + ", " + formatted[2];
	}

	public createState(state: State): void {
		let name = state.name;
		let index = this.machine.addState(name);
		this.stateMapping[name] = index;

		if (state.initial) {
			this.machine.setInitialState(index);
		}

		if (state.final) {
			this.machine.addAcceptingState(index);
		}

		this.editingCallback();
	}

	public createTransition(origin: State, target: State, data: string[]): void {
		let indexOrigin = this.index(origin);
		let indexTarget = this.index(target);
		this.machine.addTransition(indexOrigin, indexTarget, data);
		this.editingCallback();
	}

	public changeInitialFlag(state: State): void {
		if (state.initial) {
			this.machine.setInitialState(this.index(state));
		} else {
			this.machine.unsetInitialState();
		}

		this.editingCallback();
	}

	public changeFinalFlag(state: State): void {
		let index = this.index(state);
		if (state.final) {
			this.machine.addAcceptingState(index);
		} else {
			this.machine.removeAcceptingState(index);
		}

		this.editingCallback();
	}

	public renameState(state: State, newName: string): void {
		let index = this.index(state);
		delete this.stateMapping[state.name];
		this.stateMapping[newName] = index;
		this.machine.renameState(index, newName);
		this.editingCallback();
	}

	public deleteState(state: State): void {
		this.machine.removeState(this.index(state));
		this.editingCallback();
	}

	public deleteTransition(origin: State, target: State, data: string[]): void {
		let indexOrigin = this.index(origin);
		let indexTarget = this.index(target);
		this.machine.removeTransition(indexOrigin, indexTarget, data);
		this.editingCallback();
	}

	public clear(): void {
		this.machine.clear();
		this.editingCallback();
	}

	public fastForward(input: string): void {
		this.machine.reset();
		this.machine.setTapeContent(input.split(""));
		while (!this.finished(input)) {
			this.machine.read();
		}
	}

	public step(input: string): void {
		if (!this.finished(input)) {
			if (this.stepIndex == -1) {
				// Don't parse anything if stepIndex == -1.
				// This case is used to allow the interface
				// to show the initial state(s) of the automaton.
				this.machine.reset();
				this.machine.setTapeContent(input.split(""));
			} else {
				this.machine.read();
			}
			this.stepIndex++;
		}
	}

	public stop(): void {
		this.stepIndex = -1;
	}

	public reset(): void {
		this.machine.reset();
	}

	public finished(input: string): boolean {
		return this.machine.halted();
	}

	public isStopped(): boolean {
		return this.stepIndex == -1;
	}

	public stepPosition(): number {
		return this.stepIndex;
	}

	public getTapeContent(): string[] {
		// return "abcdefghijklmnopqrstuvwxyz";
		return this.machine.getTapeContent();
	}

	public getHeadPosition(): number {
		// return 0;
		return this.machine.getHeadPosition();
	}

	public currentStates(): string[] {
		let state = this.machine.getCurrentState();
		let result: string[] = [];

		if (!this.machine.error()) {
			result.push(state!);
		}

		return result;
	}

	public accepts(): boolean {
		return this.machine.accepts();
	}

	public exhausted(): boolean {
		return this.machine.exhausted();
	}

	public formalDefinition(): FormalDefinition {
		let machine = this.machine;
		let delta = Keyboard.symbols.delta;
		let gamma = Keyboard.symbols.gamma;
		let sigma = Keyboard.symbols.sigma;
		let result: FormalDefinition = {
			tupleSequence: ["Q", sigma, gamma, delta, "q0", "B", "F"],
			parameterSequence: ["Q", sigma, gamma, "q0", "B", "F", delta],
			parameterValues: {}
		};

		let values = result.parameterValues;
		values["Q"] = machine.getStates();
		values[sigma] = machine.getInputAlphabet();
		values[gamma] = machine.getTapeAlphabet();
		values[delta] = this.transitionTable();
		values["q0"] = machine.getInitialState();
		values["B"] = "_";
		values["F"] = machine.getAcceptingStates();

		return result;
	}

	public setEditingCallback(callback: () => void): void {
		this.editingCallback = callback;
	}

	public applyOperation(operation: Operation): void {}

	private index(state: State): number {
		return this.stateMapping[state.name];
	}

	private transitionTable(): TransitionTable {
		let {gamma, leftArrow, rightArrow} = Keyboard.symbols;

		let fields = [
			"Q",
			gamma,
			"Q",
			gamma,
			"{" + leftArrow + "," + rightArrow + "}"
		];

		let transitions: TransitionTable = {
			domain: utils.cartesianProduct(fields[0], fields[1]),
			codomain: utils.cartesianProduct(fields[2], fields[3], fields[4]),
			header: fields,
			list: [],
			metadata: []
		};

		let arrows = [leftArrow, rightArrow];
		let dataArrows = ["<", ">"];

		let callback = function(source: string, target: TransitionInformation,
								input: string) {
			transitions.list.push([
				source,
				input,
				target.state,
				target.tapeSymbol,
				arrows[target.direction]
			]);

			transitions.metadata.push([
				source,
				target.state,
				[input, target.tapeSymbol, dataArrows[target.direction]]
			]);
		};
		this.machine.transitionIteration(callback);
		return transitions;
	}

	private machine: LBA;
	private stateMapping: {[name: string]: number} = {};
	private stepIndex: number = -1;
	private editingCallback: () => void = function() {};
}
