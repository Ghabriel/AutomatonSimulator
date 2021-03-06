import {UnorderedSet} from "../../datastructures/UnorderedSet"
import {utils} from "../../Utils"

type State = string;
type Index = number;
type Alphabet = {[i: string]: number};
type GammaClosure = string;
type InternalTransitionInformation = [Index, GammaClosure][];
export type TransitionInformation = [State, GammaClosure];

type SymbolLocation = "inputAlphabet" | "stackAlphabet";

interface BaseAction {
	stepIndex: number;
	currentInput: string;
	currentStack: string[];
	inputRead: string;
	stackWrite: string;
}

interface Action extends BaseAction {
	targetState: Index;
}

export interface ActionInformation extends BaseAction {
	targetState: State;
}

export enum AcceptingHeuristic {
	NEVER = 0,
	ACCEPTING_STATE = 1,
	EMPTY_STACK = 2,
	BOTH = ACCEPTING_STATE | EMPTY_STACK
}

const EPSILON_KEY = "";

export class PDA {
	public setAcceptingHeuristic(heuristic: AcceptingHeuristic): void {
		this.acceptingHeuristic = heuristic;
	}

	public getAcceptingHeuristic(): AcceptingHeuristic {
		return this.acceptingHeuristic;
	}

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
		this.removeEdgesOfState(index);

		if (this.initialState == index) {
			this.unsetInitialState();
		}

		this.finalStates.erase(index);

		this.stateList[index] = undefined;
		delete this.transitions[index];
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
		let stackWrite = data[2].split("").reverse().join("");

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
		let stackWrite = data[2].split("").reverse().join("");

		if (!transitions.hasOwnProperty(input)) {
			return;
		}

		if (!transitions[input].hasOwnProperty(stackRead)) {
			return;
		}

