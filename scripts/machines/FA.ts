import {Queue} from "../datastructures/Queue"
import {UnorderedSet} from "../datastructures/UnorderedSet"

type State = string;
type Index = number;

export class FA {
	// Adds a state to this FA, marking it as the initial state
	// if there are no other states in this FA.
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

	// Removes a state from this FA.
	removeState(index: Index): void {
		// TODO
	}

	// Adds a transition to this FA. An empty input adds an
	// epsilon-transition.
	// TODO: maybe create a different method for adding epsilon-transitions?
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

	// Removes a transition from this FA. An empty input removes an
	// epsilon-transition.
	// TODO: maybe create a different method for removing epsilon-transitions?
	removeTransition(source: Index, target: Index, input: string): void {
		let transitions = this.transitions[source];
		if (input == "") {
			this.epsilonTransitions[source].erase(target);
		} else if (transitions.hasOwnProperty(input)) {
			transitions[input].erase(target);
		}
	}

	// Sets the initial state of this FA.
	setInitialState(index: Index): void {
		if (index < this.numStates()) {
			this.initialState = index;
		}
	}

	// Unsets the initial state of this FA.
	unsetInitialState(): void {
		this.initialState = -1;
	}

	// Returns the index of the initial state.
	// TODO: maybe this should return a State?
	getInitialState(): Index {
		return this.initialState;
	}

	// Marks a state as final.
	addAcceptingState(index: Index): void {
		this.finalStates.insert(index);
	}

	// Marks a state as non-final.
	removeAcceptingState(index: Index): void {
		this.finalStates.erase(index);
	}

	// Returns all accepting states
	// TODO: maybe this should return a State[]?
	getAcceptingStates(): Index[] {
		return this.finalStates.asList();
	}

	// Returns a list containing all the states that this FA is in.
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
			if (output) {
				output.forEach(function(state) {
					newStates.insert(state);
				});
			}
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
		let found = false;
		let self = this;
		this.finalStates.forEach(function(final) {
			if (self.currentStates.contains(final)) {
				found = true;
				return false;
			}
		});
		return found;
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

	private stateList: State[] = [];
	private transitions: {
		[index: number]: {
			[input: string]: UnorderedSet
		}
	} = {};
	private epsilonTransitions: {
		[index: number]: UnorderedSet
	} = {};
	private initialState: Index = -1;
	private finalStates = new UnorderedSet();

	private currentStates = new UnorderedSet();
}
