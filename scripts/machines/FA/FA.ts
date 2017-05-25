import {Queue} from "../../datastructures/Queue"
import {UnorderedSet} from "../../datastructures/UnorderedSet"
import {utils} from "../../Utils"

type State = string;
type Index = number;

export class FA {
	// Adds a state to this FA, marking it as the initial state
	// if there are no other states in this FA.
	public addState(name: State): Index {
		this.stateList.push(name);
		let index = this.numStates() - 1;
		this.transitions[index] = {};
		this.epsilonTransitions[index] = new UnorderedSet<Index>();
		if (this.initialState == -1) {
			this.initialState = index;
			this.reset();
		}
		return index;
	}

	// Removes a state from this FA.
	public removeState(index: Index): void {
		let self = this;
		utils.foreach(this.transitions, function(originIndex, transitions) {
			let origin = parseInt(originIndex);
			utils.foreach(transitions, function(input) {
				if (transitions[input].contains(index)) {
					this.removeTransition(origin, index, input);
				}

				if (origin == index) {
					transitions[input].forEach(function(target) {
						self.removeTransition(index, target, input);
					});
				}
			});
		});

		// TODO: do we really need to remove the state from the state list?
		// Doing so would require changes to numStates() and possibly
		// other methods. Maybe replacing it by some kind of "invalid entry"
		// is a better solution.
		this.stateList[index] = undefined;
		this.numRemovedStates++;
	}

	// Renames a state of this FA.
	public renameState(index: Index, newName: State): void {
		this.stateList[index] = newName;
	}

	// Adds a transition to this FA. An empty input adds an
	// epsilon-transition.
	// TODO: maybe create a different method for adding epsilon-transitions?
	public addTransition(source: Index, target: Index, input: string): void {
		let transitions = this.transitions[source];
		if (input == "") {
			this.epsilonTransitions[source].insert(target);
		} else {
			if (!transitions.hasOwnProperty(input)) {
				transitions[input] = new UnorderedSet<Index>();
			}
			transitions[input].insert(target);

			if (!this.alphabetSet.hasOwnProperty(input)) {
				this.alphabetSet[input] = 0;
			}
			this.alphabetSet[input]++;
		}
	}

	// Removes a transition from this FA. An empty input removes an
	// epsilon-transition.
	// TODO: maybe create a different method for removing epsilon-transitions?
	public removeTransition(source: Index, target: Index, input: string): void {
		let transitions = this.transitions[source];
		if (input == "") {
			this.epsilonTransitions[source].erase(target);
		} else if (transitions.hasOwnProperty(input)) {
			transitions[input].erase(target);

			this.alphabetSet[input]--;
			if (this.alphabetSet[input] == 0) {
				delete this.alphabetSet[input];
			}
		}
	}

	// Sets the initial state of this FA.
	public setInitialState(index: Index): void {
		if (index < this.numStates()) {
			this.initialState = index;
		}
	}

	// Unsets the initial state of this FA.
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

	// Returns a list containing all the states that this FA is in.
	public getCurrentStates(): State[] {
		let result: State[] = [];
		let self = this;
		this.currentStates.forEach(function(index) {
			result.push(self.stateList[index]);
		});
		return result;
	}

	// Returns a list containing all the states of this FA.
	public getStates(): State[] {
		return this.stateList.filter(function(value) {
			return value !== undefined;
		});
	}

	// Executes a callback function for every transition (including
	// epsilon transitions) of this FA.
	public transitionIteration(
		callback: (source: State, target: State, input: string) => void): void {

		let self = this;
		for (let index in this.transitions) {
			if (this.transitions.hasOwnProperty(index)) {
				let sourceState = self.stateList[index];
				let stateTransitions = this.transitions[index];
				for (let input in stateTransitions) {
					if (stateTransitions.hasOwnProperty(input)) {
						stateTransitions[input].forEach(function(target: Index) {
							let targetState = self.stateList[target];
							callback(sourceState, targetState, input);
						});
					}
				}
			}
		}

		for (let index in this.epsilonTransitions) {
			if (this.transitions.hasOwnProperty(index)) {
				let sourceState = self.stateList[index];
				let stateTransitions = this.epsilonTransitions[index];
				stateTransitions.forEach(function(target: Index) {
					let targetState = self.stateList[target];
					callback(sourceState, targetState, "");
				});
			}
		}
	}

	// Returns the alphabet of this FA.
	public alphabet(): string[] {
		let result = [];
		for (let member in this.alphabetSet) {
			if (this.alphabetSet.hasOwnProperty(member)) {
				result.push(member);
			}
		}
		return result;
	}

	// Reads a character, triggering state changes to this FA.
	public read(input: string): void {
		let newStates = new UnorderedSet<Index>();
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
	public reset(): void {
		this.currentStates.clear();
		if (this.initialState != -1) {
			this.currentStates.insert(this.initialState);
			this.expandSpontaneous(this.currentStates);
		}
	}

	// Clears this FA, making it effectively equal to new FA().
	public clear(): void {
		this.stateList = [];
		this.alphabetSet = {};
		this.transitions = {};
		this.epsilonTransitions = {};
		this.unsetInitialState();
		this.finalStates.clear();
		this.currentStates.clear();
	}

	// Checks if this FA is in an accepting state.
	public accepts(): boolean {
		let found = false;
		let self = this;
		this.finalStates.forEach(function(final) {
			if (self.currentStates.contains(final)) {
				found = true;
				return false;
			}
			return true;
		});
		return found;
	}

	// Checks if this FA is in an error state, i.e. isn't in any state.
	public error(): boolean {
		return this.currentStates.size() == 0;
	}

	// Returns the number of states of this FA.
	public numStates(): number {
		return this.stateList.length - this.numRemovedStates;
	}

	// Returns all states that a given state transitions to
	// with a given input.
	private transition(state: Index, input: string): UnorderedSet<Index> {
		return this.transitions[state][input];
	}

	// Expands all epsilon-transitions into a given state list.
	private expandSpontaneous(stateList: UnorderedSet<Index>): void {
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
	private alphabetSet: {[i: string]: number} = {};
	private transitions: {
		[index: number]: {
			[input: string]: UnorderedSet<Index>
		}
	} = {};
	private epsilonTransitions: {
		[index: number]: UnorderedSet<Index>
	} = {};
	private initialState: Index = -1;
	private finalStates = new UnorderedSet<Index>();

	private numRemovedStates: number = 0;
	private currentStates = new UnorderedSet<Index>();
}
