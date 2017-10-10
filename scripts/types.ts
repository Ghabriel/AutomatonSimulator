
type NumericMap<T> = {[key: number]: T};
type Map<T> = {[key: string]: T};

type Generator<T> = () => T;
type Callback<T> = (value: T) => void;
type SimpleCallback = Generator<void>;

interface Point {
	x: number;
	y: number;
}

type IndexedEdgeGroup<TEdge/* extends Edge<T>*/> = {
	[origin: string]: {
		[target: string]: TEdge
	}
};

interface State {
	x: number;
	y: number;
	initial: boolean;
	final: boolean;
	name: string;

	// Facilitates polymorphism
	type: "state";
}

interface PartialEdge<TState extends State> {
	origin?: TState;
	target?: TState;

	// A list of texts written in this edge
	textList: string[];

	// A list of data lists used by the controllers to
	// precisely define this transition
	dataList: string[][];

	// Facilitates polymorphism
	type: "edge";
}

interface Edge<TState extends State> extends PartialEdge<TState> {
	origin: TState;
	target: TState;
}

type HTMLPrinter<T> = (instance: T) => HTMLElement;
