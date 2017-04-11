import {Controller, FormalDefinition} from "./Controller"
import {FA} from "../machines/FA"
import {State} from "../interface/State"
import {Strings} from "../Settings"
import {utils} from "../Utils"

export class FAController implements Controller {
	constructor() {
		this.machine = new FA();
	}

	public edgePrompt(callback: (data: string[], text: string) => void,
					  fallback?: () => void): void {

		let self = this;
		utils.prompt(Strings.FA_ENTER_EDGE_CONTENT, 1, function(data) {
			callback(data, self.edgeDataToText(data));
		}, fallback);
	}

	public edgeDataToText(data: string[]): string {
		let epsilon = "ε";
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
	}

	public createEdge(origin: State, target: State, data: string[]): void {
		let indexOrigin = this.index(origin);
		let indexTarget = this.index(target);
		let edgeText = this.edgeDataToText(data);
		this.machine.addTransition(indexOrigin, indexTarget, edgeText);
	}

	public changeInitialFlag(state: State): void {
		if (state.isInitial()) {
			this.machine.setInitialState(this.index(state));
		} else {
			this.machine.unsetInitialState();
		}
	}

	public changeFinalFlag(state: State): void {
		let index = this.index(state);
		if (state.isFinal()) {
			this.machine.addAcceptingState(index);
		} else {
			this.machine.removeAcceptingState(index);
		}
	}

	public deleteState(state: State): void {
		this.machine.removeState(this.index(state));
	}

	public deleteEdge(origin: State, target: State, data: string[]): void {
		let indexOrigin = this.index(origin);
		let indexTarget = this.index(target);
		let edgeText = this.edgeDataToText(data);
		this.machine.removeTransition(indexOrigin, indexTarget, edgeText);
	}

	public clear(): void {
		this.machine.clear();
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
		return this.machine.getStates();
	}

	public accepts(): boolean {
		return this.machine.accepts();
	}

	public formalDefinition(): FormalDefinition {
		// TODO: use the actual symbols
		let machine = this.machine;
		let result: FormalDefinition = {
			parameterSequence: ["Q", "Sigma", "Delta", "q0", "F"],
			parameterValues: {
				"Q": machine.getStates(),
				"Sigma": machine.alphabet(),
				"Delta": "TODO",
				"q0": machine.getInitialState(),
				"F": machine.getAcceptingStates()
			}
		};

		return result;
	}

	private index(state: State): number {
		return this.stateMapping[state.getName()];
	}

	private machine: FA;
	private stateMapping: {[name: string]: number} = {};
	private stepIndex: number = -1;
}
