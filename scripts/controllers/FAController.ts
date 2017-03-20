import {Controller} from "./Controller"
import {FA} from "../machines/FA"
import {State} from "../interface/State"
import {utils} from "../Utils"

export class FAController implements Controller {
	constructor() {
		this.machine = new FA();
		window["machine"] = this.machine;
	}

	public edgePrompt(origin: State,
					  target: State,
					  callback: (text: string) => void,
					  fallback: () => void): void {

		let self = this;
		utils.prompt("Enter the edge content:", 1, function(data) {
			let indexOrigin = self.index(origin);
			let indexTarget = self.index(target);
			self.machine.addTransition(indexOrigin, indexTarget, data[0]);
			callback(data[0]);
		}, fallback);
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

	public fastForward(input: string): void {
		this.machine.reset();
		for (let i = 0; i < input.length; i++) {
			this.machine.read(input[i]);
		}
	}

	public step(input: string): void {}

	public stop(): void {}

	public accepts(): boolean {
		return this.machine.accepts();
	}

	private index(state: State): number {
		return this.stateMapping[state.getName()];
	}

	private machine: FA;
	private stateMapping: {[name: string]: number} = {};
}
