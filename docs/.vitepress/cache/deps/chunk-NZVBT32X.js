import {
  __publicField
} from "./chunk-ZC22LKFR.js";

// node_modules/@interactjs/utils/domObjects.js
var domObjects = {
  init,
  document: null,
  DocumentFragment: null,
  SVGElement: null,
  SVGSVGElement: null,
  SVGElementInstance: null,
  Element: null,
  HTMLElement: null,
  Event: null,
  Touch: null,
  PointerEvent: null
};
function blank() {
}
var domObjects_default = domObjects;
function init(window3) {
  const win2 = window3;
  domObjects.document = win2.document;
  domObjects.DocumentFragment = win2.DocumentFragment || blank;
  domObjects.SVGElement = win2.SVGElement || blank;
  domObjects.SVGSVGElement = win2.SVGSVGElement || blank;
  domObjects.SVGElementInstance = win2.SVGElementInstance || blank;
  domObjects.Element = win2.Element || blank;
  domObjects.HTMLElement = win2.HTMLElement || domObjects.Element;
  domObjects.Event = win2.Event;
  domObjects.Touch = win2.Touch || blank;
  domObjects.PointerEvent = win2.PointerEvent || win2.MSPointerEvent;
}

// node_modules/@interactjs/utils/isWindow.js
var isWindow_default = (thing) => !!(thing && thing.Window) && thing instanceof thing.Window;

// node_modules/@interactjs/utils/window.js
var realWindow = void 0;
var win = void 0;
function init2(window3) {
  realWindow = window3;
  const el = window3.document.createTextNode("");
  if (el.ownerDocument !== window3.document && typeof window3.wrap === "function" && window3.wrap(el) === el) {
    window3 = window3.wrap(window3);
  }
  win = window3;
}
if (typeof window !== "undefined" && !!window) {
  init2(window);
}
function getWindow(node) {
  if (isWindow_default(node)) {
    return node;
  }
  const rootNode = node.ownerDocument || node;
  return rootNode.defaultView || win.window;
}

// node_modules/@interactjs/utils/is.js
var window2 = (thing) => thing === win || isWindow_default(thing);
var docFrag = (thing) => object(thing) && thing.nodeType === 11;
var object = (thing) => !!thing && typeof thing === "object";
var func = (thing) => typeof thing === "function";
var number = (thing) => typeof thing === "number";
var bool = (thing) => typeof thing === "boolean";
var string = (thing) => typeof thing === "string";
var element = (thing) => {
  if (!thing || typeof thing !== "object") {
    return false;
  }
  const _window = getWindow(thing) || win;
  return /object|function/.test(typeof Element) ? thing instanceof Element || thing instanceof _window.Element : thing.nodeType === 1 && typeof thing.nodeName === "string";
};
var plainObject = (thing) => object(thing) && !!thing.constructor && /function Object\b/.test(thing.constructor.toString());
var array = (thing) => object(thing) && typeof thing.length !== "undefined" && func(thing.splice);
var is_default = {
  window: window2,
  docFrag,
  object,
  func,
  number,
  bool,
  string,
  element,
  plainObject,
  array
};

// node_modules/@interactjs/utils/browser.js
var browser = {
  init: init3,
  supportsTouch: null,
  supportsPointerEvent: null,
  isIOS7: null,
  isIOS: null,
  isIe9: null,
  isOperaMobile: null,
  prefixedMatchesSelector: null,
  pEventTypes: null,
  wheelEvent: null
};
function init3(window3) {
  const Element2 = domObjects_default.Element;
  const navigator = window3.navigator || {};
  browser.supportsTouch = "ontouchstart" in window3 || is_default.func(window3.DocumentTouch) && domObjects_default.document instanceof window3.DocumentTouch;
  browser.supportsPointerEvent = navigator.pointerEnabled !== false && !!domObjects_default.PointerEvent;
  browser.isIOS = /iP(hone|od|ad)/.test(navigator.platform);
  browser.isIOS7 = /iP(hone|od|ad)/.test(navigator.platform) && /OS 7[^\d]/.test(navigator.appVersion);
  browser.isIe9 = /MSIE 9/.test(navigator.userAgent);
  browser.isOperaMobile = navigator.appName === "Opera" && browser.supportsTouch && /Presto/.test(navigator.userAgent);
  browser.prefixedMatchesSelector = "matches" in Element2.prototype ? "matches" : "webkitMatchesSelector" in Element2.prototype ? "webkitMatchesSelector" : "mozMatchesSelector" in Element2.prototype ? "mozMatchesSelector" : "oMatchesSelector" in Element2.prototype ? "oMatchesSelector" : "msMatchesSelector";
  browser.pEventTypes = browser.supportsPointerEvent ? domObjects_default.PointerEvent === window3.MSPointerEvent ? {
    up: "MSPointerUp",
    down: "MSPointerDown",
    over: "mouseover",
    out: "mouseout",
    move: "MSPointerMove",
    cancel: "MSPointerCancel"
  } : {
    up: "pointerup",
    down: "pointerdown",
    over: "pointerover",
    out: "pointerout",
    move: "pointermove",
    cancel: "pointercancel"
  } : null;
  browser.wheelEvent = domObjects_default.document && "onmousewheel" in domObjects_default.document ? "mousewheel" : "wheel";
}
var browser_default = browser;

// node_modules/@interactjs/utils/arr.js
var contains = (array2, target) => array2.indexOf(target) !== -1;
var merge = (target, source) => {
  for (const item of source) {
    target.push(item);
  }
  return target;
};
var from = (source) => merge([], source);
var findIndex = (array2, func2) => {
  for (let i = 0; i < array2.length; i++) {
    if (func2(array2[i], i, array2)) {
      return i;
    }
  }
  return -1;
};
var find = (array2, func2) => array2[findIndex(array2, func2)];

// node_modules/@interactjs/utils/clone.js
function clone(source) {
  const dest = {};
  for (const prop in source) {
    const value = source[prop];
    if (is_default.plainObject(value)) {
      dest[prop] = clone(value);
    } else if (is_default.array(value)) {
      dest[prop] = from(value);
    } else {
      dest[prop] = value;
    }
  }
  return dest;
}

// node_modules/@interactjs/utils/extend.js
function extend(dest, source) {
  for (const prop in source) {
    ;
    dest[prop] = source[prop];
  }
  const ret = dest;
  return ret;
}

