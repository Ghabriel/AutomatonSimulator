import {Queue} from "../../datastructures/Queue"
import {UnorderedSet} from "../../datastructures/UnorderedSet"
import {utils} from "../../Utils"

type State = string;
type Index = number;
type Alphabet = {[i: string]: number};

type SymbolLocation = "inputAlphabet" | "tapeAlphabet";

enum Direction {
	LEFT, RIGHT
}

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

class Tape {
	public moveHead(direction: Direction): void {
		switch (direction) {
			case Direction.LEFT:
				this.headPosition--;
				break;
			case Direction.RIGHT:
				this.headPosition++;
				break;
			default:
				utils.assertNever(direction);
		}
	}

	public resetHead(): void {
		this.headPosition = 0;
	}

	public read(): string {
		return this.content[this.headPosition];
	}

	public write(symbol: string): void {
		this.content[this.headPosition] = symbol;

		if (this.headPosition < this.lowIndex) {
			this.lowIndex = this.headPosition;
		}

		if (this.headPosition > this.highIndex) {
			this.highIndex = this.headPosition;
		}
	}

	public setContent(content: string[]): void {
		let obj: NumericMap<string> = {};

		for (let i = 0; i < content.length; i++) {
			obj[i] = content[i];
		}

		this.content = obj;
		this.headPosition = 0;

		this.lowIndex = 0;
		this.highIndex = content.length - 1;
	}

	public pointsAfterTape(): boolean {
		return this.headPosition > this.highIndex;
	}

	public toArray(): string[] {
		let result: string[] = [];

		for (let i = this.lowIndex; i <= this.highIndex; i++) {
			if (this.content.hasOwnProperty(i.toString())) {
				result.push(this.content[i]);
			} else {
				result.push("");
			}
		}

		return result;
	}

	public getHeadPosition(): number {
		return this.headPosition;
	}

	private content: NumericMap<string> = {};
	private headPosition: number = 0;

	private lowIndex: number = 0;
	private highIndex: number = 0;
}

export class LBA {
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
		this.accepting = false;
	}

	public getTapeContent(): string[] {
		return this.tape.toArray();
	}

	public getHeadPosition(): number {
		return this.tape.getHeadPosition();
	}

	// Reads a character from the tape, triggering state changes to this LBA.
	// TODO: handle non-determinism
	public read(): void {
		if (this.error()) {
			return;
		}

		let error = true;
		let input = this.tape.read();

		if (this.currentState !== null) {
			if (this.transitions.hasOwnProperty(this.currentState.toString())) {
				let transitions = this.transitions[this.currentState];
				if (transitions.hasOwnProperty(input)) {
					let info = transitions[input][0];
					this.currentState = info.state;
					this.tape.write(info.tapeSymbol);
					this.tape.moveHead(info.direction);
					this.calculationSteps++;
					error = false;
				}
			}
		}

		if (this.exhausted()) {
			error = true;
		}

		if (error) {
			if (this.accepts()) {
				// continues to accept if it's currently accepting
				this.accepting = true;
			}

			// goes to the error state
			this.currentState = null;
		}
	}

	public halted(): boolean {
		// TODO
		return this.error();
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
		return /[a-z]/.test(symbol);
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
	private tape = new Tape();

	// Used to halt this LBA when a loop is detected
	private calculationSteps: number = 0;
	private inputLength: number = 0;

	private accepting: boolean = false;
	private lastUsedIndex: Index = -1;
}
