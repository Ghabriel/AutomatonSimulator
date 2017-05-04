export class Memento<T> {
	constructor(limit: () => number) {
		this.limit = limit;
	}

	public push(state: T): void {
		console.log("push", state);
		// '+ 1' to store the current state as well
		let limit = this.limit() + 1;
		if (this.topIndex - this.bottomIndex + 1 == limit) {
			delete this.states[this.bottomIndex];
			this.bottomIndex++;
		}
		this.topIndex++;
		this.states[this.topIndex] = state;
	}

	public pop(): T {
		// Ignores the current state
		let data = this.states[this.topIndex - 1];
		this.topIndex--;
		return data;
	}

	private limit: () => number;
	private bottomIndex: number = 0;
	private topIndex: number = -1;
	private states: {[i: number]: T} = {};
}
