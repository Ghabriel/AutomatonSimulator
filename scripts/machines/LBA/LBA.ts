/// <reference path="helpers/types.ts" />

import {Queue} from "../../datastructures/Queue"
import {UnorderedSet} from "../../datastructures/UnorderedSet"
import {utils} from "../../Utils"
import {Tape} from "./helpers/Tape"

type State = string;
type Index = number;
type Alphabet = {[i: string]: number};

type SymbolLocation = "inputAlphabet" | "tapeAlphabet";

interface InternalTransitionInformation {
	state: Index,
	tapeSymbol: string,
	direction: Direction
}

export interface TransitionInformation {
	state: State,
	tapeSymbol: string,
	direction: Direction
}

interface BaseAction {
	currentTape: JSONData<TapeJSONFields>;
	calculationSteps: number;
	tapeWrite: string;
	moveDirection: Direction;
	stepIndex: number;
}

interface Action extends BaseAction {
	targetState: Index;
}

interface ActionInformation extends BaseAction {
	targetState: State;
}


const EPSILON_KEY = "";

export class LBA {
	constructor() {
		this.tape = new Tape();
		this.tape.setBoundarySymbols("_");
	}

	// Adds a state to this LBA, marking it as the initial state
	// if there are no other states in this LBA.
	public addState(name: State): Index {
		let index = this.nextIndex();

		this.stateList[index] = name;

		if (this.initialState == -1) {
			this.initialState = index;
			this.reset();
		}

		return index;
	}

	// Removes a state from this LBA.
	public removeState(index: Index): void {
		this.removeEdgesOfState(index);

		if (this.initialState === index) {
			this.unsetInitialState();
		}

		this.finalStates.erase(index);

		delete this.stateList[index];
		delete this.transitions[index];
	}

	// Renames a state of this LBA.
	public renameState(index: Index, newName: State): void {
		this.stateList[index] = newName;
	}

	// Adds a transition to this LBA.
	public addTransition(source: Index, target: Index, data: string[]): void {
		let [read, write] = data;
		let direction = this.plainTextToDirection(data[2]);

		// let transitions = this.transitions[source];
		let transitions = this.transitions;
		if (!transitions.hasOwnProperty(source.toString())) {
			transitions[source] = {};
		}

		if (!transitions[source].hasOwnProperty(read)) {
			transitions[source][read] = [];
		}

		transitions[source][read].push({
			state: target,
			tapeSymbol: write,
			direction: direction
		});

		if (this.isInputSymbol(read)) {
			this.addInputSymbol(read);
		}

		if (this.isInputSymbol(write)) {
			this.addInputSymbol(write);
		}

		this.addTapeSymbol(read);
		this.addTapeSymbol(write);
	}

	// Removes a transition from this LBA.
	public removeTransition(source: Index, target: Index, data: string[]): void {
		let [read, write] = data;
		let direction = this.plainTextToDirection(data[2]);

		let transitions = this.transitions;
		if (!transitions.hasOwnProperty(source.toString())) {
			return;
		}

		if (!transitions[source].hasOwnProperty(read)) {
			return;
		}

		let indexedByInput = transitions[source][read];

		let i = 0;
		while (i < indexedByInput.length) {
			let properties = indexedByInput[i];

			let matches = (properties.state == target);
			matches = matches && (properties.tapeSymbol == write);
			matches = matches && (properties.direction == direction);

			if (matches) {
				this.uncheckedRemoveTransition(source, read, i);
			} else {
				i++;
			}
		}
	}

	// Sets the initial state of this LBA.
	public setInitialState(index: Index): void {
		if (this.stateList.hasOwnProperty(index.toString())) {
			this.initialState = index;
		}
	}

	// Unsets the initial state of this LBA.
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

		this.finalStates.forEach((index) => {
			result.push(this.stateList[index]);
		});

