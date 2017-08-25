// Allows easy modification if a better structure is found
// export type Signal = any;

export interface Signal {
	targetID: string;
	identifier: string;
	data: any;
}

export interface SignalResponse {
	reacted: boolean;
	response: any;
}

export interface SignalObserver {
	receiveSignal: (signal: Signal) => SignalResponse;
}

export class SignalEmitter {
	// Registers a new signal observer, which will be notified
	// when any signal is transmitted.
	static addSignalObserver(observer: SignalObserver): void {
		this.signalObservers.push(observer);
	}

	// Emits a signal to all signal observers, returning
	// the response of the first one that reacts to it.
	// Returns null if there was no reaction.
	static emitSignal(signal: Signal): any {
		for (let observer of this.signalObservers) {
			let response = observer.receiveSignal(signal);
			if (response && response.reacted) {
				return response.response;
			}
		}

		return null;
	}

	private static signalObservers: SignalObserver[] = [];
}

// SignalEmitter.addSignalObserver({
// 	receiveSignal: function(signal: Signal): SignalResponse {
// 		console.log("[SIGNAL]", signal.targetID + "::" + signal.identifier);
// 		return null;
// 	}
// });
