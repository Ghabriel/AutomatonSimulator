/**
 * Encapsulates an unordered set of either strings or numbers,
 * which allow O(1) insertion, deletion and search.
 */
export class UnorderedSet<T extends string|number> {
	insert(value: T): void {
		if (!this.contains(value)) {
			this.count++;
		}
		this.data[<string> value] = true;
		this.type = typeof value;
	}

	erase(value: T): void {
		if (this.contains(value)) {
			this.count--;
		}
		delete this.data[<string> value];
	}

	contains(value: T): boolean {
		return !!this.data[<string> value];
	}

	clear(): void {
		this.data = {};
		this.count = 0;
	}

	empty(): boolean {
		return this.size() == 0;
	}

	size(): number {
		return this.count;
	}

	forEach(callback: (v: T) => any): void {
		for (var value in this.data) {
			if (this.data.hasOwnProperty(value)) {
				let val: T = <T> value;
				if (this.type == "number") {
					val = <T> parseFloat(value);
				}
				if (callback(val) === false) {
					break;
				}
			}
		}
	}

	asList(): T[] {
		let result: T[] = [];
		this.forEach(function(value: T) {
			result.push(value);
		});
		return result;
	}

	private data: {[value: string]: boolean} = {};
	private count = 0;

	// Used to get runtime type checking
	private type: string;
}
