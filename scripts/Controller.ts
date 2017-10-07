/// <reference path="types.ts" />

import {Prompt} from "./Prompt"

export interface FormalDefinition {
	// Order of the parameters displayed in M = (...)
	tupleSequence: string[]; // e.g [Q, sigma, delta, q0, F]

	// Order of the parameters displayed below M = (...)
	parameterSequence: string[];

	// Values of each parameter
	parameterValues: {[p: string]: any};
}

export interface TransitionTable {
	domain: string;
	codomain: string;
	header: string[];
	list: string[][];
	metadata: [string, string, string[]][];
}

export type Operation = (...args: any[]) => any;

/**
 * Generic interface that specifies the mandatory methods of a controller.
 */
export interface Controller {
	// Interface-related edge manipulation
	edgePrompt(callback: (data: string[], text: string) => void,
			   fallback?: () => void): Prompt;

	edgeDataToText(data: string[]): string;

	// Edition-related methods
	createState(state: State): void;
	createTransition(origin: State, target: State, data: string[]): void;
	changeInitialFlag(state: State): void;
	changeFinalFlag(state: State): void;
	renameState(state: State, newName: string): void;
	deleteState(state: State): void;
	deleteTransition(origin: State, target: State, data: string[]): void;
	clear(): void;

	// Recognition-related methods
	fastForward(input: string): void;
	step(input: string): void;
	stop(): void;
	reset(): void;
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

	// Support to machine operations
	applyOperation(operation: Operation): void;
}
