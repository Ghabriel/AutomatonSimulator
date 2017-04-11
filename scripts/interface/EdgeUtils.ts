import {Edge} from "./Edge"
import {Settings} from "../Settings"

export namespace EdgeUtils {
	export function addEdgeData(edge: Edge, data: string[]): void {
		let controller = Settings.controller();
		edge.addText(controller.edgeDataToText(data));
		edge.addData(data);
		controller.createEdge(edge.getOrigin(), edge.getTarget(), data);
	}
}
