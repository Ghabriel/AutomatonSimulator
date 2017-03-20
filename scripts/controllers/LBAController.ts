import {Controller} from "./Controller"
import {State} from "../interface/State"
import {utils} from "../Utils"

export class LBAController implements Controller {
	public edgePrompt(origin: State,
					  target: State,
					  callback: (text: string) => void,
					  fallback: () => void): void {
		console.log("[TODO] LBAController::edgePrompt()");
	}

	public createState(state: State): void {}
	public changeInitialFlag(state: State): void {}
	public changeFinalFlag(state: State): void {}

	public fastForward(input: string): void {}
	public step(input: string): void {}
	public stop(): void {}

	public accepts(): boolean { return false; }
}
