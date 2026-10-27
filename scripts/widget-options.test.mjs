import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const React = require("react");

function compile(file) {
  const source = readFileSync(new URL(`../src/docs-app/ui/components/widgets/${file}`, import.meta.url), "utf8")
    .replaceAll("import.meta.env.DEV", "true");
  return ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React },
  }).outputText;
}

const sdkCode = compile("showpass-sdk.ts");
const widgets = [
  ["ShowpassCalendarWidget", "calendarWidget"],
  ["ShowpassProductWidget", "productPurchaseWidget"],
  ["ShowpassMembershipWidget", "membershipPurchaseWidget"],
  ["ShowpassMountedWidget", "calendarWidget"],
].map(([component, method]) => ({ component, method, code: compile(`${component}.tsx`) }));

// Exercise the actual click/effect handlers while capturing SDK arguments.
// No remote SDK is fetched and no browser lifecycle behavior is simulated.
async function launch(widget, options, queued = false) {
  const calls = [];
  const effects = [];
  const tickets = {
    [widget.method]: async (id, params, containerId) => {
      calls.push({ method: widget.method, id, params, containerId });
      return {};
    },
  };
  const window = queued
    ? { __shwps: (method, id, params) => calls.push({ method: method.replace("tickets.", ""), id, params }) }
    : { showpass: { tickets, config: { host: "https://localhost.showpass.com" } } };
  const sdk = {};
  vm.runInNewContext(sdkCode, { exports: sdk, window, document: {}, Promise, Error });
  const exports = {};
  vm.runInNewContext(widget.code, {
    exports,
    window,
    console,
    require: name => {
      if (name === "./showpass-sdk") return sdk;
      if (name === "@/shared/components/button.tsx") return { Button: "button" };
      if (name === "react") return {
        ...React,
        useId: () => ":widget:",
        useRef: value => ({ current: value }),
        useState: () => ["", () => {}],
        useEffect: effect => effects.push(effect),
      };
      return require(name);
    },
  });
  const element = exports.default({
    id: "123", venueId: "123", method: widget.method, label: "Preview",
    themeColor: "#123456", environment: "dev", options,
  });
  element.props.onClick?.();
  const cleanups = effects.map(effect => effect());
  await new Promise(setImmediate);
  for (const cleanup of cleanups) cleanup?.();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].method, widget.method);
  assert.equal(calls[0].id, "123");
  if (widget.component === "ShowpassMountedWidget") assert.ok(calls[0].containerId);
  return calls[0].params;
}

const cases = [
  { name: "legacy options override defaults", options: { "keep-shopping": false, "theme-primary": "#abcdef" }, keepShopping: false, theme: "#abcdef" },
  { name: "canonical options override defaults", options: { keep_shopping: false, theme_primary: "#abcdef" }, keepShopping: false, theme: "#abcdef" },
  { name: "explicit canonical false and empty values win over aliases", options: { keep_shopping: false, "keep-shopping": true, theme_primary: "", "theme-primary": "#abcdef" }, keepShopping: false, theme: "" },
  { name: "undefined canonical options fall back to aliases", options: { keep_shopping: undefined, "keep-shopping": false, theme_primary: undefined, "theme-primary": "#abcdef" }, keepShopping: false, theme: "#abcdef" },
];

for (const widget of widgets) {
  test(`${widget.component} retains defaults when options are omitted`, async () => {
    const params = await launch(widget);
    assert.equal(params.keep_shopping, true);
    assert.equal(params.theme_primary, widget.component === "ShowpassMountedWidget" ? "#123456" : "#FF7F00");
  });

  for (const scenario of cases) {
    test(`${widget.component}: ${scenario.name}`, async () => {
      const options = Object.freeze({
        ...scenario.options,
        calendar_special_event: ["opening-night"],
        "tracking-id": "campaign",
      });
      const before = { ...options };
      const params = await launch(widget, options);
      assert.equal(params.keep_shopping, scenario.keepShopping);
      assert.equal(params.theme_primary, scenario.theme);
      assert.equal(params.calendar_special_event, options.calendar_special_event);
      assert.equal(params["tracking-id"], "campaign");
      assert.ok(!Object.hasOwn(params, "keep-shopping"));
      assert.ok(!Object.hasOwn(params, "theme-primary"));
      assert.deepEqual(options, before);
    });
  }

  if (widget.component !== "ShowpassMountedWidget") {
    test(`${widget.component} preserves legacy options when queueing an SDK call`, async () => {
      const params = await launch(widget, cases[0].options, true);
      assert.equal(params.keep_shopping, false);
      assert.equal(params.theme_primary, "#abcdef");
    });
  }
}
