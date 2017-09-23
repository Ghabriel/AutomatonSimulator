/**
 * Represents a queue of an arbitrary type, providing O(1) or
 * amortized O(1) complexity for all operations.
 */
export class Queue<T> {
	public push(value: T): void {
		this.data.push(value);
	}

	public front(): T {
		return this.data[this.pointer];
	}

	public pop(): T {
		let result = this.front();
		this.pointer++;
		if (this.pointer >= this.size() / 2) {
			this.data = this.data.slice(this.pointer);
			this.pointer = 0;
		}
		return result;
	}

	public clear(): void {
		this.data = [];
		this.pointer = 0;
	}

	public empty(): boolean {
		return this.size() == 0;
	}

	public size(): number {
		return this.data.length - this.pointer;
	}

	private data: T[] = [];
	private pointer = 0;
}
