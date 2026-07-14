import assert from "node:assert/strict";
import test from "node:test";

const SDK_URL = "https://www.showpass.com/static/dist/sdk.js";

class FakeScript {
  constructor() {
    this.async = false;
    this.attributes = new Map();
    this.crossOrigin = "";
    this.integrity = "";
    this.listeners = new Map();
    this.nonce = "";
    this.readyState = "";
    this.referrerPolicy = "";
    this.removed = false;
    this.src = "";
  }

  addEventListener(type, callback, options = {}) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push({ callback, once: Boolean(options.once) });
    this.listeners.set(type, listeners);
  }

  removeEventListener(type, callback) {
    const listeners = this.listeners.get(type) ?? [];
    this.listeners.set(
      type,
      listeners.filter((listener) => listener.callback !== callback),
    );
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  listenerCount(type) {
    return (this.listeners.get(type) ?? []).length;
  }

  remove() {
    this.removed = true;
  }

  dispatch(type) {
    const listeners = [...(this.listeners.get(type) ?? [])];
    for (const listener of listeners) {
      if (listener.once) this.removeEventListener(type, listener.callback);
      listener.callback({ target: this, type });
    }
  }
}

function installBrowser() {
  const hadWindow = Object.hasOwn(globalThis, "window");
  const hadDocument = Object.hasOwn(globalThis, "document");
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const scripts = [];
  const appended = [];
  const completedResources = new Set();

  const document = {
    createElement(name) {
      assert.equal(name, "script");
      return new FakeScript();
    },
    querySelector() {
      return (
        scripts.find((script) => !script.removed && script.src === SDK_URL) ??
        null
      );
    },
    head: {
      appendChild(script) {
        scripts.push(script);
        appended.push(script);
        return script;
      },
    },
  };

  const window = {
    clearTimeout: globalThis.clearTimeout.bind(globalThis),
    performance: {
      getEntriesByName(name, type) {
        if (type !== "resource" || !completedResources.has(name)) return [];
        return [{ entryType: "resource", name }];
      },
    },
    setTimeout: globalThis.setTimeout.bind(globalThis),
    showpass: undefined,
  };

  globalThis.window = window;
  globalThis.document = document;

  return {
    appended,
    document,
    markResourceComplete(script) {
      completedResources.add(script.src);
    },
    scripts,
    window,
    restore() {
      if (hadWindow) globalThis.window = previousWindow;
      else delete globalThis.window;
      if (hadDocument) globalThis.document = previousDocument;
      else delete globalThis.document;
    },
  };
}

async function importLoader(label) {
  const url = new URL("../assets/showpass-sdk.ts", import.meta.url);
  url.searchParams.set("test", label + "-" + Date.now() + "-" + Math.random());
  return import(url.href);
}

test("coalesces concurrent callers into one script request", async () => {
  const browser = installBrowser();

  try {
    const { loadShowpassSdk } = await importLoader("coalesce");
    const first = loadShowpassSdk();
    const second = loadShowpassSdk();

    assert.strictEqual(first, second);
    assert.equal(browser.appended.length, 1);

    const tickets = {};
    browser.window.showpass = { tickets };
    browser.appended[0].dispatch("load");

    assert.strictEqual(await first, tickets);
    assert.strictEqual(await second, tickets);
  } finally {
    browser.restore();
  }
});

test("reuses a canonical script that is already in flight", async () => {
  const browser = installBrowser();

  try {
    const existing = browser.document.createElement("script");
    existing.src = SDK_URL;
    browser.document.head.appendChild(existing);
    const { loadShowpassSdk } = await importLoader("reuse");

    const loading = loadShowpassSdk();
    assert.equal(browser.appended.length, 1);

    const tickets = {};
    browser.window.showpass = { tickets };
    existing.dispatch("load");

    assert.strictEqual(await loading, tickets);
  } finally {
    browser.restore();
  }
});

test("adopts a fetched script until its execution event arrives", async () => {
  const browser = installBrowser();

  try {
    const existing = browser.document.createElement("script");
    existing.src = SDK_URL;
    browser.document.head.appendChild(existing);
    browser.markResourceComplete(existing);
    const { loadShowpassSdk } = await importLoader("fetched-not-executed");

    const loading = loadShowpassSdk();
    assert.equal(browser.appended.length, 1);
    assert.equal(existing.removed, false);

    const tickets = {};
    browser.window.showpass = { tickets };
    existing.dispatch("load");

    assert.strictEqual(await loading, tickets);
  } finally {
    browser.restore();
  }
});

test("replaces a pre-existing script known to have completed", async () => {
  const browser = installBrowser();

  try {
    const existing = browser.document.createElement("script");
    existing.src = SDK_URL;
    existing.readyState = "complete";
    existing.crossOrigin = "anonymous";
    existing.integrity = "sha384-example";
    existing.nonce = "request-nonce";
    existing.referrerPolicy = "no-referrer";
    browser.document.head.appendChild(existing);
    const { loadShowpassSdk } = await importLoader("completed-external");

    const loading = loadShowpassSdk();
    assert.equal(browser.appended.length, 2);
    assert.equal(existing.removed, true);
    assert.equal(browser.appended[1].crossOrigin, "anonymous");
    assert.equal(browser.appended[1].integrity, "sha384-example");
    assert.equal(browser.appended[1].nonce, "request-nonce");
    assert.equal(browser.appended[1].referrerPolicy, "no-referrer");

    const tickets = {};
    browser.window.showpass = { tickets };
    browser.appended[1].dispatch("load");

    assert.strictEqual(await loading, tickets);
  } finally {
    browser.restore();
  }
});

