import {Direction, RegexUtils} from "./RegexUtils"

export class Node {
	override(oldTree: Node, newTree: Node): void {
		if (this.parent == oldTree) {
			this.parent = newTree;
		}
		this.overrideSide(oldTree, newTree, "left");
		this.overrideSide(oldTree, newTree, "right");
	}

	// Adds a subtree to this tree.
	pushSubtree(tree: Node): void {
		this.push(tree, function(tree) {
			// TODO: should the parent node be overriden?
			this.isOperator = tree.isOperator;
			this.priority = tree.priority;
			this.data = tree.data;
			this.left = tree.left;
			this.right = tree.right;
			this.index = tree.index;
			this.override(tree, this);
		}, function(tree) {
			return tree;
		}, function(tree) {
			this.right.pushSubtree(tree);
		});
	}

	pushTerminal(char: string): void {
		this.push(char, function(char) {
			this.data = char;
		}, function(char) {
			let result = new Node();
			result.data = char;
			return result;
		}, function(char) {
			this.right.pushTerminal(char);
		});
	}

	pushOperator(op: string): void {
		let priority = RegexUtils.priority(op);
		if (this.data === null) {
			this.isOperator = true;
			this.priority = priority;
			this.data = op;
			return;
		}

		if (this.isOperator && !this.right && RegexUtils.numOperands(this.data) == 2) {
			let node = new Node();
			node.pushOperator(op);
			node.parent = this;
			this.right = node;
			return;
		}

		if (!this.isOperator || this.priority > priority) {
			let node = new Node();
			node.pushOperator(op);
			node.parent = this.parent;
			node.left = this;
			if (this.parent !== null) {
				if (this.parent.left == this) {
					this.parent.left = node;
				} else {
					this.parent.right = node;
				}
			}
			this.parent = node;
			return;
		}

		if (this.priority < priority) {
			this.right.pushOperator(op);
			return;
		}

		// TODO: is this possible?
		this.error();
	}

	// TODO
	pushSymbol(symbol: string): void {

	}

	// Changes the priority of all the operators in this tree by a given amount.
	changePriority(delta: number): void {
		if (this.left) {
			this.left.changePriority(delta);
		}

		if (this.isOperator) {
			this.priority += delta;
		}

		if (this.right) {
			this.right.changePriority(delta);
		}
	}

	// Checks if this tree is valid.
	isValid(): boolean {
		if (this.data === null) {
			return false;
		}

		if (this.left && !this.left.isValid()) return false;
		if (this.right && !this.right.isValid()) return false;
		if (this.isOperator) {
			if (!this.left) return false;
			if (!this.right && RegexUtils.numOperands(this.data) == 2) {
				return false;
			}
		}
		return true;
	}

	// Adds the threading links to all nods in this subtree.
	// A null threading link represents lambda.
	setThreadingLinks(): Node {
		if (this.left) {
			let leftLink = this.left.setThreadingLinks();
			leftLink.threadingLink = this;
		}

		if (this.right) {
			return this.right.setThreadingLinks();
		}

		return this;
	}

	// Calculates and sets the index of all terminal nodes in this tree.
	setTerminalIndexes(valueContainer?: {index: number}): void {
		if (!valueContainer) {
			valueContainer = {index: 1};
		}

		if (!this.isOperator) {
			this.index = valueContainer.index++;
		}

		if (this.left) {
			this.left.setTerminalIndexes(valueContainer);
		}

		if (this.right) {
			this.right.setTerminalIndexes(valueContainer);
		}
	}

	// Returns a node of this tree with a given index.
	searchByIndex(index: number): Node {
		if (this.index == index) {
			return this;
		}

		let node = null;
		if (this.left) node = this.left.searchByIndex(index);
		if (this.right) node = node || this.right.searchByIndex(index);
		return node;
	}

	// Returns the root of this tree.
	root(): Node {
		let node: Node = this;
		while (node.parent) {
			node = node.parent;
		}
		return node;
	}

	// Returns a list containing the leaf nodes of this tree.
	getLeafNodes(): Node[] {
		let result: Node[] = [];
		this.fillLeafList(result);
		return result;
	}

	debug(): void {
		this.debugHelper(1);
 	};

 	static lambdaIndex(): number {
 		return -1;
 	}

	private debugHelper(indent: number): void {
		let threadingLink = this.threadingLink;
		if (!threadingLink) {
			threadingLink = new Node();
			threadingLink.data = "lambda";
		}
		console.log('-' + Array(indent).join('--'), this.data + " (" + threadingLink.data + ")");
		if (this.left) this.left.debugHelper(indent + 1);
		if (this.right) this.right.debugHelper(indent + 1);
	};

	private fillLeafList(container: Node[]): void {
		if (!this.left && !this.right) {
			container.push(this);
		}

		if (this.left) {
			this.left.fillLeafList(container);
		}

		if (this.right) {
			this.right.fillLeafList(container);
		}
	}

	private push(param: any, nullCallback: (p: any) => void,
				 rightChild: (p: any) => Node, fallback: (p: any) => void): void {
		if (this.data === null) {
			nullCallback.call(this, param);
			return;
		}

		if (!this.isOperator) {
			this.error();
		}

		if (!this.right) {
			if (RegexUtils.numOperands(this.data) != 2) {
				this.error();
			}
			this.right = rightChild.call(this, param);
			this.right.parent = this;
		} else {
			fallback.call(this, param);
		}
	}

	// TODO: maybe parameterize this method?
	private error(): void {
		throw "Error: invalid regex";
	}

	private overrideSide(oldTree: Node, newTree: Node, side: string): void {
		if (this[side]) {
			if (this[side] == oldTree) {
				this[side] = newTree;
			} else {
				this[side].override(oldTree, newTree);
			}

			if (this[side].parent == oldTree) {
				this[side].parent = newTree;
			}
		}
	}

	// TODO: I don't want these to be public...
	public isOperator: boolean;
	public priority: number = 0;
	public data = null;
	public left: Node = null;
	public right: Node = null;
	public parent: Node = null;
	public threadingLink = null;
	public index = null;
	public direction: Direction = null;
}
