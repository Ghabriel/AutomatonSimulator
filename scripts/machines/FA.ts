import {Queue} from "../datastructures/Queue"
import {UnorderedSet} from "../datastructures/UnorderedSet"

type State = string;
type Index = number;

export class FA {
	addState(name: State): Index {
		this.stateList.push(name);
		let index = this.numStates() - 1;
		this.transitions[index] = {};
		this.epsilonTransitions[index] = new UnorderedSet();
		if (this.initialState == -1) {
			this.initialState = index;
		}
		return index;
	}

	removeState(index: Index): void {
		// TODO
	}

	addTransition(source: Index, target: Index, input: string): void {
		let transitions = this.transitions[source];
		if (input == "") {
			this.epsilonTransitions[source].insert(target);
		} else {
			if (!transitions.hasOwnProperty(input)) {
				transitions[input] = new UnorderedSet();
			}
			transitions[input].insert(target);
		}
	}

	removeTransition(source: Index, target: Index, input: string): void {
		let transitions = this.transitions[source];
		if (input == "") {
			this.epsilonTransitions[source].erase(target);
		} else if (transitions.hasOwnProperty(input)) {
			transitions[input].erase(target);
		}
	}

	setInitialState(index: Index): void {
		if (index < this.numStates()) {
			this.initialState = index;
		}
	}

	unsetInitialState(): void {
		this.initialState = -1;
	}

	getInitialState(): Index {
		return this.initialState;
	}

	addAcceptingState(index: Index): void {
		this.finalStates.insert(index);
	}

	removeAcceptingState(index: Index): void {
		this.finalStates.erase(index);
	}

	getAcceptingStates(): Index[] {
		return this.finalStates.asList();
	}

	getStates(): State[] {
		let result: State[] = [];
		let self = this;
		this.currentStates.forEach(function(index) {
			result.push(self.stateList[index]);
		});
		return result;
	}

	// Returns the alphabet of this FA.
	alphabet(): string[] {
		let result: string[] = [];
		// TODO
		return result;
	}

	// Reads a character, triggering state changes to this FA.
	read(input: string): void {
		let newStates = new UnorderedSet();
		let self = this;
		this.currentStates.forEach(function(index) {
			let output = self.transition(index, input);
			output.forEach(function(state) {
				newStates.insert(state);
			});
		});
		this.expandSpontaneous(newStates);
		this.currentStates = newStates;
	}

	// Resets this FA, making it return to its initial state.
	reset(): void {
		this.currentStates.clear();
		this.currentStates.insert(this.initialState);
		this.expandSpontaneous(this.currentStates);
	}

	// Checks if this FA is in an accepting state.
	accepts(): boolean {
		this.finalStates.forEach(function(final) {
			if (this.currentStates.contains(final)) {
				return true;
			}
		});
		return false;
	}

	// Returns the number of states of this FA.
	numStates(): number {
		return this.stateList.length;
	}

	// Returns all states that a given state transitions to
	// with a given input.
	private transition(state: Index, input: string): UnorderedSet {
		return this.transitions[state][input];
	}

	// Expands all epsilon-transitions into a given state list.
	private expandSpontaneous(stateList: UnorderedSet): void {
		let queue = new Queue<Index>();
		stateList.forEach(function(state) {
			queue.push(state);
		});

		while (!queue.empty()) {
			let state = queue.pop();
			let eps = this.epsilonTransitions[state];
			eps.forEach(function(index) {
				if (!stateList.contains(index)) {
					stateList.insert(index);
					queue.push(index);
				}
			});
		}
	}

	private stateList: State[] = [];		  // K
	private transitions: {
		[index: number]: {
			[input: string]: UnorderedSet
		}
	} = {};									  // delta (non-epsilon)
	private epsilonTransitions: {
		[index: number]: UnorderedSet
	} = {};									  // delta (epsilon)
	private initialState: Index = -1;		  // q0
	private finalStates = new UnorderedSet(); // F

	private currentStates = new UnorderedSet();
}
