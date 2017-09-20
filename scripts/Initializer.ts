import {utils} from "./Utils"

export interface Initializable {
	init(): void;
	onEnter(): void;
	onExit(): void;
}

export class Initializer {
	static exec(initList: {[m: number]: Initializable}): void {
		utils.foreach(initList, function(index, obj) {
			obj.init();
		});
	}
}
