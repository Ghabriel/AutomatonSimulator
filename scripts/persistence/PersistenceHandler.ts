import {Edge} from "../interface/Edge"
import {State} from "../interface/State"

export interface AutomatonSummary {
	aborted: boolean,
	error: boolean,
	initialState: State,
	stateList: State[],
	edgeList: Edge[]
}

export interface PersistenceHandler {
	save(stateList: State[], edgeList: Edge[], initialState: State): string;
	load(content: string): AutomatonSummary;
}
