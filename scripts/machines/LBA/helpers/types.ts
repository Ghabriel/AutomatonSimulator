/// <reference path="../../../types.ts" />

const enum Direction {
    LEFT, RIGHT
}

interface TapeJSONFields {
    content: NumericMap<string>;
    headPosition: number;
    lowIndex: number;
    highIndex: number;
    boundarySymbols: string[];
}

type TapeJSON = JSONData<TapeJSONFields>;
