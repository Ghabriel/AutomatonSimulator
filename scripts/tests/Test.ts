export interface TestPlan {
	testNames: () => string[];
}

export class Test {
	constructor(target: HTMLDivElement) {
		this.targetNode = target;
	}

	public addTestPlan(plan: TestPlan): void {
		this.testPlans.push(plan);
	}

	public runTests(): void {
		for (let plan of this.testPlans) {
			let testNames = plan.testNames();
			for (let method of testNames) {
				let status: string;
				try {
					if (plan[method]()) {
						status = " OK ";
					} else {
						status = "FAIL";
					}
				} catch (e) {
					status = "EXCP";
				}

				// console.log("[" + status + "] " + method);
				let output = "<div class='testcase'>";
				output += "<div class='status'>" + status + "</div>";
				output += "<div class='name'>" + method + "</div>";
				output += "</div>";
				this.targetNode.innerHTML += output;
			}
		}
	}

	private targetNode: HTMLDivElement;
	private testPlans: TestPlan[] = [];
}
