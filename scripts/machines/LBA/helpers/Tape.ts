/// <reference path="types.ts" />

import {utils} from "../../../Utils"

const moveOffsets = {
	[Direction.LEFT]: -1,
	[Direction.RIGHT]: 1
};

export class Tape {
	public setBoundarySymbols(...symbols: string[]): void {
		this.boundarySymbols = symbols;
	}

	public moveHead(direction: Direction): void {
		if (this.isBeyondBoundaryMove(direction)) {
			return;
		}

		this.headPosition += moveOffsets[direction];
	}

	public resetHead(): void {
		this.headPosition = 0;
	}

	public read(): string|undefined {
		return this.content[this.headPosition];
	}

	public write(symbol: string): void {
		if (this.isBoundarySymbol(symbol)) {
			// Cannot overwrite a boundary symbol
			return;
		}

		this.content[this.headPosition] = symbol;

		if (this.headPosition < this.lowIndex) {
			this.lowIndex = this.headPosition;
		}

		if (this.headPosition > this.highIndex) {
			this.highIndex = this.headPosition;
		}
	}

	public setContent(content: string[]): void {
		let obj: NumericMap<string> = {};

		for (let i = 0; i < content.length; i++) {
			obj[i] = content[i];
		}

		this.content = obj;
		this.headPosition = 0;

		this.lowIndex = 0;
		this.highIndex = content.length - 1;
	}

	public pointsBeforeTape(): boolean {
		return this.headPosition < this.lowIndex;
	}

	public pointsAfterTape(): boolean {
		return this.headPosition > this.highIndex;
	}

	public pointsOutsideTape(): boolean {
		return this.pointsBeforeTape() || this.pointsAfterTape();
	}

	public toArray(): string[] {
		let result: string[] = [];

		for (let i = this.lowIndex; i <= this.highIndex; i++) {
			if (this.content.hasOwnProperty(i.toString())) {
				result.push(this.content[i]);
			} else {
				result.push("");
			}
		}

		return result;
	}

	// Returns the head position relative to the array
	// representation of the content of this tape.
	public getHeadPosition(): number {
		return this.headPosition - this.lowIndex;
	}

	public save(): TapeJSON {
		return utils.toJSON({
			content: this.content,
			headPosition: this.headPosition,
			lowIndex: this.lowIndex,
			highIndex: this.highIndex
		});
	}

	public load(json: TapeJSON): void {
		let data = utils.fromJSON(json);
		this.content = data.content;
		this.headPosition = data.headPosition;
		this.lowIndex = data.lowIndex;
		this.highIndex = data.highIndex;
	}

	private isBeyondBoundaryMove(direction: Direction): boolean {
		let nextHeadPosition = this.headPosition + moveOffsets[direction];
		return (nextHeadPosition < this.lowIndex - 1
			|| nextHeadPosition > this.highIndex + 1);
	}

	private isBoundarySymbol(symbol: string): boolean {
		for (let boundarySymbol of this.boundarySymbols) {
			if (symbol == boundarySymbol) {
				return true;
			}
		}

		return false;
	}

	private content: NumericMap<string> = {};
	private headPosition: number = 0;

	private lowIndex: number = 0;
	private highIndex: number = 0;

	private boundarySymbols: string[] = [];
}
