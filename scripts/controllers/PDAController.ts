import {Controller} from "./Controller"
import {State} from "../interface/State"
import {utils} from "../Utils"

export class PDAController implements Controller {
	public edgePrompt(origin: State,
					  target: State,
					  callback: (data: string[], text: string) => void,
					  fallback: () => void): void {

		let epsilon = "ε";

		let self = this;
		utils.prompt("Enter the edge content:", 3, function(data) {
			data[0] = data[0] || epsilon;
			data[1] = data[1] || epsilon;
			data[2] = data[2] || epsilon;
			callback(data, self.edgeDataToText(data));
		}, fallback);
	}

	public edgeDataToText(data: string[]): string {
		return data[0] + "," + data[1] + " → " + data[2];
	}

	public createState(state: State): void {}
	public createEdge(origin: State, target: State, data: string[]): void {}
	public changeInitialFlag(state: State): void {}
	public changeFinalFlag(state: State): void {}
	public deleteState(state: State): void {}
	public deleteEdge(origin: State, target: State, data: string[]): void {}
	public clear(): void {}

	public fastForward(input: string): void {}
	public step(input: string): void {}
	public stop(): void {}
	public finished(input: string): boolean { return true; }

	public currentStates(): string[] { return []; }
	public accepts(): boolean { return false; }
}