		let properties = transitions[input][stackRead];
		for (let i = 0; i < properties.length; i++) {
			let group = properties[i];
			if (group[0] == target && group[1] == stackWrite) {
				// properties.splice(i, 1);
				this.uncheckedRemoveTransition(source, input, stackRead, i);
				break;
			}
		}
	}

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
	public getInitialState(): State|undefined {
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
			result.push(self.stateList[index]!);
		});
		return result;
	}

	// Returns the current state of this PDA.
	public getCurrentState(): State|undefined {
		if (this.currentState === null) {
			return undefined;
		}

		return this.stateList[this.currentState];
	}

	// Returns a list containing all the states of this PDA.
	public getStates(): State[] {
		return (<State[]> this.stateList).filter(function(value) {
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
					let sourceState = self.stateList[parseInt(index)]!;
					for (let group of info) {
						let targetState = self.stateList[group[0]]!;
						let stackWrite = group[1].split("").reverse().join("");
						callback(sourceState, [targetState, stackWrite], input, stackRead);
					}
				});
			});
		});
	}

	// Returns the input alphabet of this PDA.
	public getInputAlphabet(): string[] {
		let result: string[] = [];
		for (let member in this.inputAlphabet) {
			if (this.inputAlphabet.hasOwnProperty(member)) {
				result.push(member);
			}
		}
		return result;
	}

	// Returns the stack alphabet of this PDA.
	public getStackAlphabet(): string[] {
		let result: string[] = [];
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
		this.stepIndex = 0;
		this.actionTree = this.getPossibleActions();
		this.halt = false;
	}

	public getCurrentInput(): string {
		return this.input;
	}

	public getActionTree(): ActionInformation[] {
		let result: ActionInformation[] = [];
		for (let action of this.actionTree) {
			result.push({
				stepIndex: action.stepIndex,
				currentInput: action.currentInput,
				currentStack: action.currentStack,
				inputRead: action.inputRead,
				stackWrite: action.stackWrite,
				targetState: this.stateList[action.targetState]!
			});
		}

		return result;
	}

	// Reads a character from the input, triggering state changes to this PDA.
	public read(): void {
		if (this.error()) {
			this.halt = true;
			return;
		}

		let actionTree = this.actionTree;

		// makes it possible for PDAs to accept empty strings
		if (this.input.length == 0 && this.accepts()) {
			this.halt = true;
			return;
		}

		if (actionTree.length == 0) {
			// goes to the error state
			this.currentState = null;
			this.input = "";
			this.halt = true;
			return;
		}

		let nextAction = actionTree[actionTree.length - 1];

		// if (nextAction.stepIndex <= this.stepIndex) {
		// 	console.log("[BACKTRACK]");
		// }

		this.processAction(nextAction);
		this.actionTree.pop();
		this.halt = false;

		let possibleActions = this.getPossibleActions();
		this.actionTree.push(...possibleActions);

		let imminentBacktracking = (possibleActions.length == 0);
		if (imminentBacktracking && this.input.length == 0 && this.accepts()) {
			// prevent backtracking on the next call to read()
			// since we found an accepting branch
			this.halt = true;
		}
	}

	public halted(): boolean {
		return this.halt;
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
		this.stepIndex = 0;
		this.actionTree = [];
		this.halt = true;
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
		this.stepIndex = 0;
		this.actionTree = [];
		this.halt = true;
	}

	// Checks if this PDA accepts in its current state.
	public accepts(): boolean {
		if (this.currentState === null) {
			return false;
		}

		let result: boolean = false;
		if (this.acceptingHeuristic & AcceptingHeuristic.ACCEPTING_STATE) {
			result = result || this.finalStates.contains(this.currentState);
		}

		if (this.acceptingHeuristic & AcceptingHeuristic.EMPTY_STACK) {
			result = result || (this.stack.length == 0);
		}

		return result;
	}

	public acceptedHeuristic(): AcceptingHeuristic|null {
		if (this.currentState === null) {
			return null;
		}

		let result: AcceptingHeuristic = AcceptingHeuristic.NEVER;
		if (this.acceptingHeuristic & AcceptingHeuristic.ACCEPTING_STATE) {
			if (this.finalStates.contains(this.currentState)) {
				result |= AcceptingHeuristic.ACCEPTING_STATE;
			}
		}

		if (this.acceptingHeuristic & AcceptingHeuristic.EMPTY_STACK) {
			if (this.stack.length == 0) {
				result |= AcceptingHeuristic.EMPTY_STACK;
			}
		}

		return result == AcceptingHeuristic.NEVER ? null : result;
	}

	// Checks if this PDA is in an error state, i.e. isn't in any state.
	public error(): boolean {
		return this.currentState === null;
	}

	// Returns the number of states of this PDA.
	public numStates(): number {
		return this.stateList.length - this.numRemovedStates;
	}

	private uncheckedRemoveTransition(source: Index, input: string,
		stackRead: string, index: number): void {

		let groups = this.transitions[source][input][stackRead];
		let stackWrite = groups[index][1];

		this.removeInputSymbol(input);
		this.removeStackSymbol(stackRead);

		for (let i = 0; i < stackWrite.length; i++) {
			this.removeStackSymbol(stackWrite[i]);
		}

		groups.splice(index, 1);
	}

	private removeEdgesOfState(index: Index): void {
		utils.foreach(this.transitions, (originIndex, transitions) => {
			let origin = parseInt(originIndex);

			utils.foreach(transitions, (input, indexedByStack) => {
				utils.foreach(indexedByStack, (stackRead, group) => {
					let i = 0;
					while (i < group.length) {
						if (origin == index || group[i][0] == index) {
							this.uncheckedRemoveTransition(origin, input, stackRead, i);
							// group.splice(i, 1);
						} else {
							i++;
						}
					}
				});
			});
		});
	}

	private getPossibleActions(): Action[] {
		let result: Action[] = [];

		if (this.input.length > 0) {
			this.handleInputSymbol(this.input[0], result);
		}

		this.handleInputSymbol(EPSILON_KEY, result);

		return result;
	}

	private handleInputSymbol(inputSymbol: string, buffer: Action[]): void {
		if (this.currentState === null) {
			return;
		}

		let availableTransitions = this.transitions[this.currentState];
		if (!availableTransitions.hasOwnProperty(inputSymbol)) {
			return;
		}

		let indexedByStack = availableTransitions[inputSymbol];
		// TODO: handle empty stack
		let stackTop = this.stack[this.stack.length - 1];
		if (!indexedByStack.hasOwnProperty(stackTop)) {
			return;
		}

		let groups = indexedByStack[stackTop];
		for (let group of groups) {
			buffer.push({
				stepIndex: this.stepIndex + 1,
				currentInput: this.input,
				currentStack: utils.clone(this.stack),
				inputRead: inputSymbol,
				stackWrite: group[1],
				targetState: group[0]
			});
		}
	}

	private processAction(action: Action): void {
		this.stepIndex = action.stepIndex;
		this.input = action.currentInput;
		this.stack = action.currentStack;

		if (action.inputRead != EPSILON_KEY) {
			this.input = this.input.slice(1);
		}

		this.stack.pop();

		for (let i = 0; i < action.stackWrite.length; i++) {
			this.stack.push(action.stackWrite[i]);
		}

		this.currentState = action.targetState;
	}

	private addSymbol(location: SymbolLocation, symbol: string): void {
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

	public removeSymbol(location: SymbolLocation, symbol: string): void {
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

	private stateList: (State|undefined)[] = []; // Q
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
	private currentState: Index|null = null;
	private stack: string[] = [];

	private input: string;
	private stepIndex: number;
	private actionTree: Action[] = [];
	private halt: boolean = true;

	private acceptingHeuristic = AcceptingHeuristic.ACCEPTING_STATE;
}
