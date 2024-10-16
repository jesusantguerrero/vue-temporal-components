import {
  copyAction,
  extend,
  interact_default,
  is_default,
  parentNode,
  warnOnce
} from "./chunk-NZVBT32X.js";
import "./chunk-ZC22LKFR.js";

// node_modules/@interactjs/auto-start/InteractableMethods.js
function install(scope) {
  const {
    /** @lends Interactable */
    Interactable
    // tslint:disable-line no-shadowed-variable
  } = scope;
  Interactable.prototype.getAction = function getAction(pointer, event, interaction, element) {
    const action = defaultActionChecker(this, event, interaction, element, scope);
    if (this.options.actionChecker) {
      return this.options.actionChecker(pointer, event, action, this, element, interaction);
    }
    return action;
  };
  Interactable.prototype.ignoreFrom = warnOnce(function(newValue) {
    return this._backCompatOption("ignoreFrom", newValue);
  }, "Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue}).");
  Interactable.prototype.allowFrom = warnOnce(function(newValue) {
    return this._backCompatOption("allowFrom", newValue);
  }, "Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue}).");
  Interactable.prototype.actionChecker = actionChecker;
  Interactable.prototype.styleCursor = styleCursor;
}
function defaultActionChecker(interactable, event, interaction, element, scope) {
  const rect = interactable.getRect(element);
  const buttons = event.buttons || {
    0: 1,
    1: 4,
    3: 8,
    4: 16
  }[event.button];
  const arg = {
    action: null,
    interactable,
    interaction,
    element,
    rect,
    buttons
  };
  scope.fire("auto-start:check", arg);
  return arg.action;
}
function styleCursor(newValue) {
  if (is_default.bool(newValue)) {
    this.options.styleCursor = newValue;
    return this;
  }
  if (newValue === null) {
    delete this.options.styleCursor;
    return this;
  }
  return this.options.styleCursor;
}
function actionChecker(checker) {
  if (is_default.func(checker)) {
    this.options.actionChecker = checker;
    return this;
  }
  if (checker === null) {
    delete this.options.actionChecker;
    return this;
  }
  return this.options.actionChecker;
}
var InteractableMethods_default = {
  id: "auto-start/interactableMethods",
  install
};

