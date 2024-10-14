import {
  toInteger
} from "./chunk-3YKCWWWF.js";
import {
  requiredArgs,
  toDate
} from "./chunk-6PU2QWP6.js";

// node_modules/date-fns/esm/addDays/index.js
function addDays(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var amount = toInteger(dirtyAmount);
  if (isNaN(amount)) {
    return /* @__PURE__ */ new Date(NaN);
  }
  if (!amount) {
    return date;
  }
  date.setDate(date.getDate() + amount);
  return date;
}

export {
  addDays
};
//# sourceMappingURL=chunk-WSSNYPTA.js.map
