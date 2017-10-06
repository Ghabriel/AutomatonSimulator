/// <reference path="../types.ts" />

export interface AutomatonSummary {
	aborted: boolean,
	error: boolean,
	initialState: State|null,
	stateList: Map<State>,
	edgeList: IndexedEdgeGroup<Edge<State>>
}

/**
 * Generic interface for classes that handle persistence.
 * Any class that implements this interface can be used in AutomatonRenderer.
 */
export interface PersistenceHandler {
	save(stateList: Map<State>, edgeList: IndexedEdgeGroup<Edge<State>>,
		initialState: State|null): string;
	load(content: string): AutomatonSummary;
}
