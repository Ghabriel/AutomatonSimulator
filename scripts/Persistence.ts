import {Edge} from "./interface/Edge"
import {EdgeUtils} from "./interface/EdgeUtils"
import {Settings} from "./Settings"
import {State} from "./interface/State"
import {UnorderedSet} from "./datastructures/UnorderedSet"

type StateNameMapping = {[n: string]: number};
type ConnectionMapping = {[n: string]: {[m: string]: Edge}};

export interface AutomatonSummary {
	error: boolean,
	initialState: State,
	stateList: State[],
	edgeList: Edge[]
}

export namespace Persistence {
	export function save(stateList: State[], edgeList: Edge[],
						 initialState: State): string {
		let result: any = [
			Settings.Machine[Settings.currentMachine], // automaton type
			[], // state list
			[], // edge list
			-1  // initial state index
		];

		let i = 0;
		for (let state of stateList) {
			let position = state.getPosition();
			result[1].push([
				state.getName(),
				state.isFinal() ? 1 : 0,
				position.x,
				position.y
			]);

			if (state == initialState) {
				result[3] = i;
			}

			i++;
		}

		for (let edge of edgeList) {
			result[2].push([
				edge.getOrigin().getName(),
				edge.getTarget().getName(),
				edge.getDataList()
			]);
		}

		return JSON.stringify(result);
	}

	export function load(content: string): AutomatonSummary {
		let loadedData: AutomatonSummary = {
			error: false,
			initialState: null,
			stateList: [],
			edgeList: []
		};

		let obj: any = [];
		try {
			obj = JSON.parse(content);
		} catch (e) {
			loadedData.error = true;
			return loadedData;
		}

		let machineType = Settings.Machine[Settings.currentMachine];
		let validation = obj[0] == machineType
					  && obj[1] instanceof Array
					  && obj[2] instanceof Array
					  && typeof obj[3] == "number"
					  && obj.length == 4;

		if (!validation) {
			loadedData.error = true;
			return loadedData;
		}

		let connections: ConnectionMapping = {};
		let nameToIndex = loadStates(obj, loadedData, function(state: State) {
			connections[state.getName()] = {};
		});
		if (!loadEdges(obj, loadedData, nameToIndex, connections)) {
			loadedData.error = true;
			return loadedData;
		}

		return loadedData;
	}

	function loadStates(dataObj: any, result: AutomatonSummary,
						callback: (State) => void): StateNameMapping {
		let nameToIndex: StateNameMapping = {};
		let controller = Settings.controller();

		let i = 0;
		for (let data of dataObj[1]) {
			let isInitial = (dataObj[3] == i);
			let state = new State();
			state.setName(data[0]);
			state.setInitial(isInitial);
			state.setFinal(!!data[1]);
			state.setPosition(data[2], data[3]);

			if (isInitial) {
				result.initialState = state;
			}

			nameToIndex[data[0]] = i;
			callback(state);
			result.stateList.push(state);
			controller.createState(state);
			i++;
		}

		return nameToIndex;
	}

	function loadEdges(data: any, result: AutomatonSummary,
					   nameToIndex: StateNameMapping,
					   connections: ConnectionMapping): boolean {
		let states = result.stateList;
		for (let edgeData of data[2]) {
			if (edgeData.length != 3) {
				return false;
			}
			let edge = new Edge();
			let originName = edgeData[0];
			let targetName = edgeData[1];
			let origin = states[nameToIndex[originName]];
			let target = states[nameToIndex[targetName]];
			edge.setOrigin(origin);
			edge.setTarget(target);
			if (connections[targetName].hasOwnProperty(originName)) {
				let opposite = connections[targetName][originName];
				opposite.setCurveFlag(true);
				edge.setCurveFlag(true);
			}
			for (let data of edgeData[2]) {
				EdgeUtils.addEdgeData(edge, data);
			}

			connections[originName][targetName] = edge;
			result.edgeList.push(edge);
		}

		return true;
	}
}
