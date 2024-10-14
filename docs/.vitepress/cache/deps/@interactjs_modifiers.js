import {
  addEdges,
  clone,
  extend,
  getOriginXY_default,
  hypot_default,
  interact_default,
  is_default,
  rectToXY,
  resolveRectLike,
  tlbrToXywh,
  xywhToTlbr
} from "./chunk-NZVBT32X.js";
import {
  __export,
  __publicField
} from "./chunk-ZC22LKFR.js";

// node_modules/@interactjs/snappers/all.js
var all_exports = {};
__export(all_exports, {
  edgeTarget: () => edgeTarget_default,
  elements: () => elements_default,
  grid: () => grid_default
});

// node_modules/@interactjs/snappers/edgeTarget.js
var edgeTarget_default = () => {
};

// node_modules/@interactjs/snappers/elements.js
var elements_default = () => {
};

// node_modules/@interactjs/snappers/grid.js
var grid_default = (grid) => {
  const coordFields = [["x", "y"], ["left", "top"], ["right", "bottom"], ["width", "height"]].filter(([xField, yField]) => xField in grid || yField in grid);
  const gridFunc = (x, y) => {
    const {
      range,
      limits = {
        left: -Infinity,
        right: Infinity,
        top: -Infinity,
        bottom: Infinity
      },
      offset = {
        x: 0,
        y: 0
      }
    } = grid;
    const result = {
      range,
      grid,
      x: null,
      y: null
    };
    for (const [xField, yField] of coordFields) {
      const gridx = Math.round((x - offset.x) / grid[xField]);
      const gridy = Math.round((y - offset.y) / grid[yField]);
      result[xField] = Math.max(limits.left, Math.min(limits.right, gridx * grid[xField] + offset.x));
      result[yField] = Math.max(limits.top, Math.min(limits.bottom, gridy * grid[yField] + offset.y));
    }
    return result;
  };
  gridFunc.grid = grid;
  gridFunc.coordFields = coordFields;
  return gridFunc;
};

// node_modules/@interactjs/snappers/plugin.js
var snappersPlugin = {
  id: "snappers",
  install(scope) {
    const {
      interactStatic: interact
    } = scope;
    interact.snappers = extend(interact.snappers || {}, all_exports);
    interact.createSnapGrid = interact.snappers.grid;
  }
};
var plugin_default = snappersPlugin;

