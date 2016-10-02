import {Menu} from "./Menu"
import {Renderer} from "./Renderer"
import {Strings} from "./Settings"

export class Sidebar extends Renderer {
	constructor() {
		super();
		this.machineSelection = new Menu(Strings.SELECT_MACHINE);
	}

	protected onBind(): void {
		this.machineSelection.bind(this.node);
	}

	protected onRender(): void {
		this.machineSelection.render();
	}

	private machineSelection: Menu;
}
