import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { StaticRouter } = require("react-router-dom/server");

const source = readFileSync(new URL("../src/docs-app/ui/components/widgets/checkout-restart.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;

function fixture() {
  const listeners = new Set();
  const timers = new Map();
  const replies = [];
  const events = [];
  const controller = new AbortController();
  const window = {
    crypto: webcrypto,
    location: { origin: "https://dev.showpass.com", reload: () => events.push("reload") },
    history: {
      state: { idx: 0 },
      replaceState(state, title, url) { this.state = state; if (url) window.location.href = new URL(url, window.location.origin).toString(); },
    },
    addEventListener: (type, fn) => listeners.add(fn),
    removeEventListener: (type, fn) => listeners.delete(fn),
    setTimeout: (fn, delay) => { const id = Symbol(); timers.set(id, { fn, delay }); return id; },
    clearTimeout: id => timers.delete(id),
  };
  const frame = {
    src: "",
    contentWindow: { postMessage: (...args) => replies.push(args) },
    removeAttribute: name => { assert.equal(name, "src"); frame.src = ""; },
  };
  const exports = {};
  vm.runInNewContext(code, { window, exports, Error, DOMException, URL, URLSearchParams, Uint32Array });
  const options = { origin: "https://www.showpass.com", signal: controller.signal };
  function message(status, overrides = {}) {
    const requestId = frame.src ? new URL(frame.src).searchParams.get("requestId") : "late";
    for (const listener of [...listeners]) listener({ origin: options.origin, source: frame.contentWindow, data: { type: exports.CHECKOUT_RESET_MESSAGE, requestId, status }, ...overrides });
  }
  return { ...exports, window, frame, options, controller, listeners, timers, events, replies, message };
}

test("navigation retains only public settings and strips tokens and reset state", () => {
  const f = fixture();
  const search = new URLSearchParams({ environment: "demo", eventId: "event", membershipId: "membership", theme: "#24727b", tab: "mounted", widget: "event", customer_attribution_token: "SECRET", token: "SECRET", returnUrl: "https://evil.example", checkoutAction: "reset" });
  const resetUrl = new URL(f.getCheckoutResetUrl(search, "reset"), f.window.location.origin);
  assert.equal(resetUrl.pathname, "/sdk/widget-playground");
  assert.equal(resetUrl.searchParams.get("memberId"), "membership");
  assert.equal(resetUrl.searchParams.get("checkoutAction"), "reset");
  assert.equal(resetUrl.searchParams.get("environment"), "demo");
  assert.equal(resetUrl.searchParams.get("eventId"), "event");
  assert.equal(resetUrl.searchParams.get("tab"), "mounted");
  assert.ok(!resetUrl.toString().includes("SECRET"));
  assert.ok(!resetUrl.searchParams.has("returnUrl"));
  const back = new URL(f.getCheckoutResetUrl(resetUrl.searchParams), f.window.location.origin);
  assert.ok(!back.searchParams.has("checkoutAction"));
  assert.equal(back.searchParams.get("theme"), "#24727b");
});

test("a button click reloads the Playground with a single-use reset intent and no token", () => {
  const f = fixture();
  assert.equal(f.consumeCheckoutResetIntent(), false);
  f.startCheckoutReset(new URLSearchParams({ environment: "demo", eventId: "test-event", customer_attribution_token: "SECRET" }));
  const url = new URL(f.window.location.href);
  assert.equal(url.pathname, "/sdk/widget-playground");
  assert.equal(url.searchParams.get("checkoutAction"), "reset");
  assert.ok(!f.window.location.href.includes("SECRET"));
  assert.ok(!JSON.stringify(f.window.history.state).includes("SECRET"));
  assert.deepEqual(f.events, ["reload"]);
  assert.equal(f.consumeCheckoutResetIntent(), true);
  assert.equal(f.consumeCheckoutResetIntent(), false);
  assert.equal(f.window.history.state.idx, 0);
});

test("a completed reset retains public settings without starting another reset", () => {
  const f = fixture();
  const url = new URL(f.getCheckoutResetUrl(new URLSearchParams({ eventId: "test-event", checkoutAction: "reset", token: "SECRET" })), f.window.location.origin);
  assert.ok(!url.searchParams.has("checkoutAction"));
  assert.equal(url.searchParams.get("eventId"), "test-event");
  assert.ok(!url.toString().includes("SECRET"));
  assert.equal(f.consumeCheckoutResetIntent(), false);
});

test("expired or malformed history markers cannot authorize reset", () => {
  const f = fixture();
  for (const timestamp of [Date.now() - 61_000, Date.now() + 61_000, true, "reset"]) {
    f.window.history.state = { playgroundBasketReset: timestamp };
    assert.equal(f.consumeCheckoutResetIntent(), false);
  }
});

function renderReset(search, state = null) {
  const f = fixture();
  const componentSource = readFileSync(new URL("../src/docs-app/ui/components/widgets/PlaygroundCheckoutReset.tsx", import.meta.url), "utf8");
  const componentCode = ts.transpileModule(componentSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React } }).outputText;
  const exports = {};
  vm.runInNewContext(componentCode, {
    exports,
    require: name => {
      if (name === "@/shared/components/button") return { Button: props => React.createElement("button", props) };
      if (name === "./checkout-restart") return f;
      if (name === "./showpass-sdk") return { WIDGET_ENVIRONMENTS: { demo: { origin: "https://demo.showpass.com" } } };
      return require(name);
    },
  });
  return renderToStaticMarkup(React.createElement(StaticRouter, { location: { pathname: "/sdk/widget-playground", search, state } },
    React.createElement(exports.default, { environment: "demo", disabled: false })));
}

