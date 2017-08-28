import {Edge} from "../interface/Edge"
import {State} from "../interface/State"

export interface AutomatonSummary {
	aborted: boolean,
	error: boolean,
	initialState: State,
	stateList: State[],
	edgeList: Edge[]
}

/**
 * Generic interface for classes that handle persistence.
 * Any class that implements this interface can be used in AutomatonRenderer.
 */
export interface PersistenceHandler {
	save(stateList: State[], edgeList: Edge[], initialState: State): string;
	load(content: string): AutomatonSummary;
}
