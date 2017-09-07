import {Edge} from "./Edge"
import {Settings} from "../Settings"

export namespace EdgeUtils {
	export function addEdgeData(edge: Edge, data: string[]): void {
		let origin = edge.getOrigin();
		let target = edge.getTarget();
		if (!origin || !target) {
			throw Error("addEdgeData requires a complete edge");
		}

		let controller = Settings.controller();
		edge.addText(controller.edgeDataToText(data));
		edge.addData(data);
		controller.createEdge(origin, target, data);
	}
}