test("replaces a definitively failed script on retry", async () => {
  const browser = installBrowser();

  try {
    const { loadShowpassSdk } = await importLoader("retry");
    const first = loadShowpassSdk();
    const failedScript = browser.appended[0];
    failedScript.dispatch("error");

    await assert.rejects(first, /Unable to load the Showpass SDK/);

    const second = loadShowpassSdk();
    assert.equal(browser.appended.length, 2);
    assert.equal(failedScript.removed, true);

    const tickets = {};
    browser.window.showpass = { tickets };
    browser.appended[1].dispatch("load");

    assert.strictEqual(await second, tickets);
  } finally {
    browser.restore();
  }
});

test("reuses a timed-out in-flight script until a late error", async () => {
  const browser = installBrowser();
  let timeoutCallback;

  browser.window.setTimeout = (callback) => {
    timeoutCallback = callback;
    return 1;
  };
  browser.window.clearTimeout = () => {};

  try {
    const { loadShowpassSdk } = await importLoader("timeout");
    const first = loadShowpassSdk();
    const script = browser.appended[0];
    assert.equal(script.listenerCount("load"), 1);

    timeoutCallback();
    await assert.rejects(first, /Timed out while loading the Showpass SDK/);
    assert.equal(script.listenerCount("load"), 1);
    assert.equal(script.listenerCount("error"), 1);
    assert.equal(script.getAttribute("data-showpass-sdk-loader"), "loading");

    const second = loadShowpassSdk();
    assert.equal(browser.appended.length, 1);
    assert.equal(script.listenerCount("load"), 1);

    script.dispatch("error");
    await assert.rejects(second, /Unable to load the Showpass SDK/);

    const third = loadShowpassSdk();
    assert.equal(browser.appended.length, 2);
    assert.equal(script.removed, true);

    const tickets = {};
    browser.window.showpass = { tickets };
    browser.appended[1].dispatch("load");

    assert.strictEqual(await third, tickets);
  } finally {
    browser.restore();
  }
});

test("replaces an adopted script after resource timing proves completion", async () => {
  const browser = installBrowser();
  let timeoutCallback;

  browser.window.setTimeout = (callback) => {
    timeoutCallback = callback;
    return 1;
  };
  browser.window.clearTimeout = () => {};

  try {
    const existing = browser.document.createElement("script");
    existing.src = SDK_URL;
    browser.document.head.appendChild(existing);
    const { loadShowpassSdk } = await importLoader("adopted-timeout");

    const first = loadShowpassSdk();
    assert.equal(browser.appended.length, 1);

    browser.markResourceComplete(existing);
    timeoutCallback();
    await assert.rejects(first, /Timed out while loading the Showpass SDK/);
    assert.equal(existing.getAttribute("data-showpass-sdk-loader"), "failed");

    const second = loadShowpassSdk();
    assert.equal(browser.appended.length, 2);
    assert.equal(existing.removed, true);

    const tickets = {};
    browser.window.showpass = { tickets };
    browser.appended[1].dispatch("load");

    assert.strictEqual(await second, tickets);
  } finally {
    browser.restore();
  }
});

test("keeps a slow adopted script observable after caller timeout", async () => {
  const browser = installBrowser();
  let timeoutCallback;

  browser.window.setTimeout = (callback) => {
    timeoutCallback = callback;
    return 1;
  };
  browser.window.clearTimeout = () => {};

  try {
    const existing = browser.document.createElement("script");
    existing.src = SDK_URL;
    browser.document.head.appendChild(existing);
    const { loadShowpassSdk } = await importLoader("slow-adopted");

    const first = loadShowpassSdk();
    timeoutCallback();
    await assert.rejects(first, /Timed out while loading the Showpass SDK/);
    assert.equal(existing.getAttribute("data-showpass-sdk-loader"), "loading");

    const second = loadShowpassSdk();
    assert.equal(browser.appended.length, 1);
    assert.equal(existing.removed, false);

    const tickets = {};
    browser.window.showpass = { tickets };
    existing.dispatch("load");

    assert.strictEqual(await second, tickets);
  } finally {
    browser.restore();
  }
});

test("uses a late successful global after caller timeout", async () => {
  const browser = installBrowser();
  let timeoutCallback;

  browser.window.setTimeout = (callback) => {
    timeoutCallback = callback;
    return 1;
  };
  browser.window.clearTimeout = () => {};

  try {
    const { loadShowpassSdk } = await importLoader("late-success");
    const first = loadShowpassSdk();
    const script = browser.appended[0];

    timeoutCallback();
    await assert.rejects(first, /Timed out while loading the Showpass SDK/);

    const tickets = {};
    browser.window.showpass = { tickets };
    script.dispatch("load");

    assert.strictEqual(await loadShowpassSdk(), tickets);
    assert.equal(browser.appended.length, 1);
  } finally {
    browser.restore();
  }
});

test("returns an existing SDK global without injecting a script", async () => {
  const browser = installBrowser();

  try {
    const tickets = {};
    browser.window.showpass = { tickets };
    const { loadShowpassSdk } = await importLoader("ready");

    assert.strictEqual(await loadShowpassSdk(), tickets);
    assert.equal(browser.appended.length, 0);
  } finally {
    browser.restore();
  }
});
