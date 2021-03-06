/**
 * Encapsulates key codes and special symbols used by the application.
 */
export namespace Keyboard {
	export const keys = {
		"A": 65,
		"B": 66,
		"C": 67,
		"D": 68,
		"E": 69,
		"F": 70,
		"G": 71,
		"H": 72,
		"I": 73,
		"J": 74,
		"K": 75,
		"L": 76,
		"M": 77,
		"N": 78,
		"O": 79,
		"P": 80,
		"Q": 81,
		"R": 82,
		"S": 83,
		"T": 84,
		"U": 85,
		"V": 86,
		"W": 87,
		"X": 88,
		"Y": 89,
		"Z": 90,
		"0": 48,
		"1": 49,
		"2": 50,
		"3": 51,
		"4": 52,
		"5": 53,
		"6": 54,
		"7": 55,
		"8": 56,
		"9": 57,
		"ENTER": 13,
		"SHIFT": 16,
		"SPACE": 32,
		"ESC": 27,
		"DELETE": 46,
		"LEFT": 37,
		"UP": 38,
		"RIGHT": 39,
		"DOWN": 40,
		"+": 61,
		"-": 173
	};

	export const symbols = {
		delta: "δ",
		epsilon: "ε",
		gamma: "Γ",
		sigma: "Σ",
		leftArrow: "←",
		rightArrow: "→"
	};

	export type Key = keyof typeof keys;
}
