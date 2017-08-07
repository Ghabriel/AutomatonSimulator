import {Controller, FormalDefinition} from "../../Controller"
import {Keyboard} from "../../Keyboard"
import {LBA} from "./LBA"
import {Prompt} from "../../Prompt"
import {State} from "../../interface/State"
import {Strings} from "../../Settings"

export class LBAController implements Controller {
	constructor() {
		this.machine = new LBA();
	}

	public edgePrompt(callback: (data: string[], text: string) => void,
					  fallback?: () => void): void {
		let self = this;
		let prompt = new Prompt(Strings.LBA_ENTER_EDGE_CONTENT);
		prompt.addInput({
			placeholder: Strings.LBA_ENTER_EDGE_PLACEHOLDER_1
		});

		prompt.addInput({
			placeholder: Strings.LBA_ENTER_EDGE_PLACEHOLDER_2
		});

		prompt.addInput({
			placeholder: Strings.LBA_ENTER_EDGE_PLACEHOLDER_3
		});

		prompt.onSuccess(function(data) {
			callback(data, self.edgeDataToText(data));
		});

		prompt.onAbort(fallback);

		prompt.show();
	}

	public edgeDataToText(data: string[]): string {
		let epsilon = Keyboard.symbols.epsilon;
		let formatted = [
			data[0] || epsilon,
			data[1] || epsilon,
			(data[2] == "<") ? "←" : "→"
		];
		return formatted[0] + ", " + formatted[1] + ", " + formatted[2];
	}

	public createState(state: State): void {
		let name = state.getName();
		let index = this.machine.addState(name);
		this.stateMapping[name] = index;

		if (state.isInitial()) {
			this.machine.setInitialState(index);
		}

		if (state.isFinal()) {
			this.machine.addAcceptingState(index);
		}

		this.editingCallback();
	}

	public createEdge(origin: State, target: State, data: string[]): void {
		let indexOrigin = this.index(origin);
		let indexTarget = this.index(target);
		this.machine.addTransition(indexOrigin, indexTarget, data);
		this.editingCallback();
	}

	public changeInitialFlag(state: State): void {
		if (state.isInitial()) {
			this.machine.setInitialState(this.index(state));
		} else {
			this.machine.unsetInitialState();
		}

		this.editingCallback();
	}

	public changeFinalFlag(state: State): void {
		let index = this.index(state);
		if (state.isFinal()) {
			this.machine.addAcceptingState(index);
		} else {
			this.machine.removeAcceptingState(index);
		}

		this.editingCallback();
	}

	public renameState(state: State, newName: string): void {
		let index = this.index(state);
		delete this.stateMapping[state.getName()];
		this.stateMapping[newName] = index;
		this.machine.renameState(index, newName);
		this.editingCallback();
	}

	public deleteState(state: State): void {
		this.machine.removeState(this.index(state));
		this.editingCallback();
	}

	public deleteEdge(origin: State, target: State, data: string[]): void {
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
			result.push(state);
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
		// values[delta] = this.transitionTable();
		values[delta] = { list: [] }; // TODO
		values["q0"] = machine.getInitialState();
		values["B"] = "_";
		values["F"] = machine.getAcceptingStates();

		return result;
	}

	public setEditingCallback(callback: () => void): void {
		this.editingCallback = callback;
	}

	private index(state: State): number {
		return this.stateMapping[state.getName()];
	}

	private machine: LBA;
	private stateMapping: {[name: string]: number} = {};
	private stepIndex: number = -1;
	private editingCallback: () => void = function() {};
}
