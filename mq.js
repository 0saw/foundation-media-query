// CustomEvent polyfill. Source: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function () {
	if (typeof window.CustomEvent === 'function') {
		return false;
	}

	function CustomEvent(event, params) {
		params = params || {bubbles: false, cancelable: false, detail: undefined};
		let evt = document.createEvent('CustomEvent');
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
})();


let mq = null;

let orientationMediaQuery = matchMedia('(orientation: landscape)');

let retinaMediaQuery = matchMedia(`
	(-webkit-min-device-pixel-ratio: 2),
	(-min-moz-device-pixel-ratio: 2),
	(-o-min-device-pixel-ratio: 2/1),
	(min-device-pixel-ratio: 2),
	(min-resolution: 192dpi),
	(min-resolution: 2dppx)
`);


export default (function () {
	if (mq) {
		return mq;
	}

	window.mq = mq = {
		is: questionCurrentBreakpoint,
		get current() {
			return getCurrentBreakpoint();
		},
		get currentFull() {
			return getCurrentBreakpoint(true);
		},
		get landscape() {
			return orientationMediaQuery.matches;
		},
		get portrait() {
			return !orientationMediaQuery.matches;
		},
		get retina() {
			return retinaMediaQuery.matches;
		}
	};

	let breakpointEvent = new CustomEvent('breakpoint-changed', {detail: mq});

	let extractedStyles = extractStyles();
	let mediaQueryPairs = parseStyle(extractedStyles);

	if (mediaQueryPairs.length === 1) {
		console.warn('Please use foundation-sites of version atleast 6.0');
		return;
	}

	let mediaQueries = mediaQueryPairs.map((pair, index) => {
		let {name, value} = pair;

		pair.query = `(min-width: ${value})`;
		pair.matchMedia = matchMedia(pair.query);

		pair.matchMedia.addListener(mediaQueryChangeListener);

		return {
			...pair,
			index
		};
	});

	let ilen = mediaQueries.length;
	let currentBreakpointList = [];
	let currentBreakpoint = getCurrentBreakpoint(true);

	/**
	 * @param [full = false] Should use full format
	 * @return {Object|String}
	 */
	function getCurrentBreakpoint(full = false) {
		currentBreakpointList = [mediaQueries[0].name];

		for (let i = 1; i < ilen; i++) {
			if (!mediaQueries[i].matchMedia.matches) {
				return full ? mediaQueries[i - 1] : mediaQueries[i - 1].name;
			}

			currentBreakpointList.push(mediaQueries[i].name);
		}

		return full ? mediaQueries[ilen - 1] : mediaQueries[ilen - 1].name;
	}

	function mediaQueryChangeListener(e) {
		let newBreakpoint = getCurrentBreakpoint(true);

		document.dispatchEvent(breakpointEvent);

		currentBreakpoint = newBreakpoint;
	}

	/**
	 * Examples
	 *
	 * .is('medium[ only]')
	 * .is('landscape')
	 * .is('retina')
	 *
	 * @param {String} target
	 * @return {Boolean}
	 */
	function questionCurrentBreakpoint(target) {
		let question = target.split(' ');

		switch (question[0]) {
			case 'landscape':
			case 'portrait':
			case 'retina':
				return mq[question[0]];
			default:
				break;
		}

		let index = currentBreakpointList.indexOf(question[0]);

		if (index === -1) {
			return false;
		}

		if (question.length > 1) {
			return index === (currentBreakpointList.length - 1);
		}

		return true;
	}

	function extractStyles() {
		const meta = document.createElement('meta');
		meta.classList.add('foundation-mq');

		document.head.appendChild(meta);

		return window.getComputedStyle(meta).getPropertyValue('font-family');
	}

	// Thank you: https://github.com/sindresorhus/query-string
	function parseStyle(styleString) {
		let styleObject = [];

		if (typeof styleString !== 'string') {
			return styleObject;
		}

		styleString = styleString.trim().slice(1, -1); // browsers re-quote string style values

		if (!styleString) {
			return styleObject;
		}

		let bits = styleString.split('&'),
			ret = Array(bits.length);

		styleObject = bits.reduce(function(carry, param, currentIndex) {
			let parts = param.replace(/\+/g, ' ').split('=');
			let name = parts[0];
			let value = parts[1];
			name = decodeURIComponent(name);

			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			value = value === undefined ? null : decodeURIComponent(value);

			if (!carry.hasOwnProperty(name)) {
				carry[currentIndex] = {name, value};
			}
			return carry;
		}, ret);

		return styleObject;
	}

	return mq;
})();
