export class Memento<T> {
	constructor(limit: () => number) {
		this.limit = limit;
	}

	public push(state: T): void {
		if (this.historyPointer == this.limit()) {
			delete this.states[this.offset];
			this.offset++;
		} else {
			this.historyPointer++;
		}

		let index = this.index();
		this.states[index] = state;

		let forward = 1;
		while (this.states[index + forward]) {
			delete this.states[index + forward];
			forward++;
		}
	}

	public undo(): T {
		if (this.historyPointer >= this.offset && this.historyPointer > 0) {
			this.historyPointer--;
			return this.states[this.index()];
		} else {
			return null;
		}
	}

	public redo(): T {
		if (this.states[this.index() + 1]) {
			this.historyPointer++;
			return this.states[this.index()];
		} else {
			return null;
		}
	}

	private index(): number {
		return this.offset + this.historyPointer;
	}

	private limit: () => number;
	private offset: number = 0;
	private historyPointer: number = -1;
	private states: {[i: number]: T} = {};
}
