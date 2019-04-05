// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"TNIp":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// CustomEvent polyfill. Source: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function () {
  if (typeof window.CustomEvent === 'function') {
    return false;
  }

  function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

var mq = null;
var orientationMediaQuery = matchMedia('(orientation: landscape)');
var retinaMediaQuery = matchMedia("\n\t(-webkit-min-device-pixel-ratio: 2),\n\t(-min-moz-device-pixel-ratio: 2),\n\t(-o-min-device-pixel-ratio: 2/1),\n\t(min-device-pixel-ratio: 2),\n\t(min-resolution: 192dpi),\n\t(min-resolution: 2dppx)\n");

var _default = function () {
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
  var breakpointEvent = new CustomEvent('breakpoint-change', {
    detail: mq
  });
  var extractedStyles = extractStyles();
  var mediaQueryPairs = parseStyle(extractedStyles);

  if (mediaQueryPairs.length === 1) {
    console.warn('Please use foundation-sites of version atleast 6.0');
    return;
  }

  var mediaQueries = mediaQueryPairs.map(function (pair, index) {
    var name = pair.name,
        value = pair.value;
    pair.query = "(min-width: ".concat(value, ")");
    pair.matchMedia = matchMedia(pair.query);
    pair.matchMedia.addListener(mediaQueryChangeListener);
    return _objectSpread({}, pair, {
      index: index
    });
  });
  var ilen = mediaQueries.length;
  var currentBreakpointList = [];
  var currentBreakpoint = getCurrentBreakpoint(true);
  /**
   * @param [full = false] Should use full format
   * @return {Object|String}
   */

  function getCurrentBreakpoint() {
    var full = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    currentBreakpointList = [mediaQueries[0].name];

    for (var i = 1; i < ilen; i++) {
      if (!mediaQueries[i].matchMedia.matches) {
        return full ? mediaQueries[i - 1] : mediaQueries[i - 1].name;
      }

      currentBreakpointList.push(mediaQueries[i].name);
    }

    return full ? mediaQueries[ilen - 1] : mediaQueries[ilen - 1].name;
  }

  function mediaQueryChangeListener(e) {
    var newBreakpoint = getCurrentBreakpoint(true);
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
    var question = target.split(' ');

    switch (question[0]) {
      case 'landscape':
      case 'portrait':
      case 'retina':
        return mq[question[0]];

      default:
        break;
    }

    var index = currentBreakpointList.indexOf(question[0]);

    if (index === -1) {
      return false;
    }

    if (question.length > 1) {
      return index === currentBreakpointList.length - 1;
    }

    return true;
  }

  function extractStyles() {
    var meta = document.createElement('meta');
    meta.classList.add('foundation-mq');
    document.head.appendChild(meta);
    return window.getComputedStyle(meta).getPropertyValue('font-family');
  } // Thank you: https://github.com/sindresorhus/query-string


  function parseStyle(styleString) {
    var styleObject = [];

    if (typeof styleString !== 'string') {
      return styleObject;
    }

    styleString = styleString.trim().slice(1, -1); // browsers re-quote string style values

    if (!styleString) {
      return styleObject;
    }

    var bits = styleString.split('&'),
        ret = Array(bits.length);
    styleObject = bits.reduce(function (carry, param, currentIndex) {
      var parts = param.replace(/\+/g, ' ').split('=');
      var name = parts[0];
      var value = parts[1];
      name = decodeURIComponent(name); // missing `=` should be `null`:
      // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters

      value = value === undefined ? null : decodeURIComponent(value);

      if (!carry.hasOwnProperty(name)) {
        carry[currentIndex] = {
          name: name,
          value: value
        };
      }

      return carry;
    }, ret);
    return styleObject;
  }

  return mq;
}();

exports.default = _default;
},{}]},{},["TNIp"], null)