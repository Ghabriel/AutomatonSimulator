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

		// TODO: make this more generic
		var table = new Table(2, 2);
		utils.foreach(Settings.machines, function(type, props) {
			var button = <HTMLInputElement> utils.create("input");
			button.type = "button";
			button.value = props.name;
			button.addEventListener("click", function() {
				alert("Not yet implemented.");
			});
			table.add(button);
		});
		this.machineSelection.add(table.html());

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
		this.machineSelection.render();
		this.temp.render();
	}

	private machineSelection: Menu;
	private temp: Menu;
}