// node_modules/@interactjs/modifiers/Modification.js
var Modification = class {
  constructor(interaction) {
    __publicField(this, "states", []);
    __publicField(this, "startOffset", {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    });
    __publicField(this, "startDelta");
    __publicField(this, "result");
    __publicField(this, "endResult");
    __publicField(this, "startEdges");
    __publicField(this, "edges");
    __publicField(this, "interaction");
    this.interaction = interaction;
    this.result = createResult();
    this.edges = {
      left: false,
      right: false,
      top: false,
      bottom: false
    };
  }
  start({
    phase
  }, pageCoords) {
    const {
      interaction
    } = this;
    const modifierList = getModifierList(interaction);
    this.prepareStates(modifierList);
    this.startEdges = extend({}, interaction.edges);
    this.edges = extend({}, this.startEdges);
    this.startOffset = getRectOffset(interaction.rect, pageCoords);
    this.startDelta = {
      x: 0,
      y: 0
    };
    const arg = this.fillArg({
      phase,
      pageCoords,
      preEnd: false
    });
    this.result = createResult();
    this.startAll(arg);
    const result = this.result = this.setAll(arg);
    return result;
  }
  fillArg(arg) {
    const {
      interaction
    } = this;
    arg.interaction = interaction;
    arg.interactable = interaction.interactable;
    arg.element = interaction.element;
    arg.rect || (arg.rect = interaction.rect);
    arg.edges || (arg.edges = this.startEdges);
    arg.startOffset = this.startOffset;
    return arg;
  }
  startAll(arg) {
    for (const state of this.states) {
      if (state.methods.start) {
        arg.state = state;
        state.methods.start(arg);
      }
    }
  }
  setAll(arg) {
    const {
      phase,
      preEnd,
      skipModifiers,
      rect: unmodifiedRect,
      edges: unmodifiedEdges
    } = arg;
    arg.coords = extend({}, arg.pageCoords);
    arg.rect = extend({}, unmodifiedRect);
    arg.edges = extend({}, unmodifiedEdges);
    const states = skipModifiers ? this.states.slice(skipModifiers) : this.states;
    const newResult = createResult(arg.coords, arg.rect);
    for (const state of states) {
      var _state$methods;
      const {
        options
      } = state;
      const lastModifierCoords = extend({}, arg.coords);
      let returnValue = null;
      if ((_state$methods = state.methods) != null && _state$methods.set && this.shouldDo(options, preEnd, phase)) {
        arg.state = state;
        returnValue = state.methods.set(arg);
        addEdges(arg.edges, arg.rect, {
          x: arg.coords.x - lastModifierCoords.x,
          y: arg.coords.y - lastModifierCoords.y
        });
      }
      newResult.eventProps.push(returnValue);
    }
    extend(this.edges, arg.edges);
    newResult.delta.x = arg.coords.x - arg.pageCoords.x;
    newResult.delta.y = arg.coords.y - arg.pageCoords.y;
    newResult.rectDelta.left = arg.rect.left - unmodifiedRect.left;
    newResult.rectDelta.right = arg.rect.right - unmodifiedRect.right;
    newResult.rectDelta.top = arg.rect.top - unmodifiedRect.top;
    newResult.rectDelta.bottom = arg.rect.bottom - unmodifiedRect.bottom;
    const prevCoords = this.result.coords;
    const prevRect = this.result.rect;
    if (prevCoords && prevRect) {
      const rectChanged = newResult.rect.left !== prevRect.left || newResult.rect.right !== prevRect.right || newResult.rect.top !== prevRect.top || newResult.rect.bottom !== prevRect.bottom;
      newResult.changed = rectChanged || prevCoords.x !== newResult.coords.x || prevCoords.y !== newResult.coords.y;
    }
    return newResult;
  }
  applyToInteraction(arg) {
    const {
      interaction
    } = this;
    const {
      phase
    } = arg;
    const curCoords = interaction.coords.cur;
    const startCoords = interaction.coords.start;
    const {
      result,
      startDelta
    } = this;
    const curDelta = result.delta;
    if (phase === "start") {
      extend(this.startDelta, result.delta);
    }
    for (const [coordsSet, delta] of [[startCoords, startDelta], [curCoords, curDelta]]) {
      coordsSet.page.x += delta.x;
      coordsSet.page.y += delta.y;
      coordsSet.client.x += delta.x;
      coordsSet.client.y += delta.y;
    }
    const {
      rectDelta
    } = this.result;
    const rect = arg.rect || interaction.rect;
    rect.left += rectDelta.left;
    rect.right += rectDelta.right;
    rect.top += rectDelta.top;
    rect.bottom += rectDelta.bottom;
    rect.width = rect.right - rect.left;
    rect.height = rect.bottom - rect.top;
  }
  setAndApply(arg) {
    const {
      interaction
    } = this;
    const {
      phase,
      preEnd,
      skipModifiers
    } = arg;
    const result = this.setAll(this.fillArg({
      preEnd,
      phase,
      pageCoords: arg.modifiedCoords || interaction.coords.cur.page
    }));
    this.result = result;
    if (!result.changed && (!skipModifiers || skipModifiers < this.states.length) && interaction.interacting()) {
      return false;
    }
    if (arg.modifiedCoords) {
      const {
        page
      } = interaction.coords.cur;
      const adjustment = {
        x: arg.modifiedCoords.x - page.x,
        y: arg.modifiedCoords.y - page.y
      };
      result.coords.x += adjustment.x;
      result.coords.y += adjustment.y;
      result.delta.x += adjustment.x;
      result.delta.y += adjustment.y;
    }
    this.applyToInteraction(arg);
  }
  beforeEnd(arg) {
    const {
      interaction,
      event
    } = arg;
    const states = this.states;
    if (!states || !states.length) {
      return;
    }
    let doPreend = false;
    for (const state of states) {
      arg.state = state;
      const {
        options,
        methods
      } = state;
      const endPosition = methods.beforeEnd && methods.beforeEnd(arg);
      if (endPosition) {
        this.endResult = endPosition;
        return false;
      }
      doPreend = doPreend || !doPreend && this.shouldDo(options, true, arg.phase, true);
    }
    if (doPreend) {
      interaction.move({
        event,
        preEnd: true
      });
    }
  }
  stop(arg) {
    const {
      interaction
    } = arg;
    if (!this.states || !this.states.length) {
      return;
    }
    const modifierArg = extend({
      states: this.states,
      interactable: interaction.interactable,
      element: interaction.element,
      rect: null
    }, arg);
    this.fillArg(modifierArg);
    for (const state of this.states) {
      modifierArg.state = state;
      if (state.methods.stop) {
        state.methods.stop(modifierArg);
      }
    }
    this.states = null;
    this.endResult = null;
  }
  prepareStates(modifierList) {
    this.states = [];
    for (let index = 0; index < modifierList.length; index++) {
      const {
        options,
        methods,
        name
      } = modifierList[index];
      this.states.push({
        options,
        methods,
        index,
        name
      });
    }
    return this.states;
  }
  restoreInteractionCoords({
    interaction: {
      coords,
      rect,
      modification
    }
  }) {
    if (!modification.result)
      return;
    const {
      startDelta
    } = modification;
    const {
      delta: curDelta,
      rectDelta
    } = modification.result;
    const coordsAndDeltas = [[coords.start, startDelta], [coords.cur, curDelta]];
    for (const [coordsSet, delta] of coordsAndDeltas) {
      coordsSet.page.x -= delta.x;
      coordsSet.page.y -= delta.y;
      coordsSet.client.x -= delta.x;
      coordsSet.client.y -= delta.y;
    }
    rect.left -= rectDelta.left;
    rect.right -= rectDelta.right;
    rect.top -= rectDelta.top;
    rect.bottom -= rectDelta.bottom;
  }
  shouldDo(options, preEnd, phase, requireEndOnly) {
    if (
      // ignore disabled modifiers
      !options || options.enabled === false || // check if we require endOnly option to fire move before end
      requireEndOnly && !options.endOnly || // don't apply endOnly modifiers when not ending
      options.endOnly && !preEnd || // check if modifier should run be applied on start
      phase === "start" && !options.setStart
    ) {
      return false;
    }
    return true;
  }
  copyFrom(other) {
    this.startOffset = other.startOffset;
    this.startDelta = other.startDelta;
    this.startEdges = other.startEdges;
    this.edges = other.edges;
    this.states = other.states.map((s) => clone(s));
    this.result = createResult(extend({}, other.result.coords), extend({}, other.result.rect));
  }
  destroy() {
    for (const prop in this) {
      this[prop] = null;
    }
  }
};
function createResult(coords, rect) {
  return {
    rect,
    coords,
    delta: {
      x: 0,
      y: 0
    },
    rectDelta: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    eventProps: [],
    changed: true
  };
}
function getModifierList(interaction) {
  const actionOptions = interaction.interactable.options[interaction.prepared.name];
  const actionModifiers = actionOptions.modifiers;
  if (actionModifiers && actionModifiers.length) {
    return actionModifiers;
  }
  return ["snap", "snapSize", "snapEdges", "restrict", "restrictEdges", "restrictSize"].map((type) => {
    const options = actionOptions[type];
    return options && options.enabled && {
      options,
      methods: options._methods
    };
  }).filter((m) => !!m);
}
function getRectOffset(rect, coords) {
  return rect ? {
    left: coords.x - rect.left,
    top: coords.y - rect.top,
    right: rect.right - coords.x,
    bottom: rect.bottom - coords.y
  } : {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  };
}

