import {FA} from "../machines/FA"
import {Node} from "./Node"
import {Direction, VisitingCommand, RegexUtils} from "./RegexUtils"
import {UnorderedSet} from "../datastructures/UnorderedSet"
import {utils} from "../Utils"

namespace Symbols {
	export let OR = "|";
	export let CONCAT = ".";
	export let OPTIONAL = "?";
	export let FREE = "*";
	export let AT_LEAST_ONE = "+";

	export let modifiers = [OPTIONAL, FREE, AT_LEAST_ONE];
	export let combiners = [OR, CONCAT];
}

// TODO: several arrays used can be replaced by unordered sets.
export class Regex {
	constructor(expression: string) {
		this.expression = expression.replace(/ /g, "");
	}

	// TODO
	isValid(): boolean {
		return true;
	}

	toDeSimoneTree(): Node {
		let regex = this.normalize();
		let treeList = [new Node()];
		for (let i = 0; i < regex.length; i++) {
			if (regex[i] == "(") {
				treeList.push(new Node());
				continue;
			}

			let tree = treeList[treeList.length - 1];
			if (regex[i] == ")") {
				if (treeList.length == 1 || !tree.isValid()) {
					this.error();
				}
				treeList.pop();
				tree.changePriority(10);
				treeList[treeList.length - 1].pushSubtree(tree);
				continue;
			}

			tree.pushSymbol(regex[i]);
			treeList[treeList.length - 1] = tree.root();
		}

		treeList[0].setThreadingLinks();
		treeList[0].setTerminalIndexes();
		return treeList[0];
	}

	// Walks through a De Simone tree starting in a single node, returning a
	// list of all terminal nodes found in the way.
	// TODO: maybe this can be private?
	deSimoneCall(node: Node, direction: Direction, nodeList: UnorderedSet) {
		if (node === null) {
			if (direction == Direction.UP) {
				nodeList.insert(Node.lambdaIndex());
			}
			return;
		}

		let left = function() {
			this.deSimoneCall(node.left, Direction.DOWN, nodeList);
		};

		let right = function() {
			this.deSimoneCall(node.right, Direction.DOWN, nodeList);
		};

		let next = function() {
			this.deSimoneCall(node.threadingLink, Direction.UP, nodeList);
		};

		if (!node.isOperator) {
			if (direction == Direction.DOWN) {
				nodeList.insert(node.index);
			} else {
				next.call(this);
			}
			return;
		}

		let visitHeuristic = RegexUtils.heuristic(node.data, direction);
		for (let i = 0; i < visitHeuristic.length; i++) {
			switch (visitHeuristic[i]) {
				case VisitingCommand.LEFT:
					left.call(this);
					break;
				case VisitingCommand.RIGHT:
					right.call(this);
					break;
				case VisitingCommand.NEXT:
					// Fixes a bug where the | operator erroneously goes to
					// lambda when going up

					// TODO: is this fix really necessary? next() goes to the
					// threading link, not directly to the parent. If it does
					// erroneously go to lambda, then maybe the threading link
					// isn't being set before reaching this point?
					while (node.right) {
						node = node.right;
					}
					next.call(this);
					break;
			}
		}
	};

	// Walks through a De Simone tree starting in one node, returning
	// a set of all terminal nodes found in the way.
	deSimoneStep(node: Node, direction: Direction): UnorderedSet {
		let result = new UnorderedSet();
		this.deSimoneCall(node, direction, result);
		return result;
	};

	deSimoneStepArray(nodes: Node[]): UnorderedSet {
		let result = new UnorderedSet();
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i].direction != Direction.UP && nodes[i].direction != Direction.DOWN) continue;
			// result = result.concat(this.deSimoneStep(nodes[i], nodes[i].direction));
			// TODO: find a better name to this variable
			let otherNodes = this.deSimoneStep(nodes[i], nodes[i].direction);
			otherNodes.forEach(function(value) {
				result.insert(value);
			});
		}
		return result;
	}

	// Walks through a De Simone tree, adding new states to a finite automaton
	// and registering their state compositions to avoid producing equivalent
	// states.
	produceStates(subtrees: Node|Node[], dfa: FA,
				  stateCompositions: {[s: string]: UnorderedSet}) {
		if (!(subtrees instanceof Array)) {
			subtrees.direction = Direction.DOWN;
			subtrees = [subtrees];
		}

		let composition = this.deSimoneStepArray(subtrees);
		// Utilities.removeDuplicates(composition);

		let compositionMatches = false;
		utils.foreach(stateCompositions, function(stateName, comp) {
			if (Utilities.isSameArray(stateCompositions[i], composition)) {
				compositionMatches = true;
				return false; // exits the loop
			}
		});

		if (compositionMatches) {
			return composition;
		}

		let stateName = Utilities.generateStateName(dfa.numStates());
		dfa.addState(stateName);

		// console.log("=====================");
		let nodeListByTerminal = {};
		let lambda = false;
		composition.forEach(function(value) {
			if (value == Node.lambdaIndex()) {
				lambda = true;
				return;
			}
			let node = subtrees[0].root().searchByIndex(value);
			if (!nodeListByTerminal.hasOwnProperty(node.data)) {
				nodeListByTerminal[node.data] = [];
			}

			node.direction = Direction.UP;
			nodeListByTerminal[node.data].push(node);
		});
		// console.log(nodeListByTerminal);

		if (lambda) {
			dfa.addAcceptingState(stateName);
		}
		stateCompositions[stateName] = composition;

		let targetCompositions = {};
		let i = 0;
		utils.foreach(nodeListByTerminal, function(key, value) {
			let targetComposition = this.produceStates(value, dfa, stateCompositions);
			targetCompositions[i] = targetComposition;
			i++;
		});
		stateCompositions[stateName].target = targetCompositions;
		return composition;
	};

	// TODO: maybe parameterize this method?
	private error(): void {
		throw "Error: invalid regex";
	}

	// Adds concatenation wherever it's implicit. Returns the new regex.
	private normalize(): string {
		let result = "";
		if (!this.isValid()) {
			// TODO: maybe throw an exception?
			return result;
		}

		let noConcat = true;
		let expr = this.expression;
		for (let i = 0; i < expr.length; i++) {
			if (expr[i] == Symbols.CONCAT) {
				continue;
			}

			if (!this.isModifier(expr[i])
			 && !this.isCombiner(expr[i])
			 && expr[i] != ")"
			 && !noConcat) {
				result += Symbols.CONCAT;
			}

			result += expr[i];
			noConcat = expr[i] == "(" || this.isCombiner(expr[i]);
		}
		return result;
	}

	private isModifier(symbol: string): boolean {
		return Symbols.modifiers.indexOf(symbol) != -1;
	}

	private isCombiner(symbol: string): boolean {
		return Symbols.combiners.indexOf(symbol) != -1;
	}

	private expression: string;
}
