import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/docs-app/ui/components/widgets/checkout-restart.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const exports = {};
vm.runInNewContext(code, { exports, Error, DOMException });
const { runCheckoutRestart } = exports;

function fixture() {
  const controller = new AbortController();
  const events = [];
  return { controller, events, options: {
    signal: controller.signal,
    onStart: () => events.push("closed"),
    onRestorePreviews: (completed) => events.push(completed ? "new-preview" : "retained-basket-preview"),
  } };
}

test("an older SDK reports unavailable without closing existing previews", async () => {
  const f = fixture();
  await assert.rejects(runCheckoutRestart({}, f.options), { name: "CheckoutRestartUnavailableError" });
  assert.deepEqual(f.events, []);
});

test("verified completion restores previews and passes only an in-memory abort signal", async () => {
  const f = fixture();
  const tickets = { async startNewCheckout(options) {
    assert.equal(this, tickets);
    assert.deepEqual(Object.keys(options), ["signal"]);
    assert.equal(options.signal, f.controller.signal);
    assert.deepEqual(f.events, ["closed"]);
    return true;
  } };
  assert.equal(await runCheckoutRestart(tickets, f.options), true);
  assert.deepEqual(f.events, ["closed", "new-preview"]);
});

test("safe cancellation restores the retained basket preview", async () => {
  const f = fixture();
  assert.equal(await runCheckoutRestart({ startNewCheckout: async () => false }, f.options), false);
  assert.deepEqual(f.events, ["closed", "retained-basket-preview"]);
});

test("failed expiry leaves previews closed for retry", async () => {
  const f = fixture();
  await assert.rejects(runCheckoutRestart({ startNewCheckout: async () => { throw new Error("offline"); } }, f.options), /offline/);
  assert.deepEqual(f.events, ["closed"]);
  await runCheckoutRestart({ startNewCheckout: async () => true }, f.options);
  assert.deepEqual(f.events, ["closed", "closed", "new-preview"]);
});

for (const result of [undefined, null, "true", 1, {}]) {
  test(`an unverified SDK result (${String(result)}) does not reopen previews`, async () => {
    const f = fixture();
    await assert.rejects(runCheckoutRestart({ startNewCheckout: async () => result }, f.options), /did not verify/);
    assert.deepEqual(f.events, ["closed"]);
  });
}

test("an already-aborted request does not start a reset", async () => {
  const f = fixture();
  f.controller.abort();
  await assert.rejects(runCheckoutRestart({ startNewCheckout: async () => { assert.fail("must not start"); } }, f.options), { name: "AbortError" });
  assert.deepEqual(f.events, []);
});

test("an aborted wait does not treat late success as a safe cancellation or restore previews", async () => {
  const f = fixture();
  let finish;
  const reset = runCheckoutRestart({ startNewCheckout: () => new Promise(resolve => { finish = resolve; }) }, f.options);
  f.controller.abort();
  finish(true);
  await assert.rejects(reset, { name: "AbortError" });
  assert.deepEqual(f.events, ["closed"]);
});