// node_modules/@interactjs/modifiers/base.js
function makeModifier(module, name) {
  const {
    defaults: defaults7
  } = module;
  const methods = {
    start: module.start,
    set: module.set,
    beforeEnd: module.beforeEnd,
    stop: module.stop
  };
  const modifier = (_options) => {
    const options = _options || {};
    options.enabled = options.enabled !== false;
    for (const prop in defaults7) {
      if (!(prop in options)) {
        ;
        options[prop] = defaults7[prop];
      }
    }
    const m = {
      options,
      methods,
      name,
      enable: () => {
        options.enabled = true;
        return m;
      },
      disable: () => {
        options.enabled = false;
        return m;
      }
    };
    return m;
  };
  if (name && typeof name === "string") {
    modifier._defaults = defaults7;
    modifier._methods = methods;
  }
  return modifier;
}
function addEventModifiers({
  iEvent,
  interaction
}) {
  const result = interaction.modification.result;
  if (result) {
    iEvent.modifiers = result.eventProps;
  }
}
var modifiersBase = {
  id: "modifiers/base",
  before: ["actions"],
  install: (scope) => {
    scope.defaults.perAction.modifiers = [];
  },
  listeners: {
    "interactions:new": ({
      interaction
    }) => {
      interaction.modification = new Modification(interaction);
    },
    "interactions:before-action-start": (arg) => {
      const {
        interaction
      } = arg;
      const modification = arg.interaction.modification;
      modification.start(arg, interaction.coords.start.page);
      interaction.edges = modification.edges;
      modification.applyToInteraction(arg);
    },
    "interactions:before-action-move": (arg) => {
      const {
        interaction
      } = arg;
      const {
        modification
      } = interaction;
      const ret = modification.setAndApply(arg);
      interaction.edges = modification.edges;
      return ret;
    },
    "interactions:before-action-end": (arg) => {
      const {
        interaction
      } = arg;
      const {
        modification
      } = interaction;
      const ret = modification.beforeEnd(arg);
      interaction.edges = modification.startEdges;
      return ret;
    },
    "interactions:action-start": addEventModifiers,
    "interactions:action-move": addEventModifiers,
    "interactions:action-end": addEventModifiers,
    "interactions:after-action-start": (arg) => arg.interaction.modification.restoreInteractionCoords(arg),
    "interactions:after-action-move": (arg) => arg.interaction.modification.restoreInteractionCoords(arg),
    "interactions:stop": (arg) => arg.interaction.modification.stop(arg)
  }
};
var base_default = modifiersBase;

