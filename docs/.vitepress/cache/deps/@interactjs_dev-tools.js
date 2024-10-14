import {
  domObjects_default,
  extend,
  interact_default,
  is_default,
  parentNode,
  win
} from "./chunk-NZVBT32X.js";
import "./chunk-ZC22LKFR.js";

// node_modules/@interactjs/dev-tools/visualizer/plugin.js
var plugin_default = {};

// node_modules/@interactjs/dev-tools/plugin.js
var CheckName;
(function(CheckName2) {
  CheckName2["touchAction"] = "touchAction";
  CheckName2["boxSizing"] = "boxSizing";
  CheckName2["noListeners"] = "noListeners";
})(CheckName || (CheckName = {}));
var prefix = "[interact.js] ";
var links = {
  touchAction: "https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action",
  boxSizing: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing"
};
var isProduction = false;
function install(scope, {
  logger
} = {}) {
  const {
    Interactable,
    defaults
  } = scope;
  scope.logger = logger || console;
  defaults.base.devTools = {
    ignore: {}
  };
  Interactable.prototype.devTools = function(options) {
    if (options) {
      extend(this.options.devTools, options);
      return this;
    }
    return this.options.devTools;
  };
  scope.usePlugin(plugin_default);
}
var checks = [{
  name: CheckName.touchAction,
  perform({
    element
  }) {
    return !parentHasStyle(element, "touchAction", /pan-|pinch|none/);
  },
  getInfo({
    element
  }) {
    return [element, links.touchAction];
  },
  text: 'Consider adding CSS "touch-action: none" to this element\n'
}, {
  name: CheckName.boxSizing,
  perform(interaction) {
    const {
      element
    } = interaction;
    return interaction.prepared.name === "resize" && element instanceof domObjects_default.HTMLElement && !hasStyle(element, "boxSizing", /border-box/);
  },
  text: 'Consider adding CSS "box-sizing: border-box" to this resizable element',
  getInfo({
    element
  }) {
    return [element, links.boxSizing];
  }
}, {
  name: CheckName.noListeners,
  perform(interaction) {
    const actionName = interaction.prepared.name;
    const moveListeners = interaction.interactable.events.types[`${actionName}move`] || [];
    return !moveListeners.length;
  },
  getInfo(interaction) {
    return [interaction.prepared.name, interaction.interactable];
  },
  text: "There are no listeners set for this action"
}];
function hasStyle(element, prop, styleRe) {
  const value = element.style[prop] || win.getComputedStyle(element)[prop];
  return styleRe.test((value || "").toString());
}
function parentHasStyle(element, prop, styleRe) {
  let parent = element;
  while (is_default.element(parent)) {
    if (hasStyle(parent, prop, styleRe)) {
      return true;
    }
    parent = parentNode(parent);
  }
  return false;
}
var id = "dev-tools";
var defaultExport = isProduction ? {
  id,
  install: () => {
  }
} : {
  id,
  install,
  listeners: {
    "interactions:action-start": ({
      interaction
    }, scope) => {
      for (const check of checks) {
        const options = interaction.interactable && interaction.interactable.options;
        if (!(options && options.devTools && options.devTools.ignore[check.name]) && check.perform(interaction)) {
          scope.logger.warn(prefix + check.text, ...check.getInfo(interaction));
        }
      }
    }
  },
  checks,
  CheckName,
  links,
  prefix
};
var plugin_default2 = defaultExport;

// node_modules/@interactjs/dev-tools/index.js
interact_default.use(plugin_default2);
//# sourceMappingURL=@interactjs_dev-tools.js.map
