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

/**
 * Encapsulates a general-purpose publish-subscribe system.
 * Used mainly to decouple several parts of the application
 * (e.g the mainbar and the sidebar). This class allows, for
 * example, that the sidebar be completely removed and the
 * mainbar continues to work perfectly, even when the latter
 * sends signals to the former.
 */
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