// node_modules/@interactjs/utils/raf.js
var lastTime = 0;
var request;
var cancel;
function init4(global) {
  request = global.requestAnimationFrame;
  cancel = global.cancelAnimationFrame;
  if (!request) {
    const vendors = ["ms", "moz", "webkit", "o"];
    for (const vendor of vendors) {
      request = global[`${vendor}RequestAnimationFrame`];
      cancel = global[`${vendor}CancelAnimationFrame`] || global[`${vendor}CancelRequestAnimationFrame`];
    }
  }
  request = request && request.bind(global);
  cancel = cancel && cancel.bind(global);
  if (!request) {
    request = (callback) => {
      const currTime = Date.now();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const token = global.setTimeout(() => {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return token;
    };
    cancel = (token) => clearTimeout(token);
  }
}
var raf_default = {
  request: (callback) => request(callback),
  cancel: (token) => cancel(token),
  init: init4
};

// node_modules/@interactjs/utils/normalizeListeners.js
function normalize(type, listeners, result) {
  result = result || {};
  if (is_default.string(type) && type.search(" ") !== -1) {
    type = split(type);
  }
  if (is_default.array(type)) {
    return type.reduce((acc, t) => extend(acc, normalize(t, listeners, result)), result);
  }
  if (is_default.object(type)) {
    listeners = type;
    type = "";
  }
  if (is_default.func(listeners)) {
    result[type] = result[type] || [];
    result[type].push(listeners);
  } else if (is_default.array(listeners)) {
    for (const l of listeners) {
      normalize(type, l, result);
    }
  } else if (is_default.object(listeners)) {
    for (const prefix in listeners) {
      const combinedTypes = split(prefix).map((p) => `${type}${p}`);
      normalize(combinedTypes, listeners[prefix], result);
    }
  }
  return result;
}
function split(type) {
  return type.trim().split(/ +/);
}

// node_modules/@interactjs/core/Eventable.js
function fireUntilImmediateStopped(event, listeners) {
  for (const listener of listeners) {
    if (event.immediatePropagationStopped) {
      break;
    }
    listener(event);
  }
}
var Eventable = class {
  constructor(options) {
    __publicField(this, "options");
    __publicField(this, "types", {});
    __publicField(this, "propagationStopped", false);
    __publicField(this, "immediatePropagationStopped", false);
    __publicField(this, "global");
    this.options = extend({}, options || {});
  }
  fire(event) {
    let listeners;
    const global = this.global;
    if (listeners = this.types[event.type]) {
      fireUntilImmediateStopped(event, listeners);
    }
    if (!event.propagationStopped && global && (listeners = global[event.type])) {
      fireUntilImmediateStopped(event, listeners);
    }
  }
  on(type, listener) {
    const listeners = normalize(type, listener);
    for (type in listeners) {
      this.types[type] = merge(this.types[type] || [], listeners[type]);
    }
  }
  off(type, listener) {
    const listeners = normalize(type, listener);
    for (type in listeners) {
      const eventList = this.types[type];
      if (!eventList || !eventList.length) {
        continue;
      }
      for (const subListener of listeners[type]) {
        const index = eventList.indexOf(subListener);
        if (index !== -1) {
          eventList.splice(index, 1);
        }
      }
    }
  }
  getRect(_element) {
    return null;
  }
};

// node_modules/@interactjs/utils/domUtils.js
function nodeContains(parent, child) {
  if (parent.contains) {
    return parent.contains(child);
  }
  while (child) {
    if (child === parent) {
      return true;
    }
    child = child.parentNode;
  }
  return false;
}
function closest(element2, selector) {
  while (is_default.element(element2)) {
    if (matchesSelector(element2, selector)) {
      return element2;
    }
    element2 = parentNode(element2);
  }
  return null;
}
function parentNode(node) {
  let parent = node.parentNode;
  if (is_default.docFrag(parent)) {
    while ((parent = parent.host) && is_default.docFrag(parent)) {
      continue;
    }
    return parent;
  }
  return parent;
}
function matchesSelector(element2, selector) {
  if (win !== realWindow) {
    selector = selector.replace(/\/deep\//g, " ");
  }
  return element2[browser_default.prefixedMatchesSelector](selector);
}
function matchesUpTo(element2, selector, limit) {
  while (is_default.element(element2)) {
    if (matchesSelector(element2, selector)) {
      return true;
    }
    element2 = parentNode(element2);
    if (element2 === limit) {
      return matchesSelector(element2, selector);
    }
  }
  return false;
}
function getActualElement(element2) {
  return element2.correspondingUseElement || element2;
}
function getScrollXY(relevantWindow) {
  relevantWindow = relevantWindow || win;
  return {
    x: relevantWindow.scrollX || relevantWindow.document.documentElement.scrollLeft,
    y: relevantWindow.scrollY || relevantWindow.document.documentElement.scrollTop
  };
}
function getElementClientRect(element2) {
  const clientRect = element2 instanceof domObjects_default.SVGElement ? element2.getBoundingClientRect() : element2.getClientRects()[0];
  return clientRect && {
    left: clientRect.left,
    right: clientRect.right,
    top: clientRect.top,
    bottom: clientRect.bottom,
    width: clientRect.width || clientRect.right - clientRect.left,
    height: clientRect.height || clientRect.bottom - clientRect.top
  };
}
function getElementRect(element2) {
  const clientRect = getElementClientRect(element2);
  if (!browser_default.isIOS7 && clientRect) {
    const scroll = getScrollXY(getWindow(element2));
    clientRect.left += scroll.x;
    clientRect.right += scroll.x;
    clientRect.top += scroll.y;
    clientRect.bottom += scroll.y;
  }
  return clientRect;
}
function trySelector(value) {
  if (!is_default.string(value)) {
    return false;
  }
  domObjects_default.document.querySelector(value);
  return true;
}

// node_modules/@interactjs/utils/rect.js
function getStringOptionResult(value, target, element2) {
  if (value === "parent") {
    return parentNode(element2);
  }
  if (value === "self") {
    return target.getRect(element2);
  }
  return closest(element2, value);
}
function resolveRectLike(value, target, element2, functionArgs) {
  let returnValue = value;
  if (is_default.string(returnValue)) {
    returnValue = getStringOptionResult(returnValue, target, element2);
  } else if (is_default.func(returnValue)) {
    returnValue = returnValue(...functionArgs);
  }
  if (is_default.element(returnValue)) {
    returnValue = getElementRect(returnValue);
  }
  return returnValue;
}
function rectToXY(rect) {
  return rect && {
    x: "x" in rect ? rect.x : rect.left,
    y: "y" in rect ? rect.y : rect.top
  };
}
function xywhToTlbr(rect) {
  if (rect && !("left" in rect && "top" in rect)) {
    rect = extend({}, rect);
    rect.left = rect.x || 0;
    rect.top = rect.y || 0;
    rect.right = rect.right || rect.left + rect.width;
    rect.bottom = rect.bottom || rect.top + rect.height;
  }
  return rect;
}
function tlbrToXywh(rect) {
  if (rect && !("x" in rect && "y" in rect)) {
    rect = extend({}, rect);
    rect.x = rect.left || 0;
    rect.y = rect.top || 0;
    rect.width = rect.width || (rect.right || 0) - rect.x;
    rect.height = rect.height || (rect.bottom || 0) - rect.y;
  }
  return rect;
}
function addEdges(edges, rect, delta) {
  if (edges.left) {
    rect.left += delta.x;
  }
  if (edges.right) {
    rect.right += delta.x;
  }
  if (edges.top) {
    rect.top += delta.y;
  }
  if (edges.bottom) {
    rect.bottom += delta.y;
  }
  rect.width = rect.right - rect.left;
  rect.height = rect.bottom - rect.top;
}

// node_modules/@interactjs/utils/getOriginXY.js
function getOriginXY_default(target, element2, actionName) {
  const actionOptions = target.options[actionName];
  const actionOrigin = actionOptions && actionOptions.origin;
  const origin = actionOrigin || target.options.origin;
  const originRect = resolveRectLike(origin, target, element2, [target && element2]);
  return rectToXY(originRect) || {
    x: 0,
    y: 0
  };
}

// node_modules/@interactjs/utils/hypot.js
var hypot_default = (x, y) => Math.sqrt(x * x + y * y);

// node_modules/@interactjs/core/BaseEvent.js
var BaseEvent = class {
  constructor(interaction) {
    __publicField(this, "immediatePropagationStopped", false);
    __publicField(this, "propagationStopped", false);
    this._interaction = interaction;
  }
  preventDefault() {
  }
  /**
   * Don't call any other listeners (even on the current target)
   */
  stopPropagation() {
    this.propagationStopped = true;
  }
  /**
   * Don't call listeners on the remaining targets
   */
  stopImmediatePropagation() {
    this.immediatePropagationStopped = this.propagationStopped = true;
  }
};
Object.defineProperty(BaseEvent.prototype, "interaction", {
  get() {
    return this._interaction._proxy;
  },
  set() {
  }
});

// node_modules/@interactjs/core/options.js
var defaults = {
  base: {
    preventDefault: "auto",
    deltaSource: "page"
  },
  perAction: {
    enabled: false,
    origin: {
      x: 0,
      y: 0
    }
  },
  actions: {}
};

// node_modules/@interactjs/core/InteractEvent.js
var InteractEvent = class extends BaseEvent {
  /** */
  constructor(interaction, event, actionName, phase, element2, preEnd, type) {
    super(interaction);
    __publicField(this, "relatedTarget", null);
    __publicField(this, "screenX");
    __publicField(this, "screenY");
    __publicField(this, "button");
    __publicField(this, "buttons");
    __publicField(this, "ctrlKey");
    __publicField(this, "shiftKey");
    __publicField(this, "altKey");
    __publicField(this, "metaKey");
    __publicField(this, "page");
    __publicField(this, "client");
    __publicField(this, "delta");
    __publicField(this, "rect");
    __publicField(this, "x0");
    __publicField(this, "y0");
    __publicField(this, "t0");
    __publicField(this, "dt");
    __publicField(this, "duration");
    __publicField(this, "clientX0");
    __publicField(this, "clientY0");
    __publicField(this, "velocity");
    __publicField(this, "speed");
    __publicField(this, "swipe");
    // resize
    __publicField(this, "axes");
    __publicField(this, "preEnd");
    element2 = element2 || interaction.element;
    const target = interaction.interactable;
    const deltaSource = (target && target.options || defaults).deltaSource;
    const origin = getOriginXY_default(target, element2, actionName);
    const starting = phase === "start";
    const ending = phase === "end";
    const prevEvent = starting ? this : interaction.prevEvent;
    const coords = starting ? interaction.coords.start : ending ? {
      page: prevEvent.page,
      client: prevEvent.client,
      timeStamp: interaction.coords.cur.timeStamp
    } : interaction.coords.cur;
    this.page = extend({}, coords.page);
    this.client = extend({}, coords.client);
    this.rect = extend({}, interaction.rect);
    this.timeStamp = coords.timeStamp;
    if (!ending) {
      this.page.x -= origin.x;
      this.page.y -= origin.y;
      this.client.x -= origin.x;
      this.client.y -= origin.y;
    }
    this.ctrlKey = event.ctrlKey;
    this.altKey = event.altKey;
    this.shiftKey = event.shiftKey;
    this.metaKey = event.metaKey;
    this.button = event.button;
    this.buttons = event.buttons;
    this.target = element2;
    this.currentTarget = element2;
    this.preEnd = preEnd;
    this.type = type || actionName + (phase || "");
    this.interactable = target;
    this.t0 = starting ? interaction.pointers[interaction.pointers.length - 1].downTime : prevEvent.t0;
    this.x0 = interaction.coords.start.page.x - origin.x;
    this.y0 = interaction.coords.start.page.y - origin.y;
    this.clientX0 = interaction.coords.start.client.x - origin.x;
    this.clientY0 = interaction.coords.start.client.y - origin.y;
    if (starting || ending) {
      this.delta = {
        x: 0,
        y: 0
      };
    } else {
      this.delta = {
        x: this[deltaSource].x - prevEvent[deltaSource].x,
        y: this[deltaSource].y - prevEvent[deltaSource].y
      };
    }
    this.dt = interaction.coords.delta.timeStamp;
    this.duration = this.timeStamp - this.t0;
    this.velocity = extend({}, interaction.coords.velocity[deltaSource]);
    this.speed = hypot_default(this.velocity.x, this.velocity.y);
    this.swipe = ending || phase === "inertiastart" ? this.getSwipe() : null;
  }
  getSwipe() {
    const interaction = this._interaction;
    if (interaction.prevEvent.speed < 600 || this.timeStamp - interaction.prevEvent.timeStamp > 150) {
      return null;
    }
    let angle = 180 * Math.atan2(interaction.prevEvent.velocityY, interaction.prevEvent.velocityX) / Math.PI;
    const overlap = 22.5;
    if (angle < 0) {
      angle += 360;
    }
    const left = 135 - overlap <= angle && angle < 225 + overlap;
    const up = 225 - overlap <= angle && angle < 315 + overlap;
    const right = !left && (315 - overlap <= angle || angle < 45 + overlap);
    const down = !up && 45 - overlap <= angle && angle < 135 + overlap;
    return {
      up,
      down,
      left,
      right,
      angle,
      speed: interaction.prevEvent.speed,
      velocity: {
        x: interaction.prevEvent.velocityX,
        y: interaction.prevEvent.velocityY
      }
    };
  }
  preventDefault() {
  }
  /**
   * Don't call listeners on the remaining targets
   */
  stopImmediatePropagation() {
    this.immediatePropagationStopped = this.propagationStopped = true;
  }
  /**
   * Don't call any other listeners (even on the current target)
   */
  stopPropagation() {
    this.propagationStopped = true;
  }
};
Object.defineProperties(InteractEvent.prototype, {
  pageX: {
    get() {
      return this.page.x;
    },
    set(value) {
      this.page.x = value;
    }
  },
  pageY: {
    get() {
      return this.page.y;
    },
    set(value) {
      this.page.y = value;
    }
  },
  clientX: {
    get() {
      return this.client.x;
    },
    set(value) {
      this.client.x = value;
    }
  },
  clientY: {
    get() {
      return this.client.y;
    },
    set(value) {
      this.client.y = value;
    }
  },
  dx: {
    get() {
      return this.delta.x;
    },
    set(value) {
      this.delta.x = value;
    }
  },
  dy: {
    get() {
      return this.delta.y;
    },
    set(value) {
      this.delta.y = value;
    }
  },
  velocityX: {
    get() {
      return this.velocity.x;
    },
    set(value) {
      this.velocity.x = value;
    }
  },
  velocityY: {
    get() {
      return this.velocity.y;
    },
    set(value) {
      this.velocity.y = value;
    }
  }
});

// node_modules/@interactjs/utils/misc.js
function warnOnce(method, message) {
  let warned = false;
  return function() {
    if (!warned) {
      ;
      win.console.warn(message);
      warned = true;
    }
    return method.apply(this, arguments);
  };
}
function copyAction(dest, src) {
  dest.name = src.name;
  dest.axis = src.axis;
  dest.edges = src.edges;
  return dest;
}

// node_modules/@interactjs/utils/pointerExtend.js
var VENDOR_PREFIXES = ["webkit", "moz"];
function pointerExtend(dest, source) {
  dest.__set || (dest.__set = {});
  for (const prop in source) {
    if (VENDOR_PREFIXES.some((prefix) => prop.indexOf(prefix) === 0))
      continue;
    if (typeof dest[prop] !== "function" && prop !== "__set") {
      Object.defineProperty(dest, prop, {
        get() {
          if (prop in dest.__set)
            return dest.__set[prop];
          return dest.__set[prop] = source[prop];
        },
        set(value) {
          dest.__set[prop] = value;
        },
        configurable: true
      });
    }
  }
  return dest;
}

// node_modules/@interactjs/utils/pointerUtils.js
function copyCoords(dest, src) {
  dest.page = dest.page || {};
  dest.page.x = src.page.x;
  dest.page.y = src.page.y;
  dest.client = dest.client || {};
  dest.client.x = src.client.x;
  dest.client.y = src.client.y;
  dest.timeStamp = src.timeStamp;
}
function setCoordDeltas(targetObj, prev, cur) {
  targetObj.page.x = cur.page.x - prev.page.x;
  targetObj.page.y = cur.page.y - prev.page.y;
  targetObj.client.x = cur.client.x - prev.client.x;
  targetObj.client.y = cur.client.y - prev.client.y;
  targetObj.timeStamp = cur.timeStamp - prev.timeStamp;
}
function setCoordVelocity(targetObj, delta) {
  const dt = Math.max(delta.timeStamp / 1e3, 1e-3);
  targetObj.page.x = delta.page.x / dt;
  targetObj.page.y = delta.page.y / dt;
  targetObj.client.x = delta.client.x / dt;
  targetObj.client.y = delta.client.y / dt;
  targetObj.timeStamp = dt;
}
function setZeroCoords(targetObj) {
  targetObj.page.x = 0;
  targetObj.page.y = 0;
  targetObj.client.x = 0;
  targetObj.client.y = 0;
}
function isNativePointer(pointer) {
  return pointer instanceof domObjects_default.Event || pointer instanceof domObjects_default.Touch;
}
function getXY(type, pointer, xy) {
  xy = xy || {};
  type = type || "page";
  xy.x = pointer[type + "X"];
  xy.y = pointer[type + "Y"];
  return xy;
}
function getPageXY(pointer, page) {
  page = page || {
    x: 0,
    y: 0
  };
  if (browser_default.isOperaMobile && isNativePointer(pointer)) {
    getXY("screen", pointer, page);
    page.x += window.scrollX;
    page.y += window.scrollY;
  } else {
    getXY("page", pointer, page);
  }
  return page;
}
function getClientXY(pointer, client) {
  client = client || {};
  if (browser_default.isOperaMobile && isNativePointer(pointer)) {
    getXY("screen", pointer, client);
  } else {
    getXY("client", pointer, client);
  }
  return client;
}
function getPointerId(pointer) {
  return is_default.number(pointer.pointerId) ? pointer.pointerId : pointer.identifier;
}
function setCoords(dest, pointers, timeStamp) {
  const pointer = pointers.length > 1 ? pointerAverage(pointers) : pointers[0];
  getPageXY(pointer, dest.page);
  getClientXY(pointer, dest.client);
  dest.timeStamp = timeStamp;
}
function getTouchPair(event) {
  const touches = [];
  if (is_default.array(event)) {
    touches[0] = event[0];
    touches[1] = event[1];
  } else {
    if (event.type === "touchend") {
      if (event.touches.length === 1) {
        touches[0] = event.touches[0];
        touches[1] = event.changedTouches[0];
      } else if (event.touches.length === 0) {
        touches[0] = event.changedTouches[0];
        touches[1] = event.changedTouches[1];
      }
    } else {
      touches[0] = event.touches[0];
      touches[1] = event.touches[1];
    }
  }
  return touches;
}
function pointerAverage(pointers) {
  const average = {
    pageX: 0,
    pageY: 0,
    clientX: 0,
    clientY: 0,
    screenX: 0,
    screenY: 0
  };
  for (const pointer of pointers) {
    for (const prop in average) {
      average[prop] += pointer[prop];
    }
  }
  for (const prop in average) {
    average[prop] /= pointers.length;
  }
  return average;
}
function touchBBox(event) {
  if (!event.length) {
    return null;
  }
  const touches = getTouchPair(event);
  const minX = Math.min(touches[0].pageX, touches[1].pageX);
  const minY = Math.min(touches[0].pageY, touches[1].pageY);
  const maxX = Math.max(touches[0].pageX, touches[1].pageX);
  const maxY = Math.max(touches[0].pageY, touches[1].pageY);
  return {
    x: minX,
    y: minY,
    left: minX,
    top: minY,
    right: maxX,
    bottom: maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function touchDistance(event, deltaSource) {
  const sourceX = deltaSource + "X";
  const sourceY = deltaSource + "Y";
  const touches = getTouchPair(event);
  const dx = touches[0][sourceX] - touches[1][sourceX];
  const dy = touches[0][sourceY] - touches[1][sourceY];
  return hypot_default(dx, dy);
}
function touchAngle(event, deltaSource) {
  const sourceX = deltaSource + "X";
  const sourceY = deltaSource + "Y";
  const touches = getTouchPair(event);
  const dx = touches[1][sourceX] - touches[0][sourceX];
  const dy = touches[1][sourceY] - touches[0][sourceY];
  const angle = 180 * Math.atan2(dy, dx) / Math.PI;
  return angle;
}
function getPointerType(pointer) {
  return is_default.string(pointer.pointerType) ? pointer.pointerType : is_default.number(pointer.pointerType) ? [void 0, void 0, "touch", "pen", "mouse"][pointer.pointerType] : (
    // if the PointerEvent API isn't available, then the "pointer" must
    // be either a MouseEvent, TouchEvent, or Touch object
    /touch/.test(pointer.type || "") || pointer instanceof domObjects_default.Touch ? "touch" : "mouse"
  );
}
function getEventTargets(event) {
  const path = is_default.func(event.composedPath) ? event.composedPath() : event.path;
  return [getActualElement(path ? path[0] : event.target), getActualElement(event.currentTarget)];
}
function newCoords() {
  return {
    page: {
      x: 0,
      y: 0
    },
    client: {
      x: 0,
      y: 0
    },
    timeStamp: 0
  };
}

// node_modules/@interactjs/core/isNonNativeEvent.js
function isNonNativeEvent(type, actions) {
  if (actions.phaselessTypes[type]) {
    return true;
  }
  for (const name in actions.map) {
    if (type.indexOf(name) === 0 && type.substr(name.length) in actions.phases) {
      return true;
    }
  }
  return false;
}

// node_modules/@interactjs/core/InteractStatic.js
function createInteractStatic(scope2) {
  const interact2 = (target, options) => {
    let interactable = scope2.interactables.get(target, options);
    if (!interactable) {
      interactable = scope2.interactables.new(target, options);
      interactable.events.global = interact2.globalEvents;
    }
    return interactable;
  };
  interact2.getPointerAverage = pointerAverage;
  interact2.getTouchBBox = touchBBox;
  interact2.getTouchDistance = touchDistance;
  interact2.getTouchAngle = touchAngle;
  interact2.getElementRect = getElementRect;
  interact2.getElementClientRect = getElementClientRect;
  interact2.matchesSelector = matchesSelector;
  interact2.closest = closest;
  interact2.globalEvents = {};
  interact2.version = "1.10.19";
  interact2.scope = scope2;
  interact2.use = function(plugin, options) {
    this.scope.usePlugin(plugin, options);
    return this;
  };
  interact2.isSet = function(target, options) {
    return !!this.scope.interactables.get(target, options && options.context);
  };
  interact2.on = warnOnce(function on(type, listener, options) {
    if (is_default.string(type) && type.search(" ") !== -1) {
      type = type.trim().split(/ +/);
    }
    if (is_default.array(type)) {
      for (const eventType of type) {
        this.on(eventType, listener, options);
      }
      return this;
    }
    if (is_default.object(type)) {
      for (const prop in type) {
        this.on(prop, type[prop], listener);
      }
      return this;
    }
    if (isNonNativeEvent(type, this.scope.actions)) {
      if (!this.globalEvents[type]) {
        this.globalEvents[type] = [listener];
      } else {
        this.globalEvents[type].push(listener);
      }
    } else {
      this.scope.events.add(this.scope.document, type, listener, {
        options
      });
    }
    return this;
  }, "The interact.on() method is being deprecated");
  interact2.off = warnOnce(function off(type, listener, options) {
    if (is_default.string(type) && type.search(" ") !== -1) {
      type = type.trim().split(/ +/);
    }
    if (is_default.array(type)) {
      for (const eventType of type) {
        this.off(eventType, listener, options);
      }
      return this;
    }
    if (is_default.object(type)) {
      for (const prop in type) {
        this.off(prop, type[prop], listener);
      }
      return this;
    }
    if (isNonNativeEvent(type, this.scope.actions)) {
      let index;
      if (type in this.globalEvents && (index = this.globalEvents[type].indexOf(listener)) !== -1) {
        this.globalEvents[type].splice(index, 1);
      }
    } else {
      this.scope.events.remove(this.scope.document, type, listener, options);
    }
    return this;
  }, "The interact.off() method is being deprecated");
  interact2.debug = function() {
    return this.scope;
  };
  interact2.supportsTouch = function() {
    return browser_default.supportsTouch;
  };
  interact2.supportsPointerEvent = function() {
    return browser_default.supportsPointerEvent;
  };
  interact2.stop = function() {
    for (const interaction of this.scope.interactions.list) {
      interaction.stop();
    }
    return this;
  };
  interact2.pointerMoveTolerance = function(newValue) {
    if (is_default.number(newValue)) {
      this.scope.interactions.pointerMoveTolerance = newValue;
      return this;
    }
    return this.scope.interactions.pointerMoveTolerance;
  };
  interact2.addDocument = function(doc, options) {
    this.scope.addDocument(doc, options);
  };
  interact2.removeDocument = function(doc) {
    this.scope.removeDocument(doc);
  };
  return interact2;
}

// node_modules/@interactjs/core/Interactable.js
var Interactable = class {
  /** */
  constructor(target, options, defaultContext, scopeEvents) {
    __publicField(this, "options");
    __publicField(this, "_actions");
    __publicField(this, "target");
    __publicField(this, "events", new Eventable());
    __publicField(this, "_context");
    __publicField(this, "_win");
    __publicField(this, "_doc");
    __publicField(this, "_scopeEvents");
    /** @internal */
    __publicField(this, "_rectChecker");
    this._actions = options.actions;
    this.target = target;
    this._context = options.context || defaultContext;
    this._win = getWindow(trySelector(target) ? this._context : target);
    this._doc = this._win.document;
    this._scopeEvents = scopeEvents;
    this.set(options);
  }
  /** @internal */
  get _defaults() {
    return {
      base: {},
      perAction: {},
      actions: {}
    };
  }
  setOnEvents(actionName, phases) {
    if (is_default.func(phases.onstart)) {
      this.on(`${actionName}start`, phases.onstart);
    }
    if (is_default.func(phases.onmove)) {
      this.on(`${actionName}move`, phases.onmove);
    }
    if (is_default.func(phases.onend)) {
      this.on(`${actionName}end`, phases.onend);
    }
    if (is_default.func(phases.oninertiastart)) {
      this.on(`${actionName}inertiastart`, phases.oninertiastart);
    }
    return this;
  }
  updatePerActionListeners(actionName, prev, cur) {
    if (is_default.array(prev) || is_default.object(prev)) {
      this.off(actionName, prev);
    }
    if (is_default.array(cur) || is_default.object(cur)) {
      this.on(actionName, cur);
    }
  }
  setPerAction(actionName, options) {
    const defaults2 = this._defaults;
    for (const optionName_ in options) {
      const optionName = optionName_;
      const actionOptions = this.options[actionName];
      const optionValue = options[optionName];
      if (optionName === "listeners") {
        this.updatePerActionListeners(actionName, actionOptions.listeners, optionValue);
      }
      if (is_default.array(optionValue)) {
        ;
        actionOptions[optionName] = from(optionValue);
      } else if (is_default.plainObject(optionValue)) {
        ;
        actionOptions[optionName] = extend(actionOptions[optionName] || {}, clone(optionValue));
        if (is_default.object(defaults2.perAction[optionName]) && "enabled" in defaults2.perAction[optionName]) {
          ;
          actionOptions[optionName].enabled = optionValue.enabled !== false;
        }
      } else if (is_default.bool(optionValue) && is_default.object(defaults2.perAction[optionName])) {
        ;
        actionOptions[optionName].enabled = optionValue;
      } else {
        ;
        actionOptions[optionName] = optionValue;
      }
    }
  }
  /**
   * The default function to get an Interactables bounding rect. Can be
   * overridden using {@link Interactable.rectChecker}.
   *
   * @param {Element} [element] The element to measure.
   * @return {Rect} The object's bounding rectangle.
   */
  getRect(element2) {
    element2 = element2 || (is_default.element(this.target) ? this.target : null);
    if (is_default.string(this.target)) {
      element2 = element2 || this._context.querySelector(this.target);
    }
    return getElementRect(element2);
  }
  /**
   * Returns or sets the function used to calculate the interactable's
   * element's rectangle
   *
   * @param {function} [checker] A function which returns this Interactable's
   * bounding rectangle. See {@link Interactable.getRect}
   * @return {function | object} The checker function or this Interactable
   */
  rectChecker(checker) {
    if (is_default.func(checker)) {
      this._rectChecker = checker;
      this.getRect = (element2) => {
        const rect = extend({}, this._rectChecker(element2));
        if (!("width" in rect)) {
          rect.width = rect.right - rect.left;
          rect.height = rect.bottom - rect.top;
        }
        return rect;
      };
      return this;
    }
    if (checker === null) {
      delete this.getRect;
      delete this._rectChecker;
      return this;
    }
    return this.getRect;
  }
  _backCompatOption(optionName, newValue) {
    if (trySelector(newValue) || is_default.object(newValue)) {
      ;
      this.options[optionName] = newValue;
      for (const action in this._actions.map) {
        ;
        this.options[action][optionName] = newValue;
      }
      return this;
    }
    return this.options[optionName];
  }
  /**
   * Gets or sets the origin of the Interactable's element.  The x and y
   * of the origin will be subtracted from action event coordinates.
   *
   * @param {Element | object | string} [origin] An HTML or SVG Element whose
   * rect will be used, an object eg. { x: 0, y: 0 } or string 'parent', 'self'
   * or any CSS selector
   *
   * @return {object} The current origin or this Interactable
   */
  origin(newValue) {
    return this._backCompatOption("origin", newValue);
  }
  /**
   * Returns or sets the mouse coordinate types used to calculate the
   * movement of the pointer.
   *
   * @param {string} [newValue] Use 'client' if you will be scrolling while
   * interacting; Use 'page' if you want autoScroll to work
   * @return {string | object} The current deltaSource or this Interactable
   */
  deltaSource(newValue) {
    if (newValue === "page" || newValue === "client") {
      this.options.deltaSource = newValue;
      return this;
    }
    return this.options.deltaSource;
  }
  /**
   * Gets the selector context Node of the Interactable. The default is
   * `window.document`.
   *
   * @return {Node} The context Node of this Interactable
   */
  context() {
    return this._context;
  }
  inContext(element2) {
    return this._context === element2.ownerDocument || nodeContains(this._context, element2);
  }
  testIgnoreAllow(options, targetNode, eventTarget) {
    return !this.testIgnore(options.ignoreFrom, targetNode, eventTarget) && this.testAllow(options.allowFrom, targetNode, eventTarget);
  }
  testAllow(allowFrom, targetNode, element2) {
    if (!allowFrom) {
      return true;
    }
    if (!is_default.element(element2)) {
      return false;
    }
    if (is_default.string(allowFrom)) {
      return matchesUpTo(element2, allowFrom, targetNode);
    } else if (is_default.element(allowFrom)) {
      return nodeContains(allowFrom, element2);
    }
    return false;
  }
  testIgnore(ignoreFrom, targetNode, element2) {
    if (!ignoreFrom || !is_default.element(element2)) {
      return false;
    }
    if (is_default.string(ignoreFrom)) {
      return matchesUpTo(element2, ignoreFrom, targetNode);
    } else if (is_default.element(ignoreFrom)) {
      return nodeContains(ignoreFrom, element2);
    }
    return false;
  }
  /**
   * Calls listeners for the given InteractEvent type bound globally
   * and directly to this Interactable
   *
   * @param {InteractEvent} iEvent The InteractEvent object to be fired on this
   * Interactable
   * @return {Interactable} this Interactable
   */
  fire(iEvent) {
    this.events.fire(iEvent);
    return this;
  }
  _onOff(method, typeArg, listenerArg, options) {
    if (is_default.object(typeArg) && !is_default.array(typeArg)) {
      options = listenerArg;
      listenerArg = null;
    }
    const addRemove = method === "on" ? "add" : "remove";
    const listeners = normalize(typeArg, listenerArg);
    for (let type in listeners) {
      if (type === "wheel") {
        type = browser_default.wheelEvent;
      }
      for (const listener of listeners[type]) {
        if (isNonNativeEvent(type, this._actions)) {
          this.events[method](type, listener);
        } else if (is_default.string(this.target)) {
          this._scopeEvents[`${addRemove}Delegate`](this.target, this._context, type, listener, options);
        } else {
          this._scopeEvents[addRemove](this.target, type, listener, options);
        }
      }
    }
    return this;
  }
  /**
   * Binds a listener for an InteractEvent, pointerEvent or DOM event.
   *
   * @param {string | array | object} types The types of events to listen
   * for
   * @param {function | array | object} [listener] The event listener function(s)
   * @param {object | boolean} [options] options object or useCapture flag for
   * addEventListener
   * @return {Interactable} This Interactable
   */
  on(types, listener, options) {
    return this._onOff("on", types, listener, options);
  }
  /**
   * Removes an InteractEvent, pointerEvent or DOM event listener.
   *
   * @param {string | array | object} types The types of events that were
   * listened for
   * @param {function | array | object} [listener] The event listener function(s)
   * @param {object | boolean} [options] options object or useCapture flag for
   * removeEventListener
   * @return {Interactable} This Interactable
   */
  off(types, listener, options) {
    return this._onOff("off", types, listener, options);
  }
  /**
   * Reset the options of this Interactable
   *
   * @param {object} options The new settings to apply
   * @return {object} This Interactable
   */
  set(options) {
    const defaults2 = this._defaults;
    if (!is_default.object(options)) {
      options = {};
    }
    ;
    this.options = clone(defaults2.base);
    for (const actionName_ in this._actions.methodDict) {
      const actionName = actionName_;
      const methodName = this._actions.methodDict[actionName];
      this.options[actionName] = {};
      this.setPerAction(actionName, extend(extend({}, defaults2.perAction), defaults2.actions[actionName]));
      this[methodName](options[actionName]);
    }
    for (const setting in options) {
      if (is_default.func(this[setting])) {
        ;
        this[setting](options[setting]);
      }
    }
    return this;
  }
  /**
   * Remove this interactable from the list of interactables and remove it's
   * action capabilities and event listeners
   */
  unset() {
    if (is_default.string(this.target)) {
      for (const type in this._scopeEvents.delegatedEvents) {
        const delegated = this._scopeEvents.delegatedEvents[type];
        for (let i = delegated.length - 1; i >= 0; i--) {
          const {
            selector,
            context,
            listeners
          } = delegated[i];
          if (selector === this.target && context === this._context) {
            delegated.splice(i, 1);
          }
          for (let l = listeners.length - 1; l >= 0; l--) {
            this._scopeEvents.removeDelegate(this.target, this._context, type, listeners[l][0], listeners[l][1]);
          }
        }
      }
    } else {
      this._scopeEvents.remove(this.target, "all");
    }
  }
};

// node_modules/@interactjs/core/InteractableSet.js
var InteractableSet = class {
  constructor(scope2) {
    // all set interactables
    __publicField(this, "list", []);
    __publicField(this, "selectorMap", {});
    __publicField(this, "scope");
    this.scope = scope2;
    scope2.addListeners({
      "interactable:unset": ({
        interactable
      }) => {
        const {
          target,
          _context: context
        } = interactable;
        const targetMappings = is_default.string(target) ? this.selectorMap[target] : target[this.scope.id];
        const targetIndex = findIndex(targetMappings, (m) => m.context === context);
        if (targetMappings[targetIndex]) {
          targetMappings[targetIndex].context = null;
          targetMappings[targetIndex].interactable = null;
        }
        targetMappings.splice(targetIndex, 1);
      }
    });
  }
  new(target, options) {
    options = extend(options || {}, {
      actions: this.scope.actions
    });
    const interactable = new this.scope.Interactable(target, options, this.scope.document, this.scope.events);
    const mappingInfo = {
      context: interactable._context,
      interactable
    };
    this.scope.addDocument(interactable._doc);
    this.list.push(interactable);
    if (is_default.string(target)) {
      if (!this.selectorMap[target]) {
        this.selectorMap[target] = [];
      }
      this.selectorMap[target].push(mappingInfo);
    } else {
      if (!interactable.target[this.scope.id]) {
        Object.defineProperty(target, this.scope.id, {
          value: [],
          configurable: true
        });
      }
      ;
      target[this.scope.id].push(mappingInfo);
    }
    this.scope.fire("interactable:new", {
      target,
      options,
      interactable,
      win: this.scope._win
    });
    return interactable;
  }
  get(target, options) {
    const context = options && options.context || this.scope.document;
    const isSelector = is_default.string(target);
    const targetMappings = isSelector ? this.selectorMap[target] : target[this.scope.id];
    if (!targetMappings) {
      return null;
    }
    const found = find(targetMappings, (m) => m.context === context && (isSelector || m.interactable.inContext(target)));
    return found && found.interactable;
  }
  forEachMatch(node, callback) {
    for (const interactable of this.list) {
      let ret;
      if ((is_default.string(interactable.target) ? (
        // target is a selector and the element matches
        is_default.element(node) && matchesSelector(node, interactable.target)
      ) : (
        // target is the element
        node === interactable.target
      )) && // the element is in context
      interactable.inContext(node)) {
        ret = callback(interactable);
      }
      if (ret !== void 0) {
        return ret;
      }
    }
  }
};

// node_modules/@interactjs/core/events.js
function install(scope2) {
  var _scope$document;
  const targets = [];
  const delegatedEvents = {};
  const documents = [];
  const eventsMethods = {
    add,
    remove,
    addDelegate,
    removeDelegate,
    delegateListener,
    delegateUseCapture,
    delegatedEvents,
    documents,
    targets,
    supportsOptions: false,
    supportsPassive: false
  };
  (_scope$document = scope2.document) == null ? void 0 : _scope$document.createElement("div").addEventListener("test", null, {
    get capture() {
      return eventsMethods.supportsOptions = true;
    },
    get passive() {
      return eventsMethods.supportsPassive = true;
    }
  });
  scope2.events = eventsMethods;
  function add(eventTarget, type, listener, optionalArg) {
    const options = getOptions(optionalArg);
    let target = find(targets, (t) => t.eventTarget === eventTarget);
    if (!target) {
      target = {
        eventTarget,
        events: {}
      };
      targets.push(target);
    }
    if (!target.events[type]) {
      target.events[type] = [];
    }
    if (eventTarget.addEventListener && !contains(target.events[type], listener)) {
      eventTarget.addEventListener(type, listener, eventsMethods.supportsOptions ? options : options.capture);
      target.events[type].push(listener);
    }
  }
  function remove(eventTarget, type, listener, optionalArg) {
    const options = getOptions(optionalArg);
    const targetIndex = findIndex(targets, (t) => t.eventTarget === eventTarget);
    const target = targets[targetIndex];
    if (!target || !target.events) {
      return;
    }
    if (type === "all") {
      for (type in target.events) {
        if (target.events.hasOwnProperty(type)) {
          remove(eventTarget, type, "all");
        }
      }
      return;
    }
    let typeIsEmpty = false;
    const typeListeners = target.events[type];
    if (typeListeners) {
      if (listener === "all") {
        for (let i = typeListeners.length - 1; i >= 0; i--) {
          remove(eventTarget, type, typeListeners[i], options);
        }
        return;
      } else {
        for (let i = 0; i < typeListeners.length; i++) {
          if (typeListeners[i] === listener) {
            eventTarget.removeEventListener(type, listener, eventsMethods.supportsOptions ? options : options.capture);
            typeListeners.splice(i, 1);
            if (typeListeners.length === 0) {
              delete target.events[type];
              typeIsEmpty = true;
            }
            break;
          }
        }
      }
    }
    if (typeIsEmpty && !Object.keys(target.events).length) {
      targets.splice(targetIndex, 1);
    }
  }
  function addDelegate(selector, context, type, listener, optionalArg) {
    const options = getOptions(optionalArg);
    if (!delegatedEvents[type]) {
      delegatedEvents[type] = [];
      for (const doc of documents) {
        add(doc, type, delegateListener);
        add(doc, type, delegateUseCapture, true);
      }
    }
    const delegates = delegatedEvents[type];
    let delegate = find(delegates, (d) => d.selector === selector && d.context === context);
    if (!delegate) {
      delegate = {
        selector,
        context,
        listeners: []
      };
      delegates.push(delegate);
    }
    delegate.listeners.push([listener, options]);
  }
  function removeDelegate(selector, context, type, listener, optionalArg) {
    const options = getOptions(optionalArg);
    const delegates = delegatedEvents[type];
    let matchFound = false;
    let index;
    if (!delegates)
      return;
    for (index = delegates.length - 1; index >= 0; index--) {
      const cur = delegates[index];
      if (cur.selector === selector && cur.context === context) {
        const {
          listeners
        } = cur;
        for (let i = listeners.length - 1; i >= 0; i--) {
          const [fn, {
            capture,
            passive
          }] = listeners[i];
          if (fn === listener && capture === options.capture && passive === options.passive) {
            listeners.splice(i, 1);
            if (!listeners.length) {
              delegates.splice(index, 1);
              remove(context, type, delegateListener);
              remove(context, type, delegateUseCapture, true);
            }
            matchFound = true;
            break;
          }
        }
        if (matchFound) {
          break;
        }
      }
    }
  }
  function delegateListener(event, optionalArg) {
    const options = getOptions(optionalArg);
    const fakeEvent = new FakeEvent(event);
    const delegates = delegatedEvents[event.type];
    const [eventTarget] = getEventTargets(event);
    let element2 = eventTarget;
    while (is_default.element(element2)) {
      for (let i = 0; i < delegates.length; i++) {
        const cur = delegates[i];
        const {
          selector,
          context
        } = cur;
        if (matchesSelector(element2, selector) && nodeContains(context, eventTarget) && nodeContains(context, element2)) {
          const {
            listeners
          } = cur;
          fakeEvent.currentTarget = element2;
          for (const [fn, {
            capture,
            passive
          }] of listeners) {
            if (capture === options.capture && passive === options.passive) {
              fn(fakeEvent);
            }
          }
        }
      }
      element2 = parentNode(element2);
    }
  }
  function delegateUseCapture(event) {
    return delegateListener.call(this, event, true);
  }
  return eventsMethods;
}
var FakeEvent = class {
  constructor(originalEvent) {
    __publicField(this, "currentTarget");
    __publicField(this, "originalEvent");
    __publicField(this, "type");
    this.originalEvent = originalEvent;
    pointerExtend(this, originalEvent);
  }
  preventOriginalDefault() {
    this.originalEvent.preventDefault();
  }
  stopPropagation() {
    this.originalEvent.stopPropagation();
  }
  stopImmediatePropagation() {
    this.originalEvent.stopImmediatePropagation();
  }
};
function getOptions(param) {
  if (!is_default.object(param)) {
    return {
      capture: !!param,
      passive: false
    };
  }
  const options = extend({}, param);
  options.capture = !!param.capture;
  options.passive = !!param.passive;
  return options;
}
var events_default = {
  id: "events",
  install
};

// node_modules/@interactjs/core/PointerInfo.js
var PointerInfo = class {
  constructor(id, pointer, event, downTime, downTarget) {
    __publicField(this, "id");
    __publicField(this, "pointer");
    __publicField(this, "event");
    __publicField(this, "downTime");
    __publicField(this, "downTarget");
    this.id = id;
    this.pointer = pointer;
    this.event = event;
    this.downTime = downTime;
    this.downTarget = downTarget;
  }
};

// node_modules/@interactjs/core/Interaction.js
var _ProxyValues;
(function(_ProxyValues2) {
  _ProxyValues2["interactable"] = "";
  _ProxyValues2["element"] = "";
  _ProxyValues2["prepared"] = "";
  _ProxyValues2["pointerIsDown"] = "";
  _ProxyValues2["pointerWasMoved"] = "";
  _ProxyValues2["_proxy"] = "";
})(_ProxyValues || (_ProxyValues = {}));
var _ProxyMethods;
(function(_ProxyMethods2) {
  _ProxyMethods2["start"] = "";
  _ProxyMethods2["move"] = "";
  _ProxyMethods2["end"] = "";
  _ProxyMethods2["stop"] = "";
  _ProxyMethods2["interacting"] = "";
})(_ProxyMethods || (_ProxyMethods = {}));
var idCounter = 0;
var Interaction = class {
  /** */
  constructor({
    pointerType,
    scopeFire
  }) {
    // current interactable being interacted with
    __publicField(this, "interactable", null);
    // the target element of the interactable
    __publicField(this, "element", null);
    __publicField(this, "rect", null);
    __publicField(this, "_rects");
    __publicField(this, "edges", null);
    __publicField(this, "_scopeFire");
    // action that's ready to be fired on next move event
    __publicField(this, "prepared", {
      name: null,
      axis: null,
      edges: null
    });
    __publicField(this, "pointerType");
    // keep track of added pointers
    __publicField(this, "pointers", []);
    // pointerdown/mousedown/touchstart event
    __publicField(this, "downEvent", null);
    __publicField(this, "downPointer", {});
    __publicField(this, "_latestPointer", {
      pointer: null,
      event: null,
      eventTarget: null
    });
    // previous action event
    __publicField(this, "prevEvent", null);
    __publicField(this, "pointerIsDown", false);
    __publicField(this, "pointerWasMoved", false);
    __publicField(this, "_interacting", false);
    __publicField(this, "_ending", false);
    __publicField(this, "_stopped", true);
    __publicField(this, "_proxy", null);
    __publicField(this, "simulation", null);
    /**
     * @alias Interaction.prototype.move
     */
    __publicField(this, "doMove", warnOnce(function(signalArg) {
      this.move(signalArg);
    }, "The interaction.doMove() method has been renamed to interaction.move()"));
    __publicField(this, "coords", {
      // Starting InteractEvent pointer coordinates
      start: newCoords(),
      // Previous native pointer move event coordinates
      prev: newCoords(),
      // current native pointer move event coordinates
      cur: newCoords(),
      // Change in coordinates and time of the pointer
      delta: newCoords(),
      // pointer velocity
      velocity: newCoords()
    });
    __publicField(this, "_id", idCounter++);
    this._scopeFire = scopeFire;
    this.pointerType = pointerType;
    const that = this;
    this._proxy = {};
    for (const key in _ProxyValues) {
      Object.defineProperty(this._proxy, key, {
        get() {
          return that[key];
        }
      });
    }
    for (const key in _ProxyMethods) {
      Object.defineProperty(this._proxy, key, {
        value: (...args) => that[key](...args)
      });
    }
    this._scopeFire("interactions:new", {
      interaction: this
    });
  }
  /** @internal */
  get pointerMoveTolerance() {
    return 1;
  }
  pointerDown(pointer, event, eventTarget) {
    const pointerIndex = this.updatePointer(pointer, event, eventTarget, true);
    const pointerInfo = this.pointers[pointerIndex];
    this._scopeFire("interactions:down", {
      pointer,
      event,
      eventTarget,
      pointerIndex,
      pointerInfo,
      type: "down",
      interaction: this
    });
  }
  /**
   * ```js
   * interact(target)
   *   .draggable({
   *     // disable the default drag start by down->move
   *     manualStart: true
   *   })
   *   // start dragging after the user holds the pointer down
   *   .on('hold', function (event) {
   *     var interaction = event.interaction
   *
   *     if (!interaction.interacting()) {
   *       interaction.start({ name: 'drag' },
   *                         event.interactable,
   *                         event.currentTarget)
   *     }
   * })
   * ```
   *
   * Start an action with the given Interactable and Element as tartgets. The
   * action must be enabled for the target Interactable and an appropriate
   * number of pointers must be held down - 1 for drag/resize, 2 for gesture.
   *
   * Use it with `interactable.<action>able({ manualStart: false })` to always
   * [start actions manually](https://github.com/taye/interact.js/issues/114)
   *
   * @param {object} action   The action to be performed - drag, resize, etc.
   * @param {Interactable} target  The Interactable to target
   * @param {Element} element The DOM Element to target
   * @return {Boolean} Whether the interaction was successfully started
   */
  start(action, interactable, element2) {
    if (this.interacting() || !this.pointerIsDown || this.pointers.length < (action.name === "gesture" ? 2 : 1) || !interactable.options[action.name].enabled) {
      return false;
    }
    copyAction(this.prepared, action);
    this.interactable = interactable;
    this.element = element2;
    this.rect = interactable.getRect(element2);
    this.edges = this.prepared.edges ? extend({}, this.prepared.edges) : {
      left: true,
      right: true,
      top: true,
      bottom: true
    };
    this._stopped = false;
    this._interacting = this._doPhase({
      interaction: this,
      event: this.downEvent,
      phase: "start"
    }) && !this._stopped;
    return this._interacting;
  }
  pointerMove(pointer, event, eventTarget) {
    if (!this.simulation && !(this.modification && this.modification.endResult)) {
      this.updatePointer(pointer, event, eventTarget, false);
    }
    const duplicateMove = this.coords.cur.page.x === this.coords.prev.page.x && this.coords.cur.page.y === this.coords.prev.page.y && this.coords.cur.client.x === this.coords.prev.client.x && this.coords.cur.client.y === this.coords.prev.client.y;
    let dx;
    let dy;
    if (this.pointerIsDown && !this.pointerWasMoved) {
      dx = this.coords.cur.client.x - this.coords.start.client.x;
      dy = this.coords.cur.client.y - this.coords.start.client.y;
      this.pointerWasMoved = hypot_default(dx, dy) > this.pointerMoveTolerance;
    }
    const pointerIndex = this.getPointerIndex(pointer);
    const signalArg = {
      pointer,
      pointerIndex,
      pointerInfo: this.pointers[pointerIndex],
      event,
      type: "move",
      eventTarget,
      dx,
      dy,
      duplicate: duplicateMove,
      interaction: this
    };
    if (!duplicateMove) {
      setCoordVelocity(this.coords.velocity, this.coords.delta);
    }
    this._scopeFire("interactions:move", signalArg);
    if (!duplicateMove && !this.simulation) {
      if (this.interacting()) {
        signalArg.type = null;
        this.move(signalArg);
      }
      if (this.pointerWasMoved) {
        copyCoords(this.coords.prev, this.coords.cur);
      }
    }
  }
  /**
   * ```js
   * interact(target)
   *   .draggable(true)
   *   .on('dragmove', function (event) {
   *     if (someCondition) {
   *       // change the snap settings
   *       event.interactable.draggable({ snap: { targets: [] }})
   *       // fire another move event with re-calculated snap
   *       event.interaction.move()
   *     }
   *   })
   * ```
   *
   * Force a move of the current action at the same coordinates. Useful if
   * snap/restrict has been changed and you want a movement with the new
   * settings.
   */
  move(signalArg) {
    if (!signalArg || !signalArg.event) {
      setZeroCoords(this.coords.delta);
    }
    signalArg = extend({
      pointer: this._latestPointer.pointer,
      event: this._latestPointer.event,
      eventTarget: this._latestPointer.eventTarget,
      interaction: this
    }, signalArg || {});
    signalArg.phase = "move";
    this._doPhase(signalArg);
  }
  // End interact move events and stop auto-scroll unless simulation is running
  pointerUp(pointer, event, eventTarget, curEventTarget) {
    let pointerIndex = this.getPointerIndex(pointer);
    if (pointerIndex === -1) {
      pointerIndex = this.updatePointer(pointer, event, eventTarget, false);
    }
    const type = /cancel$/i.test(event.type) ? "cancel" : "up";
    this._scopeFire(`interactions:${type}`, {
      pointer,
      pointerIndex,
      pointerInfo: this.pointers[pointerIndex],
      event,
      eventTarget,
      type,
      curEventTarget,
      interaction: this
    });
    if (!this.simulation) {
      this.end(event);
    }
    this.removePointer(pointer, event);
  }
  documentBlur(event) {
    this.end(event);
    this._scopeFire("interactions:blur", {
      event,
      type: "blur",
      interaction: this
    });
  }
  /**
   * ```js
   * interact(target)
   *   .draggable(true)
   *   .on('move', function (event) {
   *     if (event.pageX > 1000) {
   *       // end the current action
   *       event.interaction.end()
   *       // stop all further listeners from being called
   *       event.stopImmediatePropagation()
   *     }
   *   })
   * ```
   *
   * @param {PointerEvent} [event]
   */
  end(event) {
    this._ending = true;
    event = event || this._latestPointer.event;
    let endPhaseResult;
    if (this.interacting()) {
      endPhaseResult = this._doPhase({
        event,
        interaction: this,
        phase: "end"
      });
    }
    this._ending = false;
    if (endPhaseResult === true) {
      this.stop();
    }
  }
  currentAction() {
    return this._interacting ? this.prepared.name : null;
  }
  interacting() {
    return this._interacting;
  }
  /** */
  stop() {
    this._scopeFire("interactions:stop", {
      interaction: this
    });
    this.interactable = this.element = null;
    this._interacting = false;
    this._stopped = true;
    this.prepared.name = this.prevEvent = null;
  }
  getPointerIndex(pointer) {
    const pointerId = getPointerId(pointer);
    return this.pointerType === "mouse" || this.pointerType === "pen" ? this.pointers.length - 1 : findIndex(this.pointers, (curPointer) => curPointer.id === pointerId);
  }
  getPointerInfo(pointer) {
    return this.pointers[this.getPointerIndex(pointer)];
  }
  updatePointer(pointer, event, eventTarget, down) {
    const id = getPointerId(pointer);
    let pointerIndex = this.getPointerIndex(pointer);
    let pointerInfo = this.pointers[pointerIndex];
    down = down === false ? false : down || /(down|start)$/i.test(event.type);
    if (!pointerInfo) {
      pointerInfo = new PointerInfo(id, pointer, event, null, null);
      pointerIndex = this.pointers.length;
      this.pointers.push(pointerInfo);
    } else {
      pointerInfo.pointer = pointer;
    }
    setCoords(this.coords.cur, this.pointers.map((p) => p.pointer), this._now());
    setCoordDeltas(this.coords.delta, this.coords.prev, this.coords.cur);
    if (down) {
      this.pointerIsDown = true;
      pointerInfo.downTime = this.coords.cur.timeStamp;
      pointerInfo.downTarget = eventTarget;
      pointerExtend(this.downPointer, pointer);
      if (!this.interacting()) {
        copyCoords(this.coords.start, this.coords.cur);
        copyCoords(this.coords.prev, this.coords.cur);
        this.downEvent = event;
        this.pointerWasMoved = false;
      }
    }
    this._updateLatestPointer(pointer, event, eventTarget);
    this._scopeFire("interactions:update-pointer", {
      pointer,
      event,
      eventTarget,
      down,
      pointerInfo,
      pointerIndex,
      interaction: this
    });
    return pointerIndex;
  }
  removePointer(pointer, event) {
    const pointerIndex = this.getPointerIndex(pointer);
    if (pointerIndex === -1)
      return;
    const pointerInfo = this.pointers[pointerIndex];
    this._scopeFire("interactions:remove-pointer", {
      pointer,
      event,
      eventTarget: null,
      pointerIndex,
      pointerInfo,
      interaction: this
    });
    this.pointers.splice(pointerIndex, 1);
    this.pointerIsDown = false;
  }
  _updateLatestPointer(pointer, event, eventTarget) {
    this._latestPointer.pointer = pointer;
    this._latestPointer.event = event;
    this._latestPointer.eventTarget = eventTarget;
  }
  destroy() {
    this._latestPointer.pointer = null;
    this._latestPointer.event = null;
    this._latestPointer.eventTarget = null;
  }
  _createPreparedEvent(event, phase, preEnd, type) {
    return new InteractEvent(this, event, this.prepared.name, phase, this.element, preEnd, type);
  }
  _fireEvent(iEvent) {
    var _this$interactable;
    (_this$interactable = this.interactable) == null ? void 0 : _this$interactable.fire(iEvent);
    if (!this.prevEvent || iEvent.timeStamp >= this.prevEvent.timeStamp) {
      this.prevEvent = iEvent;
    }
  }
  _doPhase(signalArg) {
    const {
      event,
      phase,
      preEnd,
      type
    } = signalArg;
    const {
      rect
    } = this;
    if (rect && phase === "move") {
      addEdges(this.edges, rect, this.coords.delta[this.interactable.options.deltaSource]);
      rect.width = rect.right - rect.left;
      rect.height = rect.bottom - rect.top;
    }
    const beforeResult = this._scopeFire(`interactions:before-action-${phase}`, signalArg);
    if (beforeResult === false) {
      return false;
    }
    const iEvent = signalArg.iEvent = this._createPreparedEvent(event, phase, preEnd, type);
    this._scopeFire(`interactions:action-${phase}`, signalArg);
    if (phase === "start") {
      this.prevEvent = iEvent;
    }
    this._fireEvent(iEvent);
    this._scopeFire(`interactions:after-action-${phase}`, signalArg);
    return true;
  }
  _now() {
    return Date.now();
  }
};
var Interaction_default = Interaction;

// node_modules/@interactjs/core/interactablePreventDefault.js
function preventDefault(newValue) {
  if (/^(always|never|auto)$/.test(newValue)) {
    this.options.preventDefault = newValue;
    return this;
  }
  if (is_default.bool(newValue)) {
    this.options.preventDefault = newValue ? "always" : "never";
    return this;
  }
  return this.options.preventDefault;
}
function checkAndPreventDefault(interactable, scope2, event) {
  const setting = interactable.options.preventDefault;
  if (setting === "never")
    return;
  if (setting === "always") {
    event.preventDefault();
    return;
  }
  if (scope2.events.supportsPassive && /^touch(start|move)$/.test(event.type)) {
    const doc = getWindow(event.target).document;
    const docOptions = scope2.getDocOptions(doc);
    if (!(docOptions && docOptions.events) || docOptions.events.passive !== false) {
      return;
    }
  }
  if (/^(mouse|pointer|touch)*(down|start)/i.test(event.type)) {
    return;
  }
  if (is_default.element(event.target) && matchesSelector(event.target, "input,select,textarea,[contenteditable=true],[contenteditable=true] *")) {
    return;
  }
  event.preventDefault();
}
function onInteractionEvent({
  interaction,
  event
}) {
  if (interaction.interactable) {
    interaction.interactable.checkAndPreventDefault(event);
  }
}
function install2(scope2) {
  const {
    Interactable: Interactable2
  } = scope2;
  Interactable2.prototype.preventDefault = preventDefault;
  Interactable2.prototype.checkAndPreventDefault = function(event) {
    return checkAndPreventDefault(this, scope2, event);
  };
  scope2.interactions.docEvents.push({
    type: "dragstart",
    listener(event) {
      for (const interaction of scope2.interactions.list) {
        if (interaction.element && (interaction.element === event.target || nodeContains(interaction.element, event.target))) {
          interaction.interactable.checkAndPreventDefault(event);
          return;
        }
      }
    }
  });
}
var interactablePreventDefault_default = {
  id: "core/interactablePreventDefault",
  install: install2,
  listeners: ["down", "move", "up", "cancel"].reduce((acc, eventType) => {
    acc[`interactions:${eventType}`] = onInteractionEvent;
    return acc;
  }, {})
};

// node_modules/@interactjs/core/interactionFinder.js
var finder = {
  methodOrder: ["simulationResume", "mouseOrPen", "hasPointer", "idle"],
  search(details) {
    for (const method of finder.methodOrder) {
      const interaction = finder[method](details);
      if (interaction) {
        return interaction;
      }
    }
    return null;
  },
  // try to resume simulation with a new pointer
  simulationResume({
    pointerType,
    eventType,
    eventTarget,
    scope: scope2
  }) {
    if (!/down|start/i.test(eventType)) {
      return null;
    }
    for (const interaction of scope2.interactions.list) {
      let element2 = eventTarget;
      if (interaction.simulation && interaction.simulation.allowResume && interaction.pointerType === pointerType) {
        while (element2) {
          if (element2 === interaction.element) {
            return interaction;
          }
          element2 = parentNode(element2);
        }
      }
    }
    return null;
  },
  // if it's a mouse or pen interaction
  mouseOrPen({
    pointerId,
    pointerType,
    eventType,
    scope: scope2
  }) {
    if (pointerType !== "mouse" && pointerType !== "pen") {
      return null;
    }
    let firstNonActive;
    for (const interaction of scope2.interactions.list) {
      if (interaction.pointerType === pointerType) {
        if (interaction.simulation && !hasPointerId(interaction, pointerId)) {
          continue;
        }
        if (interaction.interacting()) {
          return interaction;
        } else if (!firstNonActive) {
          firstNonActive = interaction;
        }
      }
    }
    if (firstNonActive) {
      return firstNonActive;
    }
    for (const interaction of scope2.interactions.list) {
      if (interaction.pointerType === pointerType && !(/down/i.test(eventType) && interaction.simulation)) {
        return interaction;
      }
    }
    return null;
  },
  // get interaction that has this pointer
  hasPointer({
    pointerId,
    scope: scope2
  }) {
    for (const interaction of scope2.interactions.list) {
      if (hasPointerId(interaction, pointerId)) {
        return interaction;
      }
    }
    return null;
  },
  // get first idle interaction with a matching pointerType
  idle({
    pointerType,
    scope: scope2
  }) {
    for (const interaction of scope2.interactions.list) {
      if (interaction.pointers.length === 1) {
        const target = interaction.interactable;
        if (target && !(target.options.gesture && target.options.gesture.enabled)) {
          continue;
        }
      } else if (interaction.pointers.length >= 2) {
        continue;
      }
      if (!interaction.interacting() && pointerType === interaction.pointerType) {
        return interaction;
      }
    }
    return null;
  }
};
function hasPointerId(interaction, pointerId) {
  return interaction.pointers.some(({
    id
  }) => id === pointerId);
}
var interactionFinder_default = finder;

// node_modules/@interactjs/core/interactions.js
var methodNames = ["pointerDown", "pointerMove", "pointerUp", "updatePointer", "removePointer", "windowBlur"];
function install3(scope2) {
  const listeners = {};
  for (const method of methodNames) {
    listeners[method] = doOnInteractions(method, scope2);
  }
  const pEventTypes = browser_default.pEventTypes;
  let docEvents;
  if (domObjects_default.PointerEvent) {
    docEvents = [{
      type: pEventTypes.down,
      listener: releasePointersOnRemovedEls
    }, {
      type: pEventTypes.down,
      listener: listeners.pointerDown
    }, {
      type: pEventTypes.move,
      listener: listeners.pointerMove
    }, {
      type: pEventTypes.up,
      listener: listeners.pointerUp
    }, {
      type: pEventTypes.cancel,
      listener: listeners.pointerUp
    }];
  } else {
    docEvents = [{
      type: "mousedown",
      listener: listeners.pointerDown
    }, {
      type: "mousemove",
      listener: listeners.pointerMove
    }, {
      type: "mouseup",
      listener: listeners.pointerUp
    }, {
      type: "touchstart",
      listener: releasePointersOnRemovedEls
    }, {
      type: "touchstart",
      listener: listeners.pointerDown
    }, {
      type: "touchmove",
      listener: listeners.pointerMove
    }, {
      type: "touchend",
      listener: listeners.pointerUp
    }, {
      type: "touchcancel",
      listener: listeners.pointerUp
    }];
  }
  docEvents.push({
    type: "blur",
    listener(event) {
      for (const interaction of scope2.interactions.list) {
        interaction.documentBlur(event);
      }
    }
  });
  scope2.prevTouchTime = 0;
  scope2.Interaction = class extends Interaction_default {
    get pointerMoveTolerance() {
      return scope2.interactions.pointerMoveTolerance;
    }
    set pointerMoveTolerance(value) {
      scope2.interactions.pointerMoveTolerance = value;
    }
    _now() {
      return scope2.now();
    }
  };
  scope2.interactions = {
    // all active and idle interactions
    list: [],
    new(options) {
      options.scopeFire = (name, arg) => scope2.fire(name, arg);
      const interaction = new scope2.Interaction(options);
      scope2.interactions.list.push(interaction);
      return interaction;
    },
    listeners,
    docEvents,
    pointerMoveTolerance: 1
  };
  function releasePointersOnRemovedEls() {
    for (const interaction of scope2.interactions.list) {
      if (!interaction.pointerIsDown || interaction.pointerType !== "touch" || interaction._interacting) {
        continue;
      }
      for (const pointer of interaction.pointers) {
        if (!scope2.documents.some(({
          doc
        }) => nodeContains(doc, pointer.downTarget))) {
          interaction.removePointer(pointer.pointer, pointer.event);
        }
      }
    }
  }
  scope2.usePlugin(interactablePreventDefault_default);
}
function doOnInteractions(method, scope2) {
  return function(event) {
    const interactions2 = scope2.interactions.list;
    const pointerType = getPointerType(event);
    const [eventTarget, curEventTarget] = getEventTargets(event);
    const matches = [];
    if (/^touch/.test(event.type)) {
      scope2.prevTouchTime = scope2.now();
      for (const changedTouch of event.changedTouches) {
        const pointer = changedTouch;
        const pointerId = getPointerId(pointer);
        const searchDetails = {
          pointer,
          pointerId,
          pointerType,
          eventType: event.type,
          eventTarget,
          curEventTarget,
          scope: scope2
        };
        const interaction = getInteraction(searchDetails);
        matches.push([searchDetails.pointer, searchDetails.eventTarget, searchDetails.curEventTarget, interaction]);
      }
    } else {
      let invalidPointer = false;
      if (!browser_default.supportsPointerEvent && /mouse/.test(event.type)) {
        for (let i = 0; i < interactions2.length && !invalidPointer; i++) {
          invalidPointer = interactions2[i].pointerType !== "mouse" && interactions2[i].pointerIsDown;
        }
        invalidPointer = invalidPointer || scope2.now() - scope2.prevTouchTime < 500 || // on iOS and Firefox Mobile, MouseEvent.timeStamp is zero if simulated
        event.timeStamp === 0;
      }
      if (!invalidPointer) {
        const searchDetails = {
          pointer: event,
          pointerId: getPointerId(event),
          pointerType,
          eventType: event.type,
          curEventTarget,
          eventTarget,
          scope: scope2
        };
        const interaction = getInteraction(searchDetails);
        matches.push([searchDetails.pointer, searchDetails.eventTarget, searchDetails.curEventTarget, interaction]);
      }
    }
    for (const [pointer, eventTarget2, curEventTarget2, interaction] of matches) {
      interaction[method](pointer, event, eventTarget2, curEventTarget2);
    }
  };
}
function getInteraction(searchDetails) {
  const {
    pointerType,
    scope: scope2
  } = searchDetails;
  const foundInteraction = interactionFinder_default.search(searchDetails);
  const signalArg = {
    interaction: foundInteraction,
    searchDetails
  };
  scope2.fire("interactions:find", signalArg);
  return signalArg.interaction || scope2.interactions.new({
    pointerType
  });
}
function onDocSignal({
  doc,
  scope: scope2,
  options
}, eventMethodName) {
  const {
    interactions: {
      docEvents
    },
    events
  } = scope2;
  const eventMethod = events[eventMethodName];
  if (scope2.browser.isIOS && !options.events) {
    options.events = {
      passive: false
    };
  }
  for (const eventType in events.delegatedEvents) {
    eventMethod(doc, eventType, events.delegateListener);
    eventMethod(doc, eventType, events.delegateUseCapture, true);
  }
  const eventOptions = options && options.events;
  for (const {
    type,
    listener
  } of docEvents) {
    eventMethod(doc, type, listener, eventOptions);
  }
}
var interactions = {
  id: "core/interactions",
  install: install3,
  listeners: {
    "scope:add-document": (arg) => onDocSignal(arg, "add"),
    "scope:remove-document": (arg) => onDocSignal(arg, "remove"),
    "interactable:unset": ({
      interactable
    }, scope2) => {
      for (let i = scope2.interactions.list.length - 1; i >= 0; i--) {
        const interaction = scope2.interactions.list[i];
        if (interaction.interactable !== interactable) {
          continue;
        }
        interaction.stop();
        scope2.fire("interactions:destroy", {
          interaction
        });
        interaction.destroy();
        if (scope2.interactions.list.length > 2) {
          scope2.interactions.list.splice(i, 1);
        }
      }
    }
  },
  onDocSignal,
  doOnInteractions,
  methodNames
};
var interactions_default = interactions;

// node_modules/@interactjs/core/scope.js
var Scope = class {
  constructor() {
    __publicField(this, "id", `__interact_scope_${Math.floor(Math.random() * 100)}`);
    __publicField(this, "isInitialized", false);
    __publicField(this, "listenerMaps", []);
    __publicField(this, "browser", browser_default);
    __publicField(this, "defaults", clone(defaults));
    __publicField(this, "Eventable", Eventable);
    __publicField(this, "actions", {
      map: {},
      phases: {
        start: true,
        move: true,
        end: true
      },
      methodDict: {},
      phaselessTypes: {}
    });
    __publicField(this, "interactStatic", createInteractStatic(this));
    __publicField(this, "InteractEvent", InteractEvent);
    __publicField(this, "Interactable");
    __publicField(this, "interactables", new InteractableSet(this));
    // main window
    __publicField(this, "_win");
    // main document
    __publicField(this, "document");
    // main window
    __publicField(this, "window");
    // all documents being listened to
    __publicField(this, "documents", []);
    __publicField(this, "_plugins", {
      list: [],
      map: {}
    });
    __publicField(this, "onWindowUnload", (event) => this.removeDocument(event.target));
    const scope2 = this;
    this.Interactable = class extends Interactable {
      get _defaults() {
        return scope2.defaults;
      }
      set(options) {
        super.set(options);
        scope2.fire("interactable:set", {
          options,
          interactable: this
        });
        return this;
      }
      unset() {
        super.unset();
        const index = scope2.interactables.list.indexOf(this);
        if (index < 0)
          return;
        scope2.interactables.list.splice(index, 1);
        scope2.fire("interactable:unset", {
          interactable: this
        });
      }
    };
  }
  addListeners(map, id) {
    this.listenerMaps.push({
      id,
      map
    });
  }
  fire(name, arg) {
    for (const {
      map: {
        [name]: listener
      }
    } of this.listenerMaps) {
      if (!!listener && listener(arg, this, name) === false) {
        return false;
      }
    }
  }
  init(window3) {
    return this.isInitialized ? this : initScope(this, window3);
  }
  pluginIsInstalled(plugin) {
    return this._plugins.map[plugin.id] || this._plugins.list.indexOf(plugin) !== -1;
  }
  usePlugin(plugin, options) {
    if (!this.isInitialized) {
      return this;
    }
    if (this.pluginIsInstalled(plugin)) {
      return this;
    }
    if (plugin.id) {
      this._plugins.map[plugin.id] = plugin;
    }
    this._plugins.list.push(plugin);
    if (plugin.install) {
      plugin.install(this, options);
    }
    if (plugin.listeners && plugin.before) {
      let index = 0;
      const len = this.listenerMaps.length;
      const before = plugin.before.reduce((acc, id) => {
        acc[id] = true;
        acc[pluginIdRoot(id)] = true;
        return acc;
      }, {});
      for (; index < len; index++) {
        const otherId = this.listenerMaps[index].id;
        if (before[otherId] || before[pluginIdRoot(otherId)]) {
          break;
        }
      }
      this.listenerMaps.splice(index, 0, {
        id: plugin.id,
        map: plugin.listeners
      });
    } else if (plugin.listeners) {
      this.listenerMaps.push({
        id: plugin.id,
        map: plugin.listeners
      });
    }
    return this;
  }
  addDocument(doc, options) {
    if (this.getDocIndex(doc) !== -1) {
      return false;
    }
    const window3 = getWindow(doc);
    options = options ? extend({}, options) : {};
    this.documents.push({
      doc,
      options
    });
    this.events.documents.push(doc);
    if (doc !== this.document) {
      this.events.add(window3, "unload", this.onWindowUnload);
    }
    this.fire("scope:add-document", {
      doc,
      window: window3,
      scope: this,
      options
    });
  }
  removeDocument(doc) {
    const index = this.getDocIndex(doc);
    const window3 = getWindow(doc);
    const options = this.documents[index].options;
    this.events.remove(window3, "unload", this.onWindowUnload);
    this.documents.splice(index, 1);
    this.events.documents.splice(index, 1);
    this.fire("scope:remove-document", {
      doc,
      window: window3,
      scope: this,
      options
    });
  }
  getDocIndex(doc) {
    for (let i = 0; i < this.documents.length; i++) {
      if (this.documents[i].doc === doc) {
        return i;
      }
    }
    return -1;
  }
  getDocOptions(doc) {
    const docIndex = this.getDocIndex(doc);
    return docIndex === -1 ? null : this.documents[docIndex].options;
  }
  now() {
    return (this.window.Date || Date).now();
  }
};
function initScope(scope2, window3) {
  scope2.isInitialized = true;
  if (is_default.window(window3)) {
    init2(window3);
  }
  domObjects_default.init(window3);
  browser_default.init(window3);
  raf_default.init(window3);
  scope2.window = window3;
  scope2.document = window3.document;
  scope2.usePlugin(interactions_default);
  scope2.usePlugin(events_default);
  return scope2;
}
function pluginIdRoot(id) {
  return id && id.replace(/\/.*$/, "");
}

// node_modules/@interactjs/interact/index.js
var scope = new Scope();
var interact = scope.interactStatic;
var interact_default = interact;
var _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : void 0;
scope.init(_global);

export {
  win,
  is_default,
  domObjects_default,
  clone,
  extend,
  parentNode,
  matchesUpTo,
  resolveRectLike,
  rectToXY,
  xywhToTlbr,
  tlbrToXywh,
  addEdges,
  getOriginXY_default,
  hypot_default,
  warnOnce,
  copyAction,
  interact_default
};
//# sourceMappingURL=chunk-NZVBT32X.js.map
