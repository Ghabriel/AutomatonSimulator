import {FA} from "../machines/FA/FA"
import {TestPlan} from "./Test"

export class FATests implements TestPlan {
	public planName(): string {
		return "FA";
	}

	public testNames(): string[] {
		return ["something"];
	}

	public something(): boolean {
		let fa = new FA();
		return fa.error();
	}
}
