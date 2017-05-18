import {FA} from "../machines/FA/FA"

interface TestPlan {
	testNames: () => string[];
}

export class Test {
	public static runTests(plan: TestPlan): void {
		let testNames = plan.testNames();
		for (let method of testNames) {
			let status: string;
			if (plan[method]()) {
				status = " OK ";
			} else {
				status = "FAIL";
			}
			console.log("[" + status + "] " + method);
		}
	}
}

export class FATests implements TestPlan {
	public testNames(): string[] {
		return ["something"];
	}

	public something(): boolean {
		let fa = new FA();
		return fa.error();
	}
}
