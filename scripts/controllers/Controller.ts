import {State} from "../interface/State"

export interface Controller {
	edgePrompt(origin: State,
			   target: State,
			   callback: (data: string[], text: string) => void,
			   fallback: () => void): void;

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

	currentStates(): string[];
	accepts(): boolean;
}
