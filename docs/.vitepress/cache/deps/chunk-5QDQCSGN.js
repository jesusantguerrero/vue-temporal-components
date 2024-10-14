import {
  requiredArgs,
  toDate
} from "./chunk-6PU2QWP6.js";

// node_modules/date-fns/esm/isWeekend/index.js
function isWeekend(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var day = date.getDay();
  return day === 0 || day === 6;
}

export {
  isWeekend
};
//# sourceMappingURL=chunk-5QDQCSGN.js.map