test("a shared completion URL cannot display verified reset success", () => {
  const html = renderReset("?checkoutAction=complete");
  assert.ok(!html.includes("Basket reset. Paste the next customer token."));
});

test("verified completion is reported inline without a confirmation UI", () => {
  const html = renderReset("", { basketResetComplete: true });
  assert.ok(html.includes('role="status"'));
  assert.ok(html.includes("Basket reset. Paste the next customer token."));
  assert.ok(!html.includes("<iframe"));
  assert.ok(!html.includes('role="dialog"'));
});

test("reset progress keeps its helper hidden and disables the reset button", () => {
  const html = renderReset("?checkoutAction=reset");
  assert.match(html, /<button[^>]*disabled=""/);
  assert.match(html, /<iframe[^>]*hidden=""/);
  assert.ok(html.includes("Resetting basket…"));
  assert.ok(!html.includes('role="dialog"'));
});

test("the private bridge starts without an SDK and sends no customer or basket credentials", async () => {
  const f = fixture();
  const pending = f.runCheckoutRestart(f.frame, f.options);
  const url = new URL(f.frame.src);
  assert.equal(url.origin, f.options.origin);
  assert.equal(url.pathname, "/widget/playground/checkout-reset/");
  assert.deepEqual([...url.searchParams.keys()], ["parentOrigin", "requestId"]);
  assert.equal(url.searchParams.get("parentOrigin"), f.window.location.origin);
  assert.match(url.searchParams.get("requestId"), /^[a-f0-9]{32}$/);
  f.message("ready");
  assert.deepEqual(JSON.parse(JSON.stringify(f.replies)), [[{ type: f.CHECKOUT_RESET_MESSAGE, requestId: url.searchParams.get("requestId"), status: "initialize" }, f.options.origin]]);
  f.message("complete");
  assert.equal(await pending, undefined);
  assert.equal(f.listeners.size, 0);
  assert.equal(f.timers.size, 0);
  assert.equal(f.frame.src, "");
});

test("only the expected frame, origin, request and message can complete a ready reset", async () => {
  const f = fixture();
  const pending = f.runCheckoutRestart(f.frame, f.options);
  f.message("complete");
  f.message("ready", { origin: "https://evil.example" });
  f.message("ready", { source: {} });
  f.message("ready", { data: { type: f.CHECKOUT_RESET_MESSAGE, requestId: "wrong", status: "ready" } });
  f.message("ready", { data: null });
  f.message("ready", { data: "showpass.widget.close" });
  assert.deepEqual(f.events, []);
  f.message("ready");
  f.message("ready");
  f.message("unknown");
  assert.deepEqual(f.events, []);
  assert.equal(f.replies.length, 1);
  assert.equal(f.listeners.size, 1);
  f.message("complete");
  assert.equal(await pending, undefined);
});

