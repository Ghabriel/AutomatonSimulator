/// <reference path="./types.ts" />

import {Settings} from "./Settings"
import {utils} from "./Utils"

export namespace EdgeUtils {
	export function addEdgeData<T extends State>(edge: Edge<T>,
		data: string[]): void {

		let origin = edge.origin;
		let target = edge.target;
		// if (!origin || !target) {
		// 	throw Error("addEdgeData requires a complete edge");
		// }

		let controller = Settings.controller();
		edge.textList.push(controller.edgeDataToText(data));
		edge.dataList.push(data);
		controller.createTransition(origin, target, data);
	}

	export function edgeIteration<T extends State, TEdge extends Edge<T>>
		(group: IndexedEdgeGroup<TEdge>, callback: Callback<TEdge>): void {

		utils.foreach(group, function(origin, map) {
			utils.foreach(map, function(target, edge) {
				callback(edge);
			});
		});
	}
}
