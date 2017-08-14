import {Controller, FormalDefinition} from "../../Controller"
import {FA} from "./FA"
import {Keyboard} from "../../Keyboard"
import {Prompt} from "../../Prompt"
import {State} from "../../interface/State"
import {Strings} from "../../Settings"
import {utils} from "../../Utils"

export class FAController implements Controller {
	constructor() {
		this.machine = new FA();
	}

	public edgePrompt(callback: (data: string[], text: string) => void,
					  fallback?: () => void): void {

		let self = this;
		let prompt = new Prompt(Strings.FA_ENTER_EDGE_CONTENT);

		prompt.addInput({
			placeholder: Strings.FA_ENTER_EDGE_PLACEHOLDER_1,
			validator: utils.optionalSymbolValidator
		});

		prompt.onSuccess(function(data) {
			callback(data, self.edgeDataToText(data));
		});

		prompt.onAbort(fallback);

		prompt.show();
	}

	public edgeDataToText(data: string[]): string {
		let epsilon = Keyboard.symbols.epsilon;
		return data[0] || epsilon;
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
		let edgeText = this.edgeDataToText(data);
		// Ensures that epsilon transitions are handled properly
		if (!data[0]) {
			edgeText = "";
		}
		this.machine.addTransition(indexOrigin, indexTarget, edgeText);
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
		let edgeText = this.edgeDataToText(data);
		this.machine.removeTransition(indexOrigin, indexTarget, edgeText);
		this.editingCallback();
	}

	public clear(): void {
		this.machine.clear();
		this.editingCallback();
	}

	public fastForward(input: string): void {
		this.machine.reset();
		for (let i = 0; i < input.length; i++) {
			this.machine.read(input[i]);
		}
	}

	public step(input: string): void {
		if (!this.finished(input)) {
			if (this.stepIndex == -1) {
				// Don't parse anything if stepIndex == -1.
				// This case is used to allow the interface
				// to show the initial state(s) of the automaton.
				this.machine.reset();
			} else {
				let symbol = input[this.stepIndex];
				this.machine.read(symbol);
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
		return this.stepIndex >= input.length;
	}

	public isStopped(): boolean {
		return this.stepIndex == -1;
	}

	public stepPosition(): number {
		return this.stepIndex;
	}

	public currentStates(): string[] {
		return this.machine.getCurrentStates();
	}

	public accepts(): boolean {
		return this.machine.accepts();
	}

	public formalDefinition(): FormalDefinition {
		let machine = this.machine;
		let delta = Keyboard.symbols.delta;
		let sigma = Keyboard.symbols.sigma;
		let result: FormalDefinition = {
			tupleSequence: ["Q", sigma, delta, "q0", "F"],
			parameterSequence: ["Q", sigma, "q0", "F", delta],
			parameterValues: {}
		};

		let values = result.parameterValues;
		values["Q"] = machine.getStates();
		values[sigma] = machine.alphabet();
		values[delta] = this.transitionTable();
		values["q0"] = machine.getInitialState();
		values["F"] = machine.getAcceptingStates();

		return result;
	}

	public setEditingCallback(callback: () => void): void {
		this.editingCallback = callback;
	}

	private index(state: State): number {
		return this.stateMapping[state.getName()];
	}

	private transitionTable(): any {
		let symbols = Keyboard.symbols;
		let epsilon = symbols.epsilon;
		let sigma = symbols.sigma;

		let transitions = {
			header: [
				"Q",
				sigma + " ∪ {" + epsilon + "}",
				"Q"
			],
			list: []
		};

		let callback = function(source: string, target: string, input: string) {
			input = input || Keyboard.symbols.epsilon;
			transitions.list.push([source, input, target]);
		};

		this.machine.transitionIteration(callback);
		return transitions;
	}

	private machine: FA;
	private stateMapping: {[name: string]: number} = {};
	private stepIndex: number = -1;
	private editingCallback: () => void = function() {};
}
