import {
  isSameDay
} from "./chunk-PDNDNDGQ.js";
import "./chunk-6PU2QWP6.js";
import "./chunk-FNTODMS7.js";
import "./chunk-ZC22LKFR.js";

// node_modules/date-fns/esm/fp/_lib/convertToFP/index.js
function convertToFP(fn, arity) {
  var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
  if (a.length >= arity) {
    return fn.apply(null, a.slice(0, arity).reverse());
  }
  return function() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return convertToFP(fn, arity, a.concat(args));
  };
}

// node_modules/date-fns/esm/fp/isSameDay/index.js
var isSameDay_default = convertToFP(isSameDay, 2);
export {
  isSameDay_default as default
};
//# sourceMappingURL=date-fns_fp_isSameDay.js.map
