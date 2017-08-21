import {Queue} from "../../datastructures/Queue"
import {UnorderedSet} from "../../datastructures/UnorderedSet"
import {utils} from "../../Utils"

type State = string;
type Index = number;
type Alphabet = {[i: string]: number};
type InternalTransitionInformation = [Index, string][];
export type TransitionInformation = [State, string];

let EPSILON_KEY = "";

export class PDA {
	// Adds a state to this PDA, marking it as the initial state
	// if there are no other states in this PDA.
	public addState(name: State): Index {
		this.stateList.push(name);
		// Cannot use this.numStates() here because
		// removed states are kept in the list
		let index = this.realNumStates() - 1;
		this.transitions[index] = {};
		if (this.initialState == -1) {
			this.initialState = index;
			this.reset();
		}
		return index;
	}

	// Removes a state from this PDA.
	public removeState(index: Index): void {
		let self = this;
		utils.foreach(this.transitions, function(originIndex, transitions) {
			let origin = parseInt(originIndex);
			utils.foreach(transitions, function(input, indexedByStack) {
				utils.foreach(indexedByStack, function(stackRead, group) {
					let i = 0;
					while (i < group.length) {
						if (origin == index || group[i][0] == index) {
							// self.uncheckedRemoveTransition(origin, input, stackRead, i);
							group.splice(i, 1);
						} else {
							i++;
						}
					}
				});
			});
		});

		delete this.transitions[index];

		if (this.initialState == index) {
			this.unsetInitialState();
		}

		this.finalStates.erase(index);

		this.stateList[index] = undefined;
		this.numRemovedStates++;
	}

	// Renames a state of this PDA.
	public renameState(index: Index, newName: State): void {
		this.stateList[index] = newName;
	}

	// Adds a transition to this PDA.
	public addTransition(source: Index, target: Index, data: string[]): void {
		let transitions = this.transitions[source];
		let input = data[0];
		let stackRead = data[1];
		let stackWrite = data[2];

		if (!transitions.hasOwnProperty(input)) {
			transitions[input] = {};
		}

		if (!transitions[input].hasOwnProperty(stackRead)) {
			transitions[input][stackRead] = [];
		}

		transitions[input][stackRead].push([target, stackWrite]);

		this.addInputSymbol(input);
		this.addStackSymbol(stackRead);

		for (let i = 0; i < stackWrite.length; i++) {
			this.addStackSymbol(stackWrite[i]);
		}
	}

	// Removes a transition from this PDA.
	public removeTransition(source: Index, target: Index, data: string[]): void {
		let transitions = this.transitions[source];
		let input = data[0];
		let stackRead = data[1];
		let stackWrite = data[2];

		if (transitions.hasOwnProperty(input)) {
			if (transitions[input].hasOwnProperty(stackRead)) {
				let properties = transitions[input][stackRead];
				for (let i = 0; i < properties.length; i++) {
					let group = properties[i];
					if (group[0] == target && group[1] == stackWrite) {
						properties.splice(i, 1);
						break;
					}
				}
			}
		}
	}

	// private uncheckedRemoveTransition(source: Index, input: string): void {
	// 	let transitions = this.transitions[source];
	// 	let tapeSymbol = transitions[input].tapeSymbol;
	// 	delete transitions[input];

	// 	if (this.isInputSymbol(input)) {
	// 		this.removeInputSymbol(input);
	// 	}

	// 	if (this.isInputSymbol(tapeSymbol)) {
	// 		this.removeInputSymbol(tapeSymbol);
	// 	}

	// 	this.removeTapeSymbol(input);
	// 	this.removeTapeSymbol(tapeSymbol);
	// }

	// Sets the initial state of this PDA.
	public setInitialState(index: Index): void {
		if (index < this.realNumStates()) {
			this.initialState = index;
		}
	}

	// Unsets the initial state of this PDA.
	public unsetInitialState(): void {
		this.initialState = -1;
	}

	// Returns the name of the initial state.
	public getInitialState(): State {
		return this.stateList[this.initialState];
	}

	// Marks a state as final.
	public addAcceptingState(index: Index): void {
		this.finalStates.insert(index);
	}

	// Marks a state as non-final.
	public removeAcceptingState(index: Index): void {
		this.finalStates.erase(index);
	}

	// Returns all accepting states
	public getAcceptingStates(): State[] {
		let result: State[] = [];
		let self = this;
		this.finalStates.forEach(function(index) {
			result.push(self.stateList[index]);
		});
		return result;
	}

	// Returns the current state of this PDA.
	public getCurrentState(): State {
		return this.stateList[this.currentState];
	}

	// Returns a list containing all the states of this PDA.
	public getStates(): State[] {
		return this.stateList.filter(function(value) {
			return value !== undefined;
		});
	}

	// Executes a callback function for every transition of this PDA.
	public transitionIteration(callback: (source: State,
		data: TransitionInformation, input: string,
		stackRead: string) => void): void {

		let self = this;
		utils.foreach(this.transitions, function(index, stateTransitions) {
			utils.foreach(stateTransitions, function(input, indexedByStack) {
				utils.foreach(indexedByStack, function(stackRead, info) {
					let sourceState = self.stateList[index];
					for (let group of info) {
						let targetState = self.stateList[group[0]];
						callback(sourceState, [targetState, group[1]], input, stackRead);
					}
				});
			});
		});
	}

