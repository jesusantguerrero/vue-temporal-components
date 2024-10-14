import {
  requiredArgs,
  toDate
} from "./chunk-6PU2QWP6.js";

// node_modules/date-fns/esm/endOfMonth/index.js
function endOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var month = date.getMonth();
  date.setFullYear(date.getFullYear(), month + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

export {
  endOfMonth
};
//# sourceMappingURL=chunk-VPTY6SEF.js.map