// node_modules/@interactjs/modifiers/aspectRatio.js
var aspectRatio = {
  start(arg) {
    const {
      state,
      rect,
      edges,
      pageCoords: coords
    } = arg;
    let {
      ratio,
      enabled
    } = state.options;
    const {
      equalDelta,
      modifiers: modifiers2
    } = state.options;
    if (ratio === "preserve") {
      ratio = rect.width / rect.height;
    }
    state.startCoords = extend({}, coords);
    state.startRect = extend({}, rect);
    state.ratio = ratio;
    state.equalDelta = equalDelta;
    const linkedEdges = state.linkedEdges = {
      top: edges.top || edges.left && !edges.bottom,
      left: edges.left || edges.top && !edges.right,
      bottom: edges.bottom || edges.right && !edges.top,
      right: edges.right || edges.bottom && !edges.left
    };
    state.xIsPrimaryAxis = !!(edges.left || edges.right);
    if (state.equalDelta) {
      const sign = (linkedEdges.left ? 1 : -1) * (linkedEdges.top ? 1 : -1);
      state.edgeSign = {
        x: sign,
        y: sign
      };
    } else {
      state.edgeSign = {
        x: linkedEdges.left ? -1 : 1,
        y: linkedEdges.top ? -1 : 1
      };
    }
    if (enabled !== false) {
      extend(edges, linkedEdges);
    }
    if (!(modifiers2 != null && modifiers2.length))
      return;
    const subModification = new Modification(arg.interaction);
    subModification.copyFrom(arg.interaction.modification);
    subModification.prepareStates(modifiers2);
    state.subModification = subModification;
    subModification.startAll({
      ...arg
    });
  },
  set(arg) {
    const {
      state,
      rect,
      coords
    } = arg;
    const {
      linkedEdges
    } = state;
    const initialCoords = extend({}, coords);
    const aspectMethod = state.equalDelta ? setEqualDelta : setRatio;
    extend(arg.edges, linkedEdges);
    aspectMethod(state, state.xIsPrimaryAxis, coords, rect);
    if (!state.subModification) {
      return null;
    }
    const correctedRect = extend({}, rect);
    addEdges(linkedEdges, correctedRect, {
      x: coords.x - initialCoords.x,
      y: coords.y - initialCoords.y
    });
    const result = state.subModification.setAll({
      ...arg,
      rect: correctedRect,
      edges: linkedEdges,
      pageCoords: coords,
      prevCoords: coords,
      prevRect: correctedRect
    });
    const {
      delta
    } = result;
    if (result.changed) {
      const xIsCriticalAxis = Math.abs(delta.x) > Math.abs(delta.y);
      aspectMethod(state, xIsCriticalAxis, result.coords, result.rect);
      extend(coords, result.coords);
    }
    return result.eventProps;
  },
  defaults: {
    ratio: "preserve",
    equalDelta: false,
    modifiers: [],
    enabled: false
  }
};
function setEqualDelta({
  startCoords,
  edgeSign
}, xIsPrimaryAxis, coords) {
  if (xIsPrimaryAxis) {
    coords.y = startCoords.y + (coords.x - startCoords.x) * edgeSign.y;
  } else {
    coords.x = startCoords.x + (coords.y - startCoords.y) * edgeSign.x;
  }
}
function setRatio({
  startRect,
  startCoords,
  ratio,
  edgeSign
}, xIsPrimaryAxis, coords, rect) {
  if (xIsPrimaryAxis) {
    const newHeight = rect.width / ratio;
    coords.y = startCoords.y + (newHeight - startRect.height) * edgeSign.y;
  } else {
    const newWidth = rect.height * ratio;
    coords.x = startCoords.x + (newWidth - startRect.width) * edgeSign.x;
  }
}
var aspectRatio_default = makeModifier(aspectRatio, "aspectRatio");