	// Returns the input alphabet of this PDA.
	public getInputAlphabet(): string[] {
		let result = [];
		for (let member in this.inputAlphabet) {
			if (this.inputAlphabet.hasOwnProperty(member)) {
				result.push(member);
			}
		}
		return result;
	}

	// Returns the stack alphabet of this PDA.
	public getStackAlphabet(): string[] {
		let result = [];
		for (let member in this.stackAlphabet) {
			if (this.stackAlphabet.hasOwnProperty(member)) {
				result.push(member);
			}
		}
		return result;
	}

	public getStackContent(): string[] {
		return this.stack;
	}

	public setInput(input: string): void {
		this.input = input;
		this.stack = ["$"];
	}

	// Reads a character from the input, triggering state changes to this PDA.
	public read(): void {
		if (this.error()) {
			return;
		}

		let error = true;
		let input = this.input[0];

		console.log("[INPUT]", this.input);
		console.log("[STACK]", this.stack);
		if (this.transitions.hasOwnProperty(this.currentState + "")) {
			let transitions = this.transitions[this.currentState];
			if (transitions.hasOwnProperty(input)) {
				let indexedByStack = transitions[input];
				let stackTop = this.stack[this.stack.length - 1];
				if (indexedByStack.hasOwnProperty(stackTop)) {
					let possibilities = indexedByStack[stackTop];
					// TODO: implement non-determinism
					this.currentState = possibilities[0][0];
					this.input = this.input.substr(1);
					this.stack.pop();

					let stackWrite = possibilities[0][1];
					for (let i = 0; i < stackWrite.length; i++) {
						this.stack.push(stackWrite[i]);
					}

					error = false;
				}
			}

			if (transitions.hasOwnProperty(EPSILON_KEY)) {
				let indexedByStack = transitions[EPSILON_KEY];
				let stackTop = this.stack[this.stack.length - 1];
				if (indexedByStack.hasOwnProperty(stackTop)) {
					let possibilities = indexedByStack[stackTop];
					// TODO: implement non-determinism
					this.currentState = possibilities[0][0];
					this.stack.pop();

					let stackWrite = possibilities[0][1];
					for (let i = 0; i < stackWrite.length; i++) {
						this.stack.push(stackWrite[i]);
					}

					error = false;
				}
			}
		}

		if (error) {
			// goes to the error state
			this.currentState = null;
			this.input = "";
		}
	}

	public halted(): boolean {
		return (this.input || "").length == 0;
	}

	// Resets this PDA, making it return to its initial state and
	// clearing its stack.
	public reset(): void {
		if (this.initialState == -1) {
			this.currentState = null;
		} else {
			this.currentState = this.initialState;
		}

		this.stack = [];
	}

	// Clears this PDA, making it effectively equal to new PDA().
	public clear(): void {
		this.stateList = [];
		this.inputAlphabet = {};
		this.stackAlphabet = {};
		this.transitions = {};
		this.unsetInitialState();
		this.finalStates.clear();
		this.numRemovedStates = 0;
		this.currentState = null;
		this.stack = [];
	}

	// Checks if this PDA accepts in its current state.
	public accepts(): boolean {
		return this.finalStates.contains(this.currentState);
	}

	// Checks if this PDA is in an error state, i.e. isn't in any state.
	public error(): boolean {
		return this.currentState === null;
	}

	// Returns the number of states of this PDA.
	public numStates(): number {
		return this.stateList.length - this.numRemovedStates;
	}

	private addSymbol(location: string, symbol: string): void {
		if (symbol.length > 0) {
			if (!this[location].hasOwnProperty(symbol)) {
				this[location][symbol] = 0;
			}
			this[location][symbol]++;
		}
	}

	private addInputSymbol(symbol: string): void {
		this.addSymbol("inputAlphabet", symbol);
	}

	private addStackSymbol(symbol: string): void {
		this.addSymbol("stackAlphabet", symbol);
	}

	public removeSymbol(location: string, symbol: string): void {
		if (symbol.length > 0) {
			this[location][symbol]--;
			if (this[location][symbol] == 0) {
				delete this[location][symbol];
			}
		}
	}

	private removeInputSymbol(symbol: string): void {
		this.removeSymbol("inputAlphabet", symbol);
	}

	private removeStackSymbol(symbol: string): void {
		this.removeSymbol("stackAlphabet", symbol);
	}

	// Returns the number of states that are being stored inside
	// this PDA (which counts removed states)
	private realNumStates(): number {
		return this.stateList.length;
	}

	private stateList: State[] = []; // Q
	private inputAlphabet: Alphabet = {}; // sigma
	private stackAlphabet: Alphabet = {}; // gamma
	private transitions: {
		[index: number]: {
			[inputSymbol: string]: {
				[stackSymbol: string]: InternalTransitionInformation
			}
		}
	} = {}; // delta (Q x sigma x gamma -> (Q x gamma*)+)
	private initialState: Index = -1; // q0
	private finalStates = new UnorderedSet<Index>(); // F

	private numRemovedStates: number = 0;

	// Instantaneous configuration-related attributes
	private currentState: Index = null;
	private stack: string[] = [];

	private input: string = null;
}
