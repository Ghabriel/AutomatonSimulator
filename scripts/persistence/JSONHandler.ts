/// <reference path="../types.ts" />

import {EdgeUtils} from "../interface/EdgeUtils"
import {AutomatonSummary, PersistenceHandler} from "./PersistenceHandler"
import {Settings, Strings} from "../Settings"
import {SignalEmitter} from "../SignalEmitter"
import {utils} from "../Utils"

type SavedStructure = [
	string, // automaton type
	[string, number, number, number][], // state list
	[string, string, string[][]][], // edge list
	string // initial state name
];

const ABORT_LOOP = false;
const CONTINUE_LOOP = true;

/**
 * The default persistence handler used by the application. Stores
 * and loads the program state in a compact, low-redundance JSON format.
 */
export class JSONHandler implements PersistenceHandler {
	public save(stateList: Map<State>, edgeList: IndexedEdgeGroup<Edge<State>>,
		initialState: State|null): string {

		let result: SavedStructure = [
			Settings.Machine[Settings.currentMachine], // automaton type
			[], // state list
			[], // edge list
			""  // initial state name
		];

		this.saveStates(result, stateList, initialState);
		this.saveEdges(result, edgeList);

		return JSON.stringify(result);
	}

	public load(content: string): AutomatonSummary {
		let loadedData: AutomatonSummary = {
			aborted: false,
			error: false,
			initialState: null,
			stateList: {},
			edgeList: {}
		};

		let obj;
		try {
			obj = JSON.parse(content);
		} catch (e) {
			loadedData.error = true;
			return loadedData;
		}
	
		if (!this.matchesCorrectStructure(obj)) {
			loadedData.error = true;
			return loadedData;
		}

		let machineType = Settings.Machine[Settings.currentMachine];

		if (obj[0] != machineType) {
			let resultingData = this.handleDifferentMachineType(obj, loadedData);
			if (resultingData) {
				return resultingData;
			}
		}

		this.loadStates(obj, loadedData, function(state) {
			obj[state.name] = {};
		});

		if (!this.loadEdges(obj, loadedData)) {
			loadedData.error = true;
			return loadedData;
		}

		return loadedData;
	}

	private saveStates(result: SavedStructure, stateList: Map<State>,
		initialState: State|null): void {

		utils.foreach(stateList, function(name, state) {
			result[1].push([
				state.name,
				state.final ? 1 : 0,
				state.x,
				state.y
			]);

			if (state == initialState) {
				result[3] = state.name;
			}
		});
	}

	private saveEdges(result: SavedStructure,
		edgeList: IndexedEdgeGroup<Edge<State>>): void {

		EdgeUtils.edgeIteration(edgeList, function(edge) {
			result[2].push([
				edge.origin.name,
				edge.target.name,
				edge.dataList
			]);
		});
	}

	private matchesCorrectStructure(obj: any): obj is SavedStructure {
		return obj[0] instanceof String
			&& obj[1] instanceof Array
			&& obj[2] instanceof Array
			&& obj[3] instanceof String;
	}

	private handleDifferentMachineType(obj: SavedStructure,
		loadedData: AutomatonSummary): AutomatonSummary|null {

		if (!confirm(Strings.DIFFERENT_MACHINE_FILE)) {
			loadedData.aborted = true;
			return loadedData;
		}

		utils.foreach(Settings.machines, function(index, traits) {
			if (traits.abbreviatedName == obj[0]) {
				SignalEmitter.emitSignal({
					targetID: Settings.sidebarSignalID,
					identifier: "changeMachineType",
					data: [index]
				});
				return ABORT_LOOP;
			}

			return CONTINUE_LOOP;
		});

		return null;
	}

	private loadStates(dataObj: SavedStructure, result: AutomatonSummary,
						callback: (state: State) => void): void {
		let controller = Settings.controller();

		for (let data of dataObj[1]) {
			let isInitial = (dataObj[3] == data[0]);

			let state: State = {
				x: data[2],
				y: data[3],
				initial: isInitial,
				final: !!data[1],
				name: data[0],
				type: "state"
			};

			if (isInitial) {
				result.initialState = state;
			}

			callback(state);
			result.stateList[state.name] = state;
			controller.createState(state);
		}
	}

	private loadEdges(data: SavedStructure, result: AutomatonSummary): boolean {
		let {stateList, edgeList} = result;

		for (let edgeData of data[2]) {
			if (edgeData.length != 3) {
				return false;
			}

			let [origin, target, dataList] = edgeData;

			let edge: Edge<State> = {
				origin: stateList[origin],
				target: stateList[target],
				textList: [],
				dataList: [],
				type: "edge"
			};

			if (edgeList[target].hasOwnProperty(origin)) {
				let opposite = edgeList[target][origin];
				opposite.setCurveFlag(true);
				edge.setCurveFlag(true);
			}

			for (let data of dataList) {
				EdgeUtils.addEdgeData(edge, data);
			}

			edgeList[origin][target] = edge;
		}

		return true;
	}
}