// node_modules/@interactjs/modifiers/noop.js
var noop = () => {
};
noop._defaults = {};
var noop_default = noop;

// node_modules/@interactjs/modifiers/restrict/pointer.js
function start({
  rect,
  startOffset,
  state,
  interaction,
  pageCoords
}) {
  const {
    options
  } = state;
  const {
    elementRect
  } = options;
  const offset = extend({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }, options.offset || {});
  if (rect && elementRect) {
    const restriction = getRestrictionRect(options.restriction, interaction, pageCoords);
    if (restriction) {
      const widthDiff = restriction.right - restriction.left - rect.width;
      const heightDiff = restriction.bottom - restriction.top - rect.height;
      if (widthDiff < 0) {
        offset.left += widthDiff;
        offset.right += widthDiff;
      }
      if (heightDiff < 0) {
        offset.top += heightDiff;
        offset.bottom += heightDiff;
      }
    }
    offset.left += startOffset.left - rect.width * elementRect.left;
    offset.top += startOffset.top - rect.height * elementRect.top;
    offset.right += startOffset.right - rect.width * (1 - elementRect.right);
    offset.bottom += startOffset.bottom - rect.height * (1 - elementRect.bottom);
  }
  state.offset = offset;
}
function set({
  coords,
  interaction,
  state
}) {
  const {
    options,
    offset
  } = state;
  const restriction = getRestrictionRect(options.restriction, interaction, coords);
  if (!restriction)
    return;
  const rect = xywhToTlbr(restriction);
  coords.x = Math.max(Math.min(rect.right - offset.right, coords.x), rect.left + offset.left);
  coords.y = Math.max(Math.min(rect.bottom - offset.bottom, coords.y), rect.top + offset.top);
}
function getRestrictionRect(value, interaction, coords) {
  if (is_default.func(value)) {
    return resolveRectLike(value, interaction.interactable, interaction.element, [coords.x, coords.y, interaction]);
  } else {
    return resolveRectLike(value, interaction.interactable, interaction.element);
  }
}
var defaults = {
  restriction: null,
  elementRect: null,
  offset: null,
  endOnly: false,
  enabled: false
};
var restrict = {
  start,
  set,
  defaults
};
var pointer_default = makeModifier(restrict, "restrict");

