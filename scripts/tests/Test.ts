export interface TestPlan {
	planName: () => string;
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
		let output = "";
		for (let plan of this.testPlans) {
			let planName = plan.planName();
			let testNames = plan.testNames();
			let stats = {
				success: 0,
				failure: 0,
				exceptions: 0
			};
			output += "<div class='plan'>";
			output += "<div class='plan_name'>" + planName + "</div>";
			for (let method of testNames) {
				let status: string;
				let className: string;
				try {
					if (plan[method]()) {
						status = " OK ";
						className = "success";
						stats.success++;
					} else {
						status = "FAIL";
						className = "failure";
						stats.failure++;
					}
				} catch (e) {
					status = "EXCP";
					className = "exception";
					stats.exceptions++;
				}

				// console.log("[" + status + "] " + method);
				output += "<div class='test_case'>";
				output += "<div class='status " + className + "'>";
				output += status;
				output += "</div>";
				output += "<div class='test_name'>" + method + "</div>";
				output += "</div>";
			}
			output += "<div class='summary'>";
			if (stats.failure == 0 && stats.exceptions == 0) {
				output += "<div class='success'>All tests passed.</div>";
			} else {
				let numTests = testNames.length;
				let successRate = ((stats.success / numTests) * 100).toFixed(2);
				let failureRate = ((stats.failure / numTests) * 100).toFixed(2);
				let excpRate = ((stats.exceptions / numTests) * 100).toFixed(2);

				let parts: string[] = [];
				parts.push(stats.success + " test(s) passed (" +
					successRate + "%)");
				if (stats.failure > 0) {
					parts.push(stats.failure + " test(s) failed (" +
						failureRate + "%)");
				}
				if (stats.exceptions > 0) {
					parts.push(stats.exceptions +
						" test(s) resulted in exceptions (" + excpRate + "%)");
				}
				output += "<div class='failure'>Test plan failed.</div>";
				output += "<ul>";
				output += "<li>" + parts.join("</li><li>") + "</li>";
				output += "</ul>";
			}
			output += "</div>"
			output += "</div>";
		}
		this.targetNode.innerHTML += output;
	}

	private targetNode: HTMLDivElement;
	private testPlans: TestPlan[] = [];
}
