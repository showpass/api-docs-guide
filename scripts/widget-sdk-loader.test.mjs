import assert from "node:assert/strict";
import test from "node:test";
import ts from "typescript";
import { readFileSync } from "node:fs";
import vm from "node:vm";

// Exercise the actual loader with script events, without fetching remote SDKs.
function fixture(development = true) {
  const scripts = [];
  const window = { setTimeout, clearTimeout };
  class Script extends EventTarget {
    attributes = new Map();
    setAttribute(key, value) { this.attributes.set(key, value); }
    getAttribute(key) { return this.attributes.get(key); }
    remove() { scripts.splice(scripts.indexOf(this), 1); }
  }
  const document = {
    createElement: () => new Script(),
    querySelector: (selector) => scripts.find(s => selector.includes(s.src)) ?? null,
    head: { appendChild: script => scripts.push(script) },
  };
  const exports = {};
  const source = readFileSync(new URL("../src/docs-app/ui/components/widgets/showpass-sdk.ts", import.meta.url), "utf8").replaceAll("import.meta.env.DEV", String(development));
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  vm.runInNewContext(code, { window, document, exports, Set, Promise, Error });
  return { ...exports, window, scripts };
}

for (const [environment, host] of Object.entries({ prod: 'www', demo: 'demo', dev: 'localhost' })) {
  test(`loads one current SDK in ${environment} and shares concurrent requests`, async () => {
    const f = fixture();
    const first = f.loadShowpassSdk(environment);
    const second = f.loadShowpassSdk(environment);
    assert.equal(first, second);
    assert.equal(f.scripts.length, 1);
    const sdkPath = environment === "dev" ? "/platform/sdk/sdk.js" : "/static/dist/sdk.js";
    assert.equal(f.scripts[0].src, `https://${host}.showpass.com${sdkPath}`);
    f.window.showpass = { tickets: {}, config: { host: `https://${host}.showpass.com` } };
    f.scripts[0].dispatchEvent(new Event('load'));
    assert.equal(await first, f.window.showpass.tickets);
    await f.loadShowpassSdk(environment);
    assert.equal(f.scripts.length, 1);
    await assert.rejects(f.loadShowpassSdk(environment === 'dev' ? 'prod' : 'dev'), /Reload/);
  });
}

test('rejects an already loaded legacy SDK instead of exposing a token in a URL', async () => {
  const f = fixture();
  f.window.showpass = { tickets: {} };
  await assert.rejects(f.loadShowpassSdk('dev'), /current Showpass SDK/);
  assert.equal(f.scripts.length, 0);
});

test('rejects an SDK built for a different environment', async () => {
  const f = fixture();
  const request = f.loadShowpassSdk('dev');
  f.window.showpass = { tickets: {}, config: { host: 'https://www.showpass.com' } };
  f.scripts[0].dispatchEvent(new Event('load'));
  await assert.rejects(request, /does not match/);
});

test('rejects a legacy SDK returned by the script endpoint', async () => {
  const f = fixture();
  const request = f.loadShowpassSdk('dev');
  f.window.showpass = { tickets: {} };
  f.scripts[0].dispatchEvent(new Event('load'));
  await assert.rejects(request, /current Showpass SDK is unavailable/);
});

test('reports script errors and allows a fresh load attempt', async () => {
  const f = fixture();
  const request = f.loadShowpassSdk();
  f.scripts[0].dispatchEvent(new Event('error'));
  await assert.rejects(request, /Unable to load/);
  const retry = f.loadShowpassSdk();
  assert.equal(f.scripts.length, 1);
  f.window.showpass = { tickets: {}, config: { host: 'https://www.showpass.com' } };
  f.scripts[0].dispatchEvent(new Event('load'));
  assert.equal(await retry, f.window.showpass.tickets);
});

for (const development of [false, true]) {
  test(`offers the correct environments in ${development ? 'development' : 'production'} builds`, async () => {
    const f = fixture(development);
    assert.deepEqual(Object.keys(f.WIDGET_ENVIRONMENTS), development ? ['prod', 'demo', 'dev'] : ['prod', 'demo']);
    if (!development) {
      await assert.rejects(f.loadShowpassSdk('dev'), /unavailable in this build/);
      assert.equal(f.scripts.length, 0);
    }
  });
}
