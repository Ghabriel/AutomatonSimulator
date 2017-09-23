/**
 * Encasulates information about the user browser.
 */
export namespace Browser {
	const data = info();
	export const name = data.name;
	export const version = data.version;

	// Based on http://stackoverflow.com/a/16204644
	function info() {
		let ua = navigator.userAgent.toLowerCase();
		let test = function(regex: RegExp) {
			return regex.test(ua);
		};

		let data = {
			msie: test(/msie/) || test(/trident/),
			edge: test(/edge/),
			firefox: test(/mozilla/) && test(/firefox/),
			chrome: test(/webkit/) && test(/chrome/) && !test(/edge/),
			safari: test(/safari/) && test(/applewebkit/) && !test(/chrome/),
			opera: test(/opera/)
		};

		let browserName = "";
		let version = "Unknown";
		let name: keyof typeof data;
		for (name in data) {
			if (data.hasOwnProperty(name) && data[name]) {
				browserName = name;
				let regex = new RegExp(name + "( |/)([0-9]+)");
				let matches = ua.match(regex);
				if (matches) {
					version = matches[2];
				} else if (matches = ua.match(/rv:([0-9]+)/)) {
					version = matches[1];
				}
			}
		}

		return {
			name: browserName,
			version: version
		};
	}
}
