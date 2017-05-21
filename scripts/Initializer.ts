import * as init from "./lists/InitializerList"
import {utils} from "./Utils"

export class Initializer {
	static exec(): void {
		this.initSidebars();
	}

	private static initSidebars(): void {
		utils.foreach(init, function(moduleName, obj) {
			obj.init();
		});
	}
}