// node_modules/@interactjs/modifiers/restrict/edges.js
var noInner = {
  top: Infinity,
  left: Infinity,
  bottom: -Infinity,
  right: -Infinity
};
var noOuter = {
  top: -Infinity,
  left: -Infinity,
  bottom: Infinity,
  right: Infinity
};
function start2({
  interaction,
  startOffset,
  state
}) {
  const {
    options
  } = state;
  let offset;
  if (options) {
    const offsetRect = getRestrictionRect(options.offset, interaction, interaction.coords.start.page);
    offset = rectToXY(offsetRect);
  }
  offset = offset || {
    x: 0,
    y: 0
  };
  state.offset = {
    top: offset.y + startOffset.top,
    left: offset.x + startOffset.left,
    bottom: offset.y - startOffset.bottom,
    right: offset.x - startOffset.right
  };
}
function set2({
  coords,
  edges,
  interaction,
  state
}) {
  const {
    offset,
    options
  } = state;
  if (!edges) {
    return;
  }
  const page = extend({}, coords);
  const inner = getRestrictionRect(options.inner, interaction, page) || {};
  const outer = getRestrictionRect(options.outer, interaction, page) || {};
  fixRect(inner, noInner);
  fixRect(outer, noOuter);
  if (edges.top) {
    coords.y = Math.min(Math.max(outer.top + offset.top, page.y), inner.top + offset.top);
  } else if (edges.bottom) {
    coords.y = Math.max(Math.min(outer.bottom + offset.bottom, page.y), inner.bottom + offset.bottom);
  }
  if (edges.left) {
    coords.x = Math.min(Math.max(outer.left + offset.left, page.x), inner.left + offset.left);
  } else if (edges.right) {
    coords.x = Math.max(Math.min(outer.right + offset.right, page.x), inner.right + offset.right);
  }
}
function fixRect(rect, defaults7) {
  for (const edge of ["top", "left", "bottom", "right"]) {
    if (!(edge in rect)) {
      rect[edge] = defaults7[edge];
    }
  }
  return rect;
}
var defaults2 = {
  inner: null,
  outer: null,
  offset: null,
  endOnly: false,
  enabled: false
};
var restrictEdges = {
  noInner,
  noOuter,
  start: start2,
  set: set2,
  defaults: defaults2
};
var edges_default = makeModifier(restrictEdges, "restrictEdges");

// node_modules/@interactjs/modifiers/restrict/rect.js
var defaults3 = extend({
  get elementRect() {
    return {
      top: 0,
      left: 0,
      bottom: 1,
      right: 1
    };
  },
  set elementRect(_) {
  }
}, restrict.defaults);
var restrictRect = {
  start: restrict.start,
  set: restrict.set,
  defaults: defaults3
};
var rect_default = makeModifier(restrictRect, "restrictRect");

// node_modules/@interactjs/modifiers/restrict/size.js
var noMin = {
  width: -Infinity,
  height: -Infinity
};
var noMax = {
  width: Infinity,
  height: Infinity
};
function start3(arg) {
  return restrictEdges.start(arg);
}
function set3(arg) {
  const {
    interaction,
    state,
    rect,
    edges
  } = arg;
  const {
    options
  } = state;
  if (!edges) {
    return;
  }
  const minSize = tlbrToXywh(getRestrictionRect(options.min, interaction, arg.coords)) || noMin;
  const maxSize = tlbrToXywh(getRestrictionRect(options.max, interaction, arg.coords)) || noMax;
  state.options = {
    endOnly: options.endOnly,
    inner: extend({}, restrictEdges.noInner),
    outer: extend({}, restrictEdges.noOuter)
  };
  if (edges.top) {
    state.options.inner.top = rect.bottom - minSize.height;
    state.options.outer.top = rect.bottom - maxSize.height;
  } else if (edges.bottom) {
    state.options.inner.bottom = rect.top + minSize.height;
    state.options.outer.bottom = rect.top + maxSize.height;
  }
  if (edges.left) {
    state.options.inner.left = rect.right - minSize.width;
    state.options.outer.left = rect.right - maxSize.width;
  } else if (edges.right) {
    state.options.inner.right = rect.left + minSize.width;
    state.options.outer.right = rect.left + maxSize.width;
  }
  restrictEdges.set(arg);
  state.options = options;
}
var defaults4 = {
  min: null,
  max: null,
  endOnly: false,
  enabled: false
};
var restrictSize = {
  start: start3,
  set: set3,
  defaults: defaults4
};
var size_default = makeModifier(restrictSize, "restrictSize");

