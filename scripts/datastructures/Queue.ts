/**
 * Represents a queue of an arbitrary type, providing O(1) or
 * amortized O(1) complexity for all operations.
 */
export class Queue<T> {
	push(value: T): void {
		this.data.push(value);
	}

	front(): T {
		return this.data[this.pointer];
	}

	pop(): T {
		let result = this.front();
		this.pointer++;
		if (this.pointer >= this.size() / 2) {
			this.data = this.data.slice(this.pointer);
			this.pointer = 0;
		}
		return result;
	}

	clear(): void {
		this.data = [];
		this.pointer = 0;
	}

	empty(): boolean {
		return this.size() == 0;
	}

	size(): number {
		return this.data.length - this.pointer;
	}

	private data: T[] = [];
	private pointer = 0;
}