// node_modules/@interactjs/auto-start/base.js
function install2(scope) {
  const {
    interactStatic: interact,
    defaults
  } = scope;
  scope.usePlugin(InteractableMethods_default);
  defaults.base.actionChecker = null;
  defaults.base.styleCursor = true;
  extend(defaults.perAction, {
    manualStart: false,
    max: Infinity,
    maxPerElement: 1,
    allowFrom: null,
    ignoreFrom: null,
    // only allow left button by default
    // see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons#Return_value
    mouseButtons: 1
  });
  interact.maxInteractions = (newValue) => maxInteractions(newValue, scope);
  scope.autoStart = {
    // Allow this many interactions to happen simultaneously
    maxInteractions: Infinity,
    withinInteractionLimit,
    cursorElement: null
  };
}
function prepareOnDown({
  interaction,
  pointer,
  event,
  eventTarget
}, scope) {
  if (interaction.interacting())
    return;
  const actionInfo = getActionInfo(interaction, pointer, event, eventTarget, scope);
  prepare(interaction, actionInfo, scope);
}
function prepareOnMove({
  interaction,
  pointer,
  event,
  eventTarget
}, scope) {
  if (interaction.pointerType !== "mouse" || interaction.pointerIsDown || interaction.interacting())
    return;
  const actionInfo = getActionInfo(interaction, pointer, event, eventTarget, scope);
  prepare(interaction, actionInfo, scope);
}
function startOnMove(arg, scope) {
  const {
    interaction
  } = arg;
  if (!interaction.pointerIsDown || interaction.interacting() || !interaction.pointerWasMoved || !interaction.prepared.name) {
    return;
  }
  scope.fire("autoStart:before-start", arg);
  const {
    interactable
  } = interaction;
  const actionName = interaction.prepared.name;
  if (actionName && interactable) {
    if (interactable.options[actionName].manualStart || !withinInteractionLimit(interactable, interaction.element, interaction.prepared, scope)) {
      interaction.stop();
    } else {
      interaction.start(interaction.prepared, interactable, interaction.element);
      setInteractionCursor(interaction, scope);
    }
  }
}
function clearCursorOnStop({
  interaction
}, scope) {
  const {
    interactable
  } = interaction;
  if (interactable && interactable.options.styleCursor) {
    setCursor(interaction.element, "", scope);
  }
}
function validateAction(action, interactable, element, eventTarget, scope) {
  if (interactable.testIgnoreAllow(interactable.options[action.name], element, eventTarget) && interactable.options[action.name].enabled && withinInteractionLimit(interactable, element, action, scope)) {
    return action;
  }
  return null;
}
function validateMatches(interaction, pointer, event, matches, matchElements, eventTarget, scope) {
  for (let i = 0, len = matches.length; i < len; i++) {
    const match = matches[i];
    const matchElement = matchElements[i];
    const matchAction = match.getAction(pointer, event, interaction, matchElement);
    if (!matchAction) {
      continue;
    }
    const action = validateAction(matchAction, match, matchElement, eventTarget, scope);
    if (action) {
      return {
        action,
        interactable: match,
        element: matchElement
      };
    }
  }
  return {
    action: null,
    interactable: null,
    element: null
  };
}
function getActionInfo(interaction, pointer, event, eventTarget, scope) {
  let matches = [];
  let matchElements = [];
  let element = eventTarget;
  function pushMatches(interactable) {
    matches.push(interactable);
    matchElements.push(element);
  }
  while (is_default.element(element)) {
    matches = [];
    matchElements = [];
    scope.interactables.forEachMatch(element, pushMatches);
    const actionInfo = validateMatches(interaction, pointer, event, matches, matchElements, eventTarget, scope);
    if (actionInfo.action && !actionInfo.interactable.options[actionInfo.action.name].manualStart) {
      return actionInfo;
    }
    element = parentNode(element);
  }
  return {
    action: null,
    interactable: null,
    element: null
  };
}
function prepare(interaction, {
  action,
  interactable,
  element
}, scope) {
  action = action || {
    name: null
  };
  interaction.interactable = interactable;
  interaction.element = element;
  copyAction(interaction.prepared, action);
  interaction.rect = interactable && action.name ? interactable.getRect(element) : null;
  setInteractionCursor(interaction, scope);
  scope.fire("autoStart:prepared", {
    interaction
  });
}
function withinInteractionLimit(interactable, element, action, scope) {
  const options = interactable.options;
  const maxActions = options[action.name].max;
  const maxPerElement = options[action.name].maxPerElement;
  const autoStartMax = scope.autoStart.maxInteractions;
  let activeInteractions = 0;
  let interactableCount = 0;
  let elementCount = 0;
  if (!(maxActions && maxPerElement && autoStartMax)) {
    return false;
  }
  for (const interaction of scope.interactions.list) {
    const otherAction = interaction.prepared.name;
    if (!interaction.interacting()) {
      continue;
    }
    activeInteractions++;
    if (activeInteractions >= autoStartMax) {
      return false;
    }
    if (interaction.interactable !== interactable) {
      continue;
    }
    interactableCount += otherAction === action.name ? 1 : 0;
    if (interactableCount >= maxActions) {
      return false;
    }
    if (interaction.element === element) {
      elementCount++;
      if (otherAction === action.name && elementCount >= maxPerElement) {
        return false;
      }
    }
  }
  return autoStartMax > 0;
}
function maxInteractions(newValue, scope) {
  if (is_default.number(newValue)) {
    scope.autoStart.maxInteractions = newValue;
    return this;
  }
  return scope.autoStart.maxInteractions;
}
function setCursor(element, cursor, scope) {
  const {
    cursorElement: prevCursorElement
  } = scope.autoStart;
  if (prevCursorElement && prevCursorElement !== element) {
    prevCursorElement.style.cursor = "";
  }
  element.ownerDocument.documentElement.style.cursor = cursor;
  element.style.cursor = cursor;
  scope.autoStart.cursorElement = cursor ? element : null;
}
function setInteractionCursor(interaction, scope) {
  const {
    interactable,
    element,
    prepared
  } = interaction;
  if (!(interaction.pointerType === "mouse" && interactable && interactable.options.styleCursor)) {
    if (scope.autoStart.cursorElement) {
      setCursor(scope.autoStart.cursorElement, "", scope);
    }
    return;
  }
  let cursor = "";
  if (prepared.name) {
    const cursorChecker = interactable.options[prepared.name].cursorChecker;
    if (is_default.func(cursorChecker)) {
      cursor = cursorChecker(prepared, interactable, element, interaction._interacting);
    } else {
      cursor = scope.actions.map[prepared.name].getCursor(prepared);
    }
  }
  setCursor(interaction.element, cursor || "", scope);
}
var autoStart = {
  id: "auto-start/base",
  before: ["actions"],
  install: install2,
  listeners: {
    "interactions:down": prepareOnDown,
    "interactions:move": (arg, scope) => {
      prepareOnMove(arg, scope);
      startOnMove(arg, scope);
    },
    "interactions:stop": clearCursorOnStop
  },
  maxInteractions,
  withinInteractionLimit,
  validateAction
};
var base_default = autoStart;

