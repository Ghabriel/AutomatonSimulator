import {Controller} from "./Controller"
import {State} from "../interface/State"
import {utils} from "../Utils"

export class LBAController implements Controller {
	public edgePrompt(origin: State,
					  target: State,
					  callback: (data: string[], text: string) => void,
					  fallback: () => void): void {
		console.log("[TODO] LBAController::edgePrompt()");
	}

	public edgeDataToText(data: string[]): string { return "TODO"; }

	public createState(state: State): void {}
	public createEdge(origin: State, target: State, data: string[]): void {}
	public changeInitialFlag(state: State): void {}
	public changeFinalFlag(state: State): void {}
	public clear(): void {}

	public fastForward(input: string): void {}
	public step(input: string): void {}
	public stop(): void {}
	public finished(input: string): boolean { return true; }

	public currentStates(): string[] { return []; }
	public accepts(): boolean { return false; }
}
