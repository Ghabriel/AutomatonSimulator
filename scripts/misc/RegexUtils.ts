export enum Direction {
	UP, DOWN
}

export enum VisitingCommand {
	LEFT, RIGHT, NEXT
}

interface OperatorInfo {
	numOperands: number;
	priority: number;
	descendingCommands: VisitingCommand[];
	ascendingCommands: VisitingCommand[];
}

function info(numOperands: number, priority: number, descCmds: VisitingCommand[],
			  ascCmds: VisitingCommand[]): OperatorInfo {
	return {
		numOperands: numOperands,
		priority: priority,
		descendingCommands: descCmds,
		ascendingCommands: ascCmds
	};
}

const LEFT = VisitingCommand.LEFT;
const RIGHT = VisitingCommand.RIGHT;
const NEXT = VisitingCommand.NEXT;
const operatorInfo: {[s: string]: OperatorInfo} = {
	"?": info(1, 3, [LEFT, NEXT], [NEXT]),
	"*": info(1, 3, [LEFT, NEXT], [LEFT, NEXT]),
	"+": info(1, 3, [LEFT], [LEFT, NEXT]),
	"|": info(2, 1, [LEFT, RIGHT], [NEXT]),
	".": info(2, 2, [LEFT], [RIGHT])
};

export class RegexUtils {
	static numOperands(op: string): number {
		return operatorInfo[op].numOperands;
	}

	static priority(op: string): number {
		return operatorInfo[op].priority;
	}

	static heuristic(op: string, direction: Direction): VisitingCommand[] {
		let info = operatorInfo[op];
		return (direction == Direction.DOWN) ? info.descendingCommands
											 : info.ascendingCommands;
	}
}
