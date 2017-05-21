import {TestPlan} from "./Test"

export class PDATests implements TestPlan {
	public planName(): string {
		return "PDA";
	}

	public testNames(): string[] {
		return ["example1", "example2", "example3"];
	}

	public example1(): boolean {
		return false;
	}

	public example2(): boolean {
		return true;
	}

	public example3(): boolean {
		throw 42;
	}
}
