import {State} from "../interface/State"

export interface FormalDefinition {
	parameterSequence: string[]; // e.g [Q, sigma, delta, q0, F]
	parameterValues: {[p: string]: any}; // values of each parameter
}

export interface Controller {
	edgePrompt(callback: (data: string[], text: string) => void,
			   fallback?: () => void): void;

	edgeDataToText(data: string[]): string;

	createState(state: State): void;
	createEdge(origin: State, target: State, data: string[]): void;
	changeInitialFlag(state: State): void;
	changeFinalFlag(state: State): void;
	deleteState(state: State): void;
	deleteEdge(origin: State, target: State, data: string[]): void;
	clear(): void;

	fastForward(input: string): void;
	step(input: string): void;
	stop(): void;
	finished(input: string): boolean;
	isStopped(): boolean;
	stepPosition(): number;

	currentStates(): string[];
	accepts(): boolean;
	formalDefinition(): FormalDefinition;
}
