import {Controller, FormalDefinition} from "./Controller"
import {State} from "../interface/State"
import {utils} from "../Utils"

export class LBAController implements Controller {
	public edgePrompt(callback: (data: string[], text: string) => void,
					  fallback?: () => void): void {
		console.log("[TODO] LBAController::edgePrompt()");
	}

	public edgeDataToText(data: string[]): string { return "TODO"; }

	public createState(state: State): void {}
	public createEdge(origin: State, target: State, data: string[]): void {}
	public changeInitialFlag(state: State): void {}
	public changeFinalFlag(state: State): void {}
	public renameState(state: State, newName: string): void {}
	public deleteState(state: State): void {}
	public deleteEdge(origin: State, target: State, data: string[]): void {}
	public clear(): void {}

	public fastForward(input: string): void {}
	public step(input: string): void {}
	public stop(): void {}
	public finished(input: string): boolean { return true; }
	public isStopped(): boolean { return true; }
	public stepPosition(): number { return -1; }

	public setEditingCallback(callback: () => void): void {}

	public currentStates(): string[] { return []; }
	public accepts(): boolean { return false; }
	public formalDefinition(): FormalDefinition { return null; }
}