// node_modules/@interactjs/auto-start/dragAxis.js
function beforeStart({
  interaction,
  eventTarget,
  dx,
  dy
}, scope) {
  if (interaction.prepared.name !== "drag")
    return;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  const targetOptions = interaction.interactable.options.drag;
  const startAxis = targetOptions.startAxis;
  const currentAxis = absX > absY ? "x" : absX < absY ? "y" : "xy";
  interaction.prepared.axis = targetOptions.lockAxis === "start" ? currentAxis[0] : targetOptions.lockAxis;
  if (currentAxis !== "xy" && startAxis !== "xy" && startAxis !== currentAxis) {
    ;
    interaction.prepared.name = null;
    let element = eventTarget;
    const getDraggable = function(interactable) {
      if (interactable === interaction.interactable)
        return;
      const options = interaction.interactable.options.drag;
      if (!options.manualStart && interactable.testIgnoreAllow(options, element, eventTarget)) {
        const action = interactable.getAction(interaction.downPointer, interaction.downEvent, interaction, element);
        if (action && action.name === "drag" && checkStartAxis(currentAxis, interactable) && base_default.validateAction(action, interactable, element, eventTarget, scope)) {
          return interactable;
        }
      }
    };
    while (is_default.element(element)) {
      const interactable = scope.interactables.forEachMatch(element, getDraggable);
      if (interactable) {
        ;
        interaction.prepared.name = "drag";
        interaction.interactable = interactable;
        interaction.element = element;
        break;
      }
      element = parentNode(element);
    }
  }
}
function checkStartAxis(startAxis, interactable) {
  if (!interactable) {
    return false;
  }
  const thisAxis = interactable.options.drag.startAxis;
  return startAxis === "xy" || thisAxis === "xy" || thisAxis === startAxis;
}
var dragAxis_default = {
  id: "auto-start/dragAxis",
  listeners: {
    "autoStart:before-start": beforeStart
  }
};

// node_modules/@interactjs/auto-start/hold.js
function install3(scope) {
  const {
    defaults
  } = scope;
  scope.usePlugin(base_default);
  defaults.perAction.hold = 0;
  defaults.perAction.delay = 0;
}
function getHoldDuration(interaction) {
  const actionName = interaction.prepared && interaction.prepared.name;
  if (!actionName) {
    return null;
  }
  const options = interaction.interactable.options;
  return options[actionName].hold || options[actionName].delay;
}
var hold = {
  id: "auto-start/hold",
  install: install3,
  listeners: {
    "interactions:new": ({
      interaction
    }) => {
      interaction.autoStartHoldTimer = null;
    },
    "autoStart:prepared": ({
      interaction
    }) => {
      const hold2 = getHoldDuration(interaction);
      if (hold2 > 0) {
        interaction.autoStartHoldTimer = setTimeout(() => {
          interaction.start(interaction.prepared, interaction.interactable, interaction.element);
        }, hold2);
      }
    },
    "interactions:move": ({
      interaction,
      duplicate
    }) => {
      if (interaction.autoStartHoldTimer && interaction.pointerWasMoved && !duplicate) {
        clearTimeout(interaction.autoStartHoldTimer);
        interaction.autoStartHoldTimer = null;
      }
    },
    // prevent regular down->move autoStart
    "autoStart:before-start": ({
      interaction
    }) => {
      const holdDuration = getHoldDuration(interaction);
      if (holdDuration > 0) {
        interaction.prepared.name = null;
      }
    }
  },
  getHoldDuration
};
var hold_default = hold;

// node_modules/@interactjs/auto-start/plugin.js
var plugin_default = {
  id: "auto-start",
  install(scope) {
    scope.usePlugin(base_default);
    scope.usePlugin(hold_default);
    scope.usePlugin(dragAxis_default);
  }
};

// node_modules/@interactjs/auto-start/index.js
interact_default.use(plugin_default);
//# sourceMappingURL=@interactjs_auto-start.js.map