// node_modules/@interactjs/modifiers/snap/pointer.js
function start4(arg) {
  const {
    interaction,
    interactable,
    element,
    rect,
    state,
    startOffset
  } = arg;
  const {
    options
  } = state;
  const origin = options.offsetWithOrigin ? getOrigin(arg) : {
    x: 0,
    y: 0
  };
  let snapOffset;
  if (options.offset === "startCoords") {
    snapOffset = {
      x: interaction.coords.start.page.x,
      y: interaction.coords.start.page.y
    };
  } else {
    const offsetRect = resolveRectLike(options.offset, interactable, element, [interaction]);
    snapOffset = rectToXY(offsetRect) || {
      x: 0,
      y: 0
    };
    snapOffset.x += origin.x;
    snapOffset.y += origin.y;
  }
  const {
    relativePoints
  } = options;
  state.offsets = rect && relativePoints && relativePoints.length ? relativePoints.map((relativePoint, index) => ({
    index,
    relativePoint,
    x: startOffset.left - rect.width * relativePoint.x + snapOffset.x,
    y: startOffset.top - rect.height * relativePoint.y + snapOffset.y
  })) : [{
    index: 0,
    relativePoint: null,
    x: snapOffset.x,
    y: snapOffset.y
  }];
}
function set4(arg) {
  const {
    interaction,
    coords,
    state
  } = arg;
  const {
    options,
    offsets
  } = state;
  const origin = getOriginXY_default(interaction.interactable, interaction.element, interaction.prepared.name);
  const page = extend({}, coords);
  const targets = [];
  if (!options.offsetWithOrigin) {
    page.x -= origin.x;
    page.y -= origin.y;
  }
  for (const offset of offsets) {
    const relativeX = page.x - offset.x;
    const relativeY = page.y - offset.y;
    for (let index = 0, len = options.targets.length; index < len; index++) {
      const snapTarget = options.targets[index];
      let target;
      if (is_default.func(snapTarget)) {
        target = snapTarget(relativeX, relativeY, interaction._proxy, offset, index);
      } else {
        target = snapTarget;
      }
      if (!target) {
        continue;
      }
      targets.push({
        x: (is_default.number(target.x) ? target.x : relativeX) + offset.x,
        y: (is_default.number(target.y) ? target.y : relativeY) + offset.y,
        range: is_default.number(target.range) ? target.range : options.range,
        source: snapTarget,
        index,
        offset
      });
    }
  }
  const closest = {
    target: null,
    inRange: false,
    distance: 0,
    range: 0,
    delta: {
      x: 0,
      y: 0
    }
  };
  for (const target of targets) {
    const range = target.range;
    const dx = target.x - page.x;
    const dy = target.y - page.y;
    const distance = hypot_default(dx, dy);
    let inRange = distance <= range;
    if (range === Infinity && closest.inRange && closest.range !== Infinity) {
      inRange = false;
    }
    if (!closest.target || (inRange ? (
      // is the closest target in range?
      closest.inRange && range !== Infinity ? (
        // the pointer is relatively deeper in this target
        distance / range < closest.distance / closest.range
      ) : (
        // this target has Infinite range and the closest doesn't
        range === Infinity && closest.range !== Infinity || // OR this target is closer that the previous closest
        distance < closest.distance
      )
    ) : (
      // The other is not in range and the pointer is closer to this target
      !closest.inRange && distance < closest.distance
    ))) {
      closest.target = target;
      closest.distance = distance;
      closest.range = range;
      closest.inRange = inRange;
      closest.delta.x = dx;
      closest.delta.y = dy;
    }
  }
  if (closest.inRange) {
    coords.x = closest.target.x;
    coords.y = closest.target.y;
  }
  state.closest = closest;
  return closest;
}
function getOrigin(arg) {
  const {
    element
  } = arg.interaction;
  const optionsOrigin = rectToXY(resolveRectLike(arg.state.options.origin, null, null, [element]));
  const origin = optionsOrigin || getOriginXY_default(arg.interactable, element, arg.interaction.prepared.name);
  return origin;
}
var defaults5 = {
  range: Infinity,
  targets: null,
  offset: null,
  offsetWithOrigin: true,
  origin: null,
  relativePoints: null,
  endOnly: false,
  enabled: false
};
var snap = {
  start: start4,
  set: set4,
  defaults: defaults5
};
var pointer_default2 = makeModifier(snap, "snap");