		return result;
	}

	// Returns the current state of this LBA.
	public getCurrentState(): State|undefined {
		if (this.currentState === null) {
			return undefined;
		}

		return this.stateList[this.currentState];
	}

	// Returns a list containing all the states of this LBA.
	public getStates(): State[] {
		let result: State[] = [];

		utils.foreach(this.stateList, (index, value) => {
			result.push(value);
		});

		return result;
	}

	// Executes a callback function for every transition of this LBA.
	public transitionIteration(callback: (source: State,
		data: TransitionInformation, input: string) => void): void {

		utils.foreach(this.transitions, (index, stateTransitions) => {
			let sourceState = this.stateList[parseInt(index)];

			utils.foreach(stateTransitions, (input, transitions) => {
				for (let internalInfo of transitions) {
					let info: TransitionInformation = {
						state: this.stateList[internalInfo.state]!,
						tapeSymbol: internalInfo.tapeSymbol,
						direction: internalInfo.direction
					};

					callback(sourceState, info, input);
				}
			});
		});
	}

	// Returns the input alphabet of this LBA.
	public getInputAlphabet(): string[] {
		let result: string[] = [];

		utils.foreach(this.inputAlphabet, (member) => {
			result.push(member);
		});

		return result;
	}

	// Returns the tape alphabet of this LBA.
	public getTapeAlphabet(): string[] {
		let result: string[] = [];

		utils.foreach(this.tapeAlphabet, (member) => {
			result.push(member);
		});

		return result;
	}

	public setTapeContent(input: string[]): void {
		this.tape.setContent(input);
		this.calculationSteps = 0;
		this.inputLength = input.length;
		this.actionTree = this.getPossibleActions();
		this.halt = false;
		this.accepting = false;
	}

	public getTapeContent(): string[] {
		return this.tape.toArray();
	}

	public getHeadPosition(): number {
		return this.tape.getHeadPosition();
	}

	// Reads a character from the tape, triggering state changes to this LBA.
	public read(): void {
		if (this.halted()) {
			return;
		}

		let actionTree = this.actionTree;
		let finished = true;

		if (actionTree.length > 0) {
			let nextAction = actionTree[actionTree.length - 1];

			this.processAction(nextAction);
			this.actionTree.pop();
			this.halt = false;

			let possibleActions = this.getPossibleActions();
			this.actionTree.push(...possibleActions);

			let imminentBacktracking = (possibleActions.length == 0);
			finished = (imminentBacktracking && this.accepts());
		}

		if (this.exhausted()) {
			finished = true;
		}

		if (finished) {
			this.halt = true;

			if (this.accepts()) {
				// continues to accept if it's currently accepting
				this.accepting = true;
			} else {
				// goes to the error state
				this.currentState = null;
			}
		}
	}

	private processAction(action: Action): void {
		this.tape.load(action.currentTape);
		this.calculationSteps = action.calculationSteps;
		this.currentState = action.targetState;
		this.tape.write(action.tapeWrite);
		this.tape.moveHead(action.moveDirection);

		this.calculationSteps++;
	}

	private getPossibleActions(): Action[] {
		let result: Action[] = [];

		let input = this.tape.read();
		if (input !== undefined) {
			this.handleInputSymbol(input, result);
		} else {
			this.handleInputSymbol("_", result);
		}

		this.handleInputSymbol(EPSILON_KEY, result);

		return result;
	}

	private handleInputSymbol(inputSymbol: string, buffer: Action[]): void {
		if (this.currentState === null) {
			return;
		}

		// if (inputSymbol == "_" && this.tape.pointsOutsideTape()) {

		// }

		if (!this.transitions.hasOwnProperty(this.currentState.toString())) {
			return;
		}

		let availableTransitions = this.transitions[this.currentState];
		if (!availableTransitions.hasOwnProperty(inputSymbol)) {
			return;
		}

		let transitions = availableTransitions[inputSymbol];
		for (let transition of transitions) {
			buffer.push({
				currentTape: this.tape.save(),
				calculationSteps: this.calculationSteps,
				tapeWrite: transition.tapeSymbol,
				moveDirection: transition.direction,
				stepIndex: this.stepIndex,
				targetState: transition.state
			});
		}
	}

	public halted(): boolean {
		return this.halt;
	}

	// Resets this LBA, making it return to its initial state and
	// return its head to its initial position.
	public reset(): void {
		if (this.initialState == -1) {
			this.currentState = null;
		} else {
			this.currentState = this.initialState;
		}

		this.tape.resetHead();
		this.calculationSteps = 0;
		this.halt = true;
		this.accepting = false;
	}

	// Clears this LBA, making it effectively equal to new LBA().
	public clear(): void {
		this.stateList = {};
		this.inputAlphabet = {};
		this.tapeAlphabet = {};
		this.transitions = {};
		this.unsetInitialState();
		this.finalStates.clear();

		this.currentState = null;
		this.tape.setContent([]);

		this.calculationSteps = 0;
		this.inputLength = 0;

		this.halt = true;
		this.accepting = false;
		this.lastUsedIndex = -1;
	}

	// Checks if this LBA accepts in its current state.
	public accepts(): boolean {
		if (this.accepting) {
			return true;
		}

		if (this.currentState === null) {
			return false;
		}

		let result = this.finalStates.contains(this.currentState);
		result = result && this.tape.pointsAfterTape();
		return result;
	}

	// Checks if this LBA is in an error state, i.e. isn't in any state.
	public error(): boolean {
		return this.currentState === null;
	}

	public exhausted(): boolean {
		if (this.accepts()) {
			return false;
		}

		let q = Object.keys(this.stateList).length;
		let n = this.inputLength;
		let g = Object.keys(this.tapeAlphabet).length;
		return this.calculationSteps > q * n * Math.pow(g, n);
	}


	private nextIndex(): Index {
		return ++this.lastUsedIndex;
	}

	private removeEdgesOfState(index: Index): void {
		utils.foreach(this.transitions, (originIndex, transitions) => {
			let origin = parseInt(originIndex);

			utils.foreach(transitions, (input, indexedByInput) => {
				if (origin == index) {
					this.uncheckedRemoveTransition(origin, input);
				}

				let i = 0;
				while (i < indexedByInput.length) {
					if (indexedByInput[i].state == index) {
						this.uncheckedRemoveTransition(origin, input, i);
					} else {
						i++;
					}
				}
			});
		});
	}

	private uncheckedRemoveTransition(source: Index, input: string, index?: number): void {
		let transitions = this.transitions[source][input];

		let i = 0;
		while (i < transitions.length) {
			if (typeof index != "undefined" && i != index) {
				i++;
				continue;
			}

			if (this.isInputSymbol(input)) {
				this.removeInputSymbol(input);
			}

			let tapeSymbol = transitions[i].tapeSymbol;

			if (this.isInputSymbol(tapeSymbol)) {
				this.removeInputSymbol(tapeSymbol);
			}

			this.removeTapeSymbol(input);
			this.removeTapeSymbol(tapeSymbol);

			transitions.splice(i, 1);
		}

		if (typeof index == "undefined") {
			delete this.transitions[source][input];
		}
	}

	private isInputSymbol(symbol: string): boolean {
		return /[a-z0-9]/.test(symbol);
	}

	private plainTextToDirection(input: string): Direction {
		return (input == "<") ? Direction.LEFT : Direction.RIGHT;
	}

	private addSymbol(location: SymbolLocation, symbol: string): void {
		if (!this[location].hasOwnProperty(symbol)) {
			this[location][symbol] = 0;
		}

		this[location][symbol]++;
	}

	private addInputSymbol(symbol: string): void {
		this.addSymbol("inputAlphabet", symbol);
	}

	private addTapeSymbol(symbol: string): void {
		this.addSymbol("tapeAlphabet", symbol);
	}

	private removeSymbol(location: SymbolLocation, symbol: string): void {
		this[location][symbol]--;

		if (this[location][symbol] == 0) {
			delete this[location][symbol];
		}
	}

	private removeInputSymbol(symbol: string): void {
		this.removeSymbol("inputAlphabet", symbol);
	}

	private removeTapeSymbol(symbol: string): void {
		this.removeSymbol("tapeAlphabet", symbol);
	}

	private stateList: NumericMap<State> = {};
	private inputAlphabet: Alphabet = {}; // sigma
	private tapeAlphabet: Alphabet = {}; // gamma
	private transitions: {
		[index: number]: {
			[inputSymbol: string]: InternalTransitionInformation[]
		}
	} = {}; // delta (Q x gamma -> (Q x gamma x {left, right})+)
	private initialState: Index = -1; // q0
	private finalStates = new UnorderedSet<Index>(); // F

	// Instantaneous configuration-related attributes
	private currentState: Index|null = null;
	private tape: Tape;

	// Used to halt this LBA when a loop is detected
	private calculationSteps: number = 0;
	private inputLength: number = 0;

	private stepIndex: number;
	private actionTree: Action[] = [];
	private halt: boolean = true;

	private accepting: boolean = false;

	private lastUsedIndex: Index = -1;
}
