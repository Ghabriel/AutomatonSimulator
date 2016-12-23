export class UnorderedSet {
	insert(value: number): void {
		if (!this.contains(value)) {
			this.count++;
		}
		this.data[value] = true;
	}

	erase(value: number): void {
		if (this.contains(value)) {
			this.count--;
		}
		delete this.data[value];
	}

	contains(value: number): boolean {
		return !!this.data[value];
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

	forEach(callback: (v: number) => any): void {
		for (var value in this.data) {
			if (this.data.hasOwnProperty(value)) {
				if (callback(parseFloat(value)) === false) {
					break;
				}
			}
		}
	}

	asList(): number[] {
		let result: number[] = [];
		this.forEach(function(value: number) {
			result.push(value);
		});
		return result;
	}

	private data: {[value: number]: boolean} = {};
	private count = 0;
}
