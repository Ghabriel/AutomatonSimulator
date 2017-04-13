import {State} from "../interface/State"

export interface FormalDefinition {
	parameterSequence: string[]; // e.g [Q, sigma, delta, q0, F]
	parameterValues: {[p: string]: any}; // values of each parameter
}

export interface Controller {
	// Interface-related edge manipulation
	edgePrompt(callback: (data: string[], text: string) => void,
			   fallback?: () => void): void;

	edgeDataToText(data: string[]): string;

	// Edition-related methods
	createState(state: State): void;
	createEdge(origin: State, target: State, data: string[]): void;
	changeInitialFlag(state: State): void;
	changeFinalFlag(state: State): void;
	renameState(state: State, newName: string): void;
	deleteState(state: State): void;
	deleteEdge(origin: State, target: State, data: string[]): void;
	clear(): void;

	// Recognition-related methods
	fastForward(input: string): void;
	step(input: string): void;
	stop(): void;
	finished(input: string): boolean;
	isStopped(): boolean;
	stepPosition(): number;

	// Editing-related callback methods (useful for updating formal
	// definitions in the interface)
	// Should be called whenever an editing-related method is called.
	setEditingCallback(callback: () => void): void;

	// Useful getters
	currentStates(): string[];
	accepts(): boolean;
	formalDefinition(): FormalDefinition;
}
