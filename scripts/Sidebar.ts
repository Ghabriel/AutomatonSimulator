import {Menu} from "./Menu"
import {Renderer} from "./Renderer"
import {Settings} from "./Settings"
import {Strings} from "./Settings"
import {Table} from "./Table"
import {utils} from "./Utils"

export class Sidebar extends Renderer {
	constructor() {
		super();
		this.machineSelection = new Menu(Strings.SELECT_MACHINE);

		this.temp = new Menu("TEMPORARY");
		var span = utils.create("span");
		span.innerHTML = "Lorem ipsum dolor sit amet";
		this.temp.add(span);
	}

	protected onBind(): void {
		this.machineSelection.bind(this.node);
		this.temp.bind(this.node);
	}

	protected onRender(): void {
		this.node.innerHTML = "";
		this.build();
		this.machineSelection.render();
		if (Settings.currentMachine == Settings.Machine.DFA) {
			this.temp.render();
		}
	}

	private build(): void {
		// TODO: make this more generic
		var table = new Table(2, 2);
		var self = this;
		utils.foreach(Settings.machines, function(type, props) {
			var button = <HTMLInputElement> utils.create("input");
			button.type = "button";
			button.value = props.name;
			button.disabled = (type == Settings.currentMachine);
			button.addEventListener("click", function() {
				Settings.currentMachine = type;
				self.render();
				// alert("Not yet implemented.");
			});
			table.add(button);
		});

		this.machineSelection.clear();
		this.machineSelection.add(table.html());
	}

	private machineSelection: Menu;
	private temp: Menu;
}