// node_modules/@interactjs/modifiers/snap/size.js
function start5(arg) {
  const {
    state,
    edges
  } = arg;
  const {
    options
  } = state;
  if (!edges) {
    return null;
  }
  arg.state = {
    options: {
      targets: null,
      relativePoints: [{
        x: edges.left ? 0 : 1,
        y: edges.top ? 0 : 1
      }],
      offset: options.offset || "self",
      origin: {
        x: 0,
        y: 0
      },
      range: options.range
    }
  };
  state.targetFields = state.targetFields || [["width", "height"], ["x", "y"]];
  snap.start(arg);
  state.offsets = arg.state.offsets;
  arg.state = state;
}
function set5(arg) {
  const {
    interaction,
    state,
    coords
  } = arg;
  const {
    options,
    offsets
  } = state;
  const relative = {
    x: coords.x - offsets[0].x,
    y: coords.y - offsets[0].y
  };
  state.options = extend({}, options);
  state.options.targets = [];
  for (const snapTarget of options.targets || []) {
    let target;
    if (is_default.func(snapTarget)) {
      target = snapTarget(relative.x, relative.y, interaction);
    } else {
      target = snapTarget;
    }
    if (!target) {
      continue;
    }
    for (const [xField, yField] of state.targetFields) {
      if (xField in target || yField in target) {
        target.x = target[xField];
        target.y = target[yField];
        break;
      }
    }
    state.options.targets.push(target);
  }
  const returnValue = snap.set(arg);
  state.options = options;
  return returnValue;
}
var defaults6 = {
  range: Infinity,
  targets: null,
  offset: null,
  endOnly: false,
  enabled: false
};
var snapSize = {
  start: start5,
  set: set5,
  defaults: defaults6
};
var size_default2 = makeModifier(snapSize, "snapSize");

// node_modules/@interactjs/modifiers/snap/edges.js
function start6(arg) {
  const {
    edges
  } = arg;
  if (!edges) {
    return null;
  }
  arg.state.targetFields = arg.state.targetFields || [[edges.left ? "left" : "right", edges.top ? "top" : "bottom"]];
  return snapSize.start(arg);
}
var snapEdges = {
  start: start6,
  set: snapSize.set,
  defaults: extend(clone(snapSize.defaults), {
    targets: null,
    range: null,
    offset: {
      x: 0,
      y: 0
    }
  })
};
var edges_default2 = makeModifier(snapEdges, "snapEdges");

// node_modules/@interactjs/modifiers/all.js
var all_default = {
  aspectRatio: aspectRatio_default,
  restrictEdges: edges_default,
  restrict: pointer_default,
  restrictRect: rect_default,
  restrictSize: size_default,
  snapEdges: edges_default2,
  snap: pointer_default2,
  snapSize: size_default2,
  spring: noop_default,
  avoid: noop_default,
  transform: noop_default,
  rubberband: noop_default
};

// node_modules/@interactjs/modifiers/plugin.js
var modifiers = {
  id: "modifiers",
  install(scope) {
    const {
      interactStatic: interact
    } = scope;
    scope.usePlugin(base_default);
    scope.usePlugin(plugin_default);
    interact.modifiers = all_default;
    for (const type in all_default) {
      const {
        _defaults,
        _methods
      } = all_default[type];
      _defaults._methods = _methods;
      scope.defaults.perAction[type] = _defaults;
    }
  }
};
var plugin_default2 = modifiers;

// node_modules/@interactjs/modifiers/index.js
interact_default.use(plugin_default2);
//# sourceMappingURL=@interactjs_modifiers.js.map
