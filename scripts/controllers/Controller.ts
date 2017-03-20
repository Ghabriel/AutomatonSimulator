import {State} from "../interface/State"

export interface Controller {
	edgePrompt(origin: State,
			   target: State,
			   callback: (text: string) => void,
			   fallback: () => void): void;

	createState(state: State): void;
	changeInitialFlag(state: State): void;
	changeFinalFlag(state: State): void;

	fastForward(input: string): void;
	step(input: string): void;
	stop(): void;

	accepts(): boolean;
}
