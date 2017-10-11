/// <reference path="../../../types.ts" />

const enum Direction {
    LEFT, RIGHT
}

interface TapeJSONFields {
    content: NumericMap<string>;
    headPosition: number;
    lowIndex: number;
    highIndex: number;
}

type TapeJSON = JSONData<TapeJSONFields>;
