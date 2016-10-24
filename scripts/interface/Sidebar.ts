import {Menu} from "./Menu"
import {Renderer} from "./Renderer"
import {Settings} from "../Settings"
import {Strings} from "../Settings"
import {Table} from "./Table"
import {utils} from "../Utils"

export class Sidebar extends Renderer {
	constructor() {
		super();
		this.fileManipulation = new Menu(Strings.FILE_MENUBAR);
		this.machineSelection = new Menu(Strings.SELECT_MACHINE);

		// this.temp = new Menu("TEMPORARY");
		// var span = utils.create("span");
		// span.innerHTML = "Lorem ipsum dolor sit amet";
		this.temp = new Menu("Recognition");
		var input = <HTMLInputElement> utils.create("input");
		input.type = "text";
		input.placeholder = "test case";
		this.temp.add(input);
	}

	protected onBind(): void {
		this.fileManipulation.bind(this.node);
		this.machineSelection.bind(this.node);
		this.temp.bind(this.node);
	}

	protected onRender(): void {
		// $("> *", this.node).not(this.fileManipulation.html()).remove();
		this.node.innerHTML = "";
		this.build();
		this.fileManipulation.render();
		this.machineSelection.render();
		if (Settings.currentMachine == Settings.Machine.FA) {
			this.temp.render();
		}
	}

	private buildFileManipulation(): void {
		this.fileManipulation.clear();
		var save = <HTMLInputElement> utils.create("input");
		save.classList.add("file_manip_btn");
		save.type = "button";
		save.value = Strings.SAVE;
		save.addEventListener("click", function() {
			alert("Not yet implemented");
		});
		this.fileManipulation.add(save);

		var open = <HTMLInputElement> utils.create("input");
		open.classList.add("file_manip_btn");
		open.type = "button";
		open.value = Strings.OPEN;
		open.addEventListener("click", function() {
			alert("Not yet implemented");
		});
		this.fileManipulation.add(open);
		// this.fileManipulation.add(document.createElement("input"));
	}

	private buildMachineSelection(): void {
		var table = new Table(Settings.machineSelRows, Settings.machineSelColumns);
		var self = this;
		utils.foreach(Settings.machines, function(type, props) {
			var button = <HTMLInputElement> utils.create("input");
			button.classList.add("machine_selection_btn");
			button.type = "button";
			button.value = props.name;
			button.disabled = (type == Settings.currentMachine);
			button.addEventListener("click", function() {
				Settings.currentMachine = type;
				self.render();
			});
			table.add(button);
		});

		this.machineSelection.clear();
		this.machineSelection.add(table.html());
	}

	private build(): void {
		this.buildFileManipulation();
		this.buildMachineSelection();
	}

	private fileManipulation: Menu;
	private machineSelection: Menu;
	private temp: Menu;
}
