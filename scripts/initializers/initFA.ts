import {Menu} from "../interface/Menu"
import {Settings, Strings} from "../Settings"
import {utils} from "../Utils"

export namespace initFA {
	function buildTestCaseInput(container: HTMLElement[][]) {
		let input = <HTMLInputElement> utils.create("input", {
			type: "text",
			placeholder: Strings.TEST_CASE
		});
		container.push([input]);
	}

	function buildRecognitionControls(container: HTMLElement[][]) {
		let restartEnabled = false;

		// TODO: differenciate "next step of current recognition" vs
		// "start step-by-step of new recognition"

		// TODO: find an icon that matches "restart"

		let restartRecognition = <HTMLImageElement> utils.create("img", {
			className: "image_button disabled",
			src: "images/stop.svg",
			title: Strings.RESTART_RECOGNITION,
			click: function() {
				if (restartEnabled) {
					// TODO
					alert("TODO: restart");
				}
			}
		});

		let stepRecognition = <HTMLImageElement> utils.create("img", {
			className: "image_button",
			src: "images/play.svg",
			title: Strings.STEP_RECOGNITION,
			click: function() {
				// TODO
				alert("TODO: step-by-step");

				// restartEnabled = !restartEnabled;
				// let method = restartEnabled ? "remove" : "add";
				// restartRecognition.classList[method]("disabled");
			}
		});

		let fastRecognition = <HTMLImageElement> utils.create("img", {
			className: "image_button",
			src: "images/fastforward.svg",
			title: Strings.FAST_RECOGNITION,
			click: function() {
				// TODO
				alert("TODO: fast forward");
			}
		});

		container.push([stepRecognition, fastRecognition,
						restartRecognition]);
	}

	export function init() {
		let menuList: Menu[] = [];

		let menu = new Menu(Strings.RECOGNITION);
		let rows: HTMLElement[][] = [];

		buildTestCaseInput(rows);
		buildRecognitionControls(rows);

		for (let row of rows) {
			let div = <HTMLDivElement> utils.create("div", {
				className: "row"
			});
			for (let node of row) {
				div.appendChild(node);
			}
			menu.add(div);
		}

		menuList.push(menu);

		Settings.machines[Settings.Machine.FA].sidebar = menuList;
	}
}
