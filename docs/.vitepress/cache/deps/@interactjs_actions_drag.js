import {
  interact_default,
  is_default
} from "./chunk-NZVBT32X.js";
import "./chunk-ZC22LKFR.js";

// node_modules/@interactjs/actions/drag/plugin.js
function install(scope) {
  const {
    actions,
    Interactable,
    defaults
  } = scope;
  Interactable.prototype.draggable = drag.draggable;
  actions.map.drag = drag;
  actions.methodDict.drag = "draggable";
  defaults.actions.drag = drag.defaults;
}
function beforeMove({
  interaction
}) {
  if (interaction.prepared.name !== "drag")
    return;
  const axis = interaction.prepared.axis;
  if (axis === "x") {
    interaction.coords.cur.page.y = interaction.coords.start.page.y;
    interaction.coords.cur.client.y = interaction.coords.start.client.y;
    interaction.coords.velocity.client.y = 0;
    interaction.coords.velocity.page.y = 0;
  } else if (axis === "y") {
    interaction.coords.cur.page.x = interaction.coords.start.page.x;
    interaction.coords.cur.client.x = interaction.coords.start.client.x;
    interaction.coords.velocity.client.x = 0;
    interaction.coords.velocity.page.x = 0;
  }
}
function move({
  iEvent,
  interaction
}) {
  if (interaction.prepared.name !== "drag")
    return;
  const axis = interaction.prepared.axis;
  if (axis === "x" || axis === "y") {
    const opposite = axis === "x" ? "y" : "x";
    iEvent.page[opposite] = interaction.coords.start.page[opposite];
    iEvent.client[opposite] = interaction.coords.start.client[opposite];
    iEvent.delta[opposite] = 0;
  }
}
var draggable = function draggable2(options) {
  if (is_default.object(options)) {
    this.options.drag.enabled = options.enabled !== false;
    this.setPerAction("drag", options);
    this.setOnEvents("drag", options);
    if (/^(xy|x|y|start)$/.test(options.lockAxis)) {
      this.options.drag.lockAxis = options.lockAxis;
    }
    if (/^(xy|x|y)$/.test(options.startAxis)) {
      this.options.drag.startAxis = options.startAxis;
    }
    return this;
  }
  if (is_default.bool(options)) {
    this.options.drag.enabled = options;
    return this;
  }
  return this.options.drag;
};
var drag = {
  id: "actions/drag",
  install,
  listeners: {
    "interactions:before-action-move": beforeMove,
    "interactions:action-resume": beforeMove,
    // dragmove
    "interactions:action-move": move,
    "auto-start:check": (arg) => {
      const {
        interaction,
        interactable,
        buttons
      } = arg;
      const dragOptions = interactable.options.drag;
      if (!(dragOptions && dragOptions.enabled) || // check mouseButton setting if the pointer is down
      interaction.pointerIsDown && /mouse|pointer/.test(interaction.pointerType) && (buttons & interactable.options.drag.mouseButtons) === 0) {
        return void 0;
      }
      arg.action = {
        name: "drag",
        axis: dragOptions.lockAxis === "start" ? dragOptions.startAxis : dragOptions.lockAxis
      };
      return false;
    }
  },
  draggable,
  beforeMove,
  move,
  defaults: {
    startAxis: "xy",
    lockAxis: "xy"
  },
  getCursor() {
    return "move";
  }
};
var plugin_default = drag;

// node_modules/@interactjs/actions/drag/index.js
interact_default.use(plugin_default);
//# sourceMappingURL=@interactjs_actions_drag.js.map
