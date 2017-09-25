import {FA} from "../FA"

export const name = "Determinization";

export function command(fa: FA): FA {
	fa.addState("[what]");
	return fa;
}
