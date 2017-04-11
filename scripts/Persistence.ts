import {Edge} from "./interface/Edge"
import {EdgeUtils} from "./interface/EdgeUtils"
import {Settings} from "./Settings"
import {State} from "./interface/State"

type StateNameMapping = {[n: string]: number};

interface AutomatonSummary {
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


		let nameToIndex = loadStates(obj, loadedData);
		if (!loadEdges(obj, loadedData, nameToIndex)) {
			loadedData.error = true;
			return loadedData;
		}

		return loadedData;
	}

	function loadStates(dataObj: any, result: AutomatonSummary): StateNameMapping {
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
			result.stateList.push(state);
			controller.createState(state);
			i++;
		}

		return nameToIndex;
	}

	
	function loadEdges(data: any, result: AutomatonSummary,
					   nameToIndex: StateNameMapping): boolean {
		let states = result.stateList;
		for (let edgeData of data[2]) {
			if (edgeData.length != 3) {
				return false;
			}
			let edge = new Edge();
			let origin = states[nameToIndex[edgeData[0]]];
			let target = states[nameToIndex[edgeData[1]]];
			edge.setOrigin(origin);
			edge.setTarget(target);
			for (let data of edgeData[2]) {
				EdgeUtils.addEdgeData(edge, data);
			}

			result.edgeList.push(edge);
		}

		return true;
	}
}