test("a legacy confirmation helper cannot start or complete the automatic reset", async () => {
  const f = fixture();
  const pending = f.runCheckoutRestart(f.frame, f.options);
  const requestId = new URL(f.frame.src).searchParams.get("requestId");
  f.message("ready", { data: { type: "showpass.playground.checkout-reset", requestId, status: "ready" } });
  f.message("complete", { data: { type: "showpass.playground.checkout-reset", requestId, status: "complete" } });
  assert.equal(f.replies.length, 0);
  [...f.timers.values()][0].fn();
  await assert.rejects(pending, { name: "CheckoutRestartUnavailableError" });
});

test("an unverified attempt rejects and a retry uses a fresh request identity", async () => {
  const f = fixture();
  const first = f.runCheckoutRestart(f.frame, f.options);
  const oldId = new URL(f.frame.src).searchParams.get("requestId");
  f.message("ready");
  f.message("failed");
  await assert.rejects(first, /could not be verified/);
  const second = f.runCheckoutRestart(f.frame, f.options);
  assert.notEqual(new URL(f.frame.src).searchParams.get("requestId"), oldId);
  f.message("ready");
  f.message("complete", { data: { type: f.CHECKOUT_RESET_MESSAGE, requestId: oldId, status: "complete" } });
  assert.equal(f.listeners.size, 1);
  f.message("complete");
  assert.equal(await second, undefined);
});

test("an unavailable hosted helper times out and removes listeners", async () => {
  const f = fixture();
  const pending = f.runCheckoutRestart(f.frame, f.options);
  const timer = [...f.timers.values()][0];
  assert.equal(timer.delay, 30_000);
  timer.fn();
  await assert.rejects(pending, { name: "CheckoutRestartUnavailableError" });
  assert.equal(f.frame.src, "");
  assert.equal(f.listeners.size, 0);
});

test("a helper that stops responding after readiness fails and offers retry", async () => {
  const f = fixture();
  const pending = f.runCheckoutRestart(f.frame, f.options);
  f.message("ready");
  assert.equal(f.timers.size, 1);
  const timer = [...f.timers.values()][0];
  assert.equal(timer.delay, 120_000);
  timer.fn();
  await assert.rejects(pending, /could not be verified/);
  assert.equal(f.listeners.size, 0);
  assert.equal(f.frame.src, "");
});

test("an already-aborted request never loads the helper", async () => {
  const f = fixture();
  f.controller.abort();
  await assert.rejects(f.runCheckoutRestart(f.frame, f.options), { name: "AbortError" });
  assert.equal(f.frame.src, "");
  assert.equal(f.listeners.size, 0);
});

test("unsupported browser context reports unavailable before loading an iframe", async () => {
  const f = fixture();
  f.window.location.origin = "null";
  await assert.rejects(f.runCheckoutRestart(f.frame, f.options), { name: "CheckoutRestartUnavailableError" });
  assert.equal(f.frame.src, "");
});

test("local and preview pages cannot reset Production or Demo baskets", async () => {
  for (const parentOrigin of ["http://localhost:8080", "https://preview.example"]) {
    const f = fixture();
    f.window.location.origin = parentOrigin;
    await assert.rejects(f.runCheckoutRestart(f.frame, f.options), { name: "CheckoutRestartUnavailableError" });
    assert.equal(f.frame.src, "");
    assert.equal(f.listeners.size, 0);
  }
});

test("the loopback Playground can reset only the configured local Showpass app", async () => {
  const f = fixture();
  f.window.location.origin = "http://127.0.0.1:8080";
  const pending = f.runCheckoutRestart(f.frame, { ...f.options, origin: "https://localhost.showpass.com" });
  assert.equal(new URL(f.frame.src).origin, "https://localhost.showpass.com");
  f.controller.abort();
  await assert.rejects(pending, { name: "AbortError" });
});

test("the private helper cannot be redirected to an arbitrary host", async () => {
  const f = fixture();
  await assert.rejects(f.runCheckoutRestart(f.frame, { ...f.options, origin: "https://evil.example" }), { name: "CheckoutRestartUnavailableError" });
  assert.equal(f.frame.src, "");
});
