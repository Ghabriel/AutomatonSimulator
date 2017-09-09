/**
 * Generic interface representing the color palette of a State.
 */
export interface StatePalette {
	fillColor: string;
	strokeColor: string;
	strokeWidth: number;
	ringStrokeWidth: number;
}

/**
 * Generic interface representing the color palette of an Edge.
 */
export interface EdgePalette {
	strokeColor: string;
	arrowThickness: number;
	arrowLength: number;
	arrowAngle: number;
	textFontFamily: string;
	textFontSize: number;
	textFontColor: string;
}
