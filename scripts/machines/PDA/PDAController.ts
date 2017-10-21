/// <reference path="../../types.ts" />

import {Controller, FormalDefinition, Operation, TransitionTable} from "../../Controller"
import {AcceptingHeuristic, ActionInformation, PDA, TransitionInformation} from "./PDA"
import {Keyboard} from "../../Keyboard"
import {Prompt} from "../../Prompt"
import {Strings} from "../../Settings"
import {utils} from "../../Utils"

export class PDAController implements Controller {
	constructor() {
		this.machine = new PDA();
	}

	public edgePrompt(callback: (data: string[], text: string) => void,
					  fallback?: () => void): Prompt {

		let prompt = new Prompt(Strings.PDA_ENTER_EDGE_CONTENT);

		// read (input)
		prompt.addInput({
			placeholder: Strings.PDA_ENTER_EDGE_PLACEHOLDER_1,
			validator: utils.optionalSymbolValidator
		});

		// read (stack)
		prompt.addInput({
			placeholder: Strings.PDA_ENTER_EDGE_PLACEHOLDER_2,
			validator: utils.singleSymbolValidator
		});

		// write (stack)
		prompt.addInput({
			placeholder: Strings.PDA_ENTER_EDGE_PLACEHOLDER_3
		});

		prompt.onSuccess((data) => {
			callback(data, this.edgeDataToText(data));
		});

		prompt.onAbort(fallback);

		return prompt;
	}

	public edgeDataToText(data: string[]): string {
		let epsilon = Keyboard.symbols.epsilon;
		let input = data[0] || epsilon;
		let stackRead = data[1] || epsilon;
		let stackWrite = data[2] || epsilon;
		return input + "," + stackRead + " → " + stackWrite;
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
		this.input = input;
		this.machine.reset();
		this.machine.setInput(input);
		while (!this.machine.halted()) {
			this.machine.read();
		}
	}

	public step(input: string): void {
		this.input = input;
		if (!this.finished(input)) {
			if (this.stepIndex == -1) {
				// Don't parse anything if stepIndex == -1.
				// This case is used to allow the interface
				// to show the initial state(s) of the automaton.
				this.machine.reset();
				this.machine.setInput(input);
			} else {
				this.machine.read();
			}
			this.stepIndex++;
		}
	}

	public stop(): void {
		this.input = null;
		this.stepIndex = -1;
	}

	public reset(): void {
		this.machine.reset();
	}

	public finished(input: string): boolean {
		return this.stepIndex >= 0 && this.machine.halted();
	}

	public isStopped(): boolean {
		return this.stepIndex == -1;
	}

	public stepPosition(): number {
		if (this.input === null) {
			return this.stepIndex;
		}

		let currentInput = this.machine.getCurrentInput();
		return this.input.length - currentInput.length;
	}

	public getStackContent(): string[] {
		return this.machine.getStackContent();
	}

	public getActionTree(): ActionInformation[] {
		return this.machine.getActionTree();
	}

	public setAcceptingHeuristic(heuristic: AcceptingHeuristic): void {
		this.machine.setAcceptingHeuristic(heuristic);
	}

	public getAcceptingHeuristic(): AcceptingHeuristic {
		return this.machine.getAcceptingHeuristic();
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

	public acceptedHeuristic(): AcceptingHeuristic|null {
		return this.machine.acceptedHeuristic();
	}

	public formalDefinition(): FormalDefinition {
		let machine = this.machine;
		let delta = Keyboard.symbols.delta;
		let gamma = Keyboard.symbols.gamma;
		let sigma = Keyboard.symbols.sigma;
		let result: FormalDefinition = {
			tupleSequence: ["Q", sigma, gamma, delta, "q0", "Z0", "F"],
			parameterSequence: ["Q", sigma, gamma, "q0", "Z0", "F", delta],
			parameterValues: {}
		};

		let values = result.parameterValues;
		values["Q"] = machine.getStates();
		values[sigma] = machine.getInputAlphabet();
		values[gamma] = machine.getStackAlphabet();
		values[delta] = this.transitionTable();
		values["q0"] = machine.getInitialState();
		values["Z0"] = "$";
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

	private transitionTable(): any {
		let symbols = Keyboard.symbols;
		let epsilon = symbols.epsilon;
		let gamma = symbols.gamma;
		let sigma = symbols.sigma;

		let fields = [
			"Q",
			sigma + " ∪ {" + epsilon + "}",
			gamma,
			"Q",
			gamma + "*"
		];

		let transitions: TransitionTable = {
			domain: utils.cartesianProduct(fields[0], "(" + fields[1] + ")", fields[2]),
			codomain: utils.cartesianProduct(fields[3], fields[4]),
			header: fields,
			list: [],
			metadata: []
		};

		let callback = function(source: string, data: TransitionInformation,
								input: string, stackRead: string) {
			let epsilon = Keyboard.symbols.epsilon;
			let [target, stackWrite] = data;

			transitions.list.push([
				source,
				input || epsilon,
				stackRead || epsilon,
				target,
				stackWrite || epsilon
			]);

			transitions.metadata.push([
				source,
				target,
				[input, stackRead, stackWrite]
			]);
		};

		this.machine.transitionIteration(callback);
		return transitions;
	}

	private machine: PDA;
	private stateMapping: {[name: string]: number} = {};
	private stepIndex: number = -1;
	private input: string|null = null;
	private editingCallback: () => void = function() {};
}
