import assert from "node:assert/strict";
import {
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const auditorPath = fileURLToPath(
  new URL("./audit-widget-integration.mjs", import.meta.url),
);

function runAudit(lines, expectedStatus = 0) {
  const directory = mkdtempSync(join(tmpdir(), "showpass-audit-"));
  const target = join(directory, "integration.tsx");
  writeFileSync(target, lines.join("\n"));

  try {
    const result = spawnSync(process.execPath, [auditorPath, "--json", target], {
      encoding: "utf8",
    });

    assert.equal(
      result.status,
      expectedStatus,
      result.stderr || result.stdout,
    );
    return JSON.parse(result.stdout);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function cleanupFindings(report) {
  return report.findings.filter(
    (finding) => finding.rule === "cart-listener-cleanup",
  );
}

test("accepts a captured cart-listener cleanup invoked during teardown", () => {
  const report = runAudit([
    "function subscribe(tickets) {",
    "  let removeListener;",
    "  removeListener = tickets.addCartCountListener(setCount);",
    "  return () => {",
    "    removeListener?.();",
    "  };",
    "}",
  ]);

  assert.deepEqual(cleanupFindings(report), []);
});

test("accepts a cart-listener cleanup returned directly", () => {
  const report = runAudit([
    "function subscribe(tickets) {",
    "  return tickets.addCartCountListener(setCount);",
    "}",
  ]);

  assert.deepEqual(cleanupFindings(report), []);
});

test("accepts cleanup ownership returned through async helpers", () => {
  const report = runAudit([
    "async function subscribe() {",
    "  const tickets = await loadShowpassSdk();",
    "  return tickets.addCartCountListener(setCount);",
    "}",
    "const subscribeArrow = async () => {",
    "  const tickets = await loadShowpassSdk();",
    "  return tickets.addCartCountListener(setCount);",
    "};",
  ]);

  assert.deepEqual(cleanupFindings(report), []);
});

test("accepts captured cleanup returned through async helpers", () => {
  const report = runAudit([
    "async function subscribeDirectly(tickets) {",
    "  const unsubscribe = tickets.addCartCountListener(setCount);",
    "  return unsubscribe;",
    "}",
    "const subscribeAfterLoad = async () => {",
    "  const tickets = await loadShowpassSdk();",
    "  const unsubscribe = tickets.addCartCountListener(setCount);",
    "  return () => unsubscribe();",
    "};",
  ]);

  assert.deepEqual(cleanupFindings(report), []);
});

test("reports a discarded cart-listener cleanup", () => {
  const report = runAudit([
    "function subscribe(tickets) {",
    "  tickets.addCartCountListener(setCount);",
    "}",
  ]);

  assert.equal(cleanupFindings(report).length, 1);
  assert.equal(cleanupFindings(report)[0].severity, "warning");
});

test("reports discarded cleanup from expression receivers", () => {
  const report = runAudit([
    "async function subscribe() {",
    "  (await loadShowpassSdk()).addCartCountListener(setCount);",
    "  getTickets().addCartCountListener(setOtherCount);",
    "}",
  ]);

  assert.equal(cleanupFindings(report).length, 2);
});

test("accepts owned cleanup from expression receivers", () => {
  const report = runAudit([
    "async function subscribe() {",
    "  return (await loadShowpassSdk()).addCartCountListener(setCount);",
    "}",
    "function subscribeFromGetter() {",
    "  const unsubscribe = getTickets().addCartCountListener(setCount);",
    "  return () => unsubscribe();",
    "}",
  ]);

  assert.deepEqual(cleanupFindings(report), []);
});

test("reports a cleanup that is captured but never used", () => {
  const report = runAudit([
    "function subscribe(tickets) {",
    "  const removeListener = tickets.addCartCountListener(setCount);",
    "  console.info(removeListener);",
    "}",
  ]);

  assert.equal(cleanupFindings(report).length, 1);
});

test("reports cleanup returned from a nested promise callback", () => {
  const report = runAudit([
    "function subscribe() {",
    "  loadShowpassSdk().then((tickets) =>",
    "    tickets.addCartCountListener(setCount),",
    "  );",
    "}",
  ]);

  assert.equal(cleanupFindings(report).length, 1);
});

test("reports an explicit cleanup return inside a promise callback", () => {
  const report = runAudit([
    "function subscribe() {",
    "  loadShowpassSdk().then((tickets) => {",
    "    return tickets.addCartCountListener(setCount);",
    "  });",
    "}",
  ]);

  assert.equal(cleanupFindings(report).length, 1);
});

test("reports a cleanup returned from an assigned promise callback", () => {
  const report = runAudit([
    "function subscribe() {",
    "  const task = loadShowpassSdk().then((tickets) =>",
    "    tickets.addCartCountListener(setCount),",
    "  );",
    "  return task;",
    "}",
  ]);

  assert.equal(cleanupFindings(report).length, 1);
});

test("rejects a captured cleanup returned only from a promise callback", () => {
  const report = runAudit([
    "function subscribe(tickets) {",
    "  const unsubscribe = tickets.addCartCountListener(setCount);",
    "  Promise.resolve().then(() => {",
    "    return unsubscribe;",
    "  });",
    "}",
  ]);

  assert.equal(cleanupFindings(report).length, 1);
});

test("accepts concise and explicit React effect cleanups", () => {
  const report = runAudit([
    "function Concise({ tickets }) {",
    "  useEffect(() => tickets.addCartCountListener(setCount), [tickets]);",
    "}",
    "function Explicit({ tickets }) {",
    "  useEffect(() => {",
    "    return tickets.addCartCountListener(setCount);",
    "  }, [tickets]);",
    "}",
    "function FunctionStyle({ tickets }) {",
    "  useEffect(function subscribe() {",
    "    return tickets.addCartCountListener(setCount);",
    "  }, [tickets]);",
    "}",
  ]);

  assert.deepEqual(cleanupFindings(report), []);
});

test("rejects cleanup returned from an async React effect", () => {
  const report = runAudit([
    "function Cart({ setCount }) {",
    "  useEffect(async () => {",
    "    let unsubscribe;",
    "    const tickets = await loadShowpassSdk();",
    "    unsubscribe = tickets.addCartCountListener(setCount);",
    "    return () => unsubscribe?.();",
    "  }, []);",
    "}",
  ]);

  assert.equal(cleanupFindings(report).length, 1);
});

test("reports async listener installation without an unmount guard", () => {
  const report = runAudit([
    "function Cart({ setCount }) {",
    "  useEffect(() => {",
    "    let unsubscribe;",
    "    loadShowpassSdk().then((tickets) => {",
    "      unsubscribe = tickets.addCartCountListener(setCount);",
    "    });",
    "    return () => unsubscribe?.();",
    "  }, []);",
    "}",
  ]);

  const findings = cleanupFindings(report);
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /teardown flag/);
});

test("accepts guarded async listener installation", () => {
  const report = runAudit([
    "function Cart({ setCount }) {",
    "  useEffect(() => {",
    "    let disposed = false;",
    "    let unsubscribe;",
    "    loadShowpassSdk().then((tickets) => {",
    "      if (disposed) return;",
    "      unsubscribe = tickets.addCartCountListener(setCount);",
    "    });",
    "    return () => {",
    "      disposed = true;",
    "      unsubscribe?.();",
    "    };",
    "  }, []);",
    "}",
  ]);

  assert.deepEqual(cleanupFindings(report), []);
});

test("requires the async guard after the last await", () => {
  const report = runAudit([
    "function Cart({ setCount }) {",
    "  useEffect(() => {",
    "    let disposed = false;",
    "    let unsubscribe;",
    "    async function connect() {",
    "      if (disposed) return;",
    "      const tickets = await loadShowpassSdk();",
    "      unsubscribe = tickets.addCartCountListener(setCount);",
    "    }",
    "    void connect();",
    "    return () => {",
    "      disposed = true;",
    "      unsubscribe?.();",
    "    };",
    "  }, []);",
    "}",
  ]);

  const findings = cleanupFindings(report);
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /teardown flag/);
});

test("accepts an async guard after the last await", () => {
  const report = runAudit([
    "function Cart({ setCount }) {",
    "  useEffect(() => {",
    "    let disposed = false;",
    "    let unsubscribe;",
    "    async function connect() {",
    "      const tickets = await loadShowpassSdk();",
    "      if (disposed) return;",
    "      unsubscribe = tickets.addCartCountListener(setCount);",
    "    }",
    "    void connect();",
    "    return () => {",
    "      disposed = true;",
    "      unsubscribe?.();",
    "    };",
    "  }, []);",
    "}",
  ]);

  assert.deepEqual(cleanupFindings(report), []);
});

test("accepts guarded semicolonless async installation", () => {
  const report = runAudit([
    "function Cart({ setCount }) {",
    "  useEffect(() => {",
    "    let disposed = false",
    "    let unsubscribe",
    "    async function connect() {",
    "      const tickets = await loadShowpassSdk()",
    "      if (disposed) return",
    "      unsubscribe = tickets.addCartCountListener(setCount)",
    "    }",
    "    void connect()",
    "    return () => {",
    "      disposed = true",
    "      unsubscribe?.()",
    "    }",
    "  }, [])",
    "}",
  ]);

  assert.deepEqual(cleanupFindings(report), []);
});

test("requires the async flag update to belong to teardown", () => {
  const report = runAudit([
    "function Cart({ setCount }) {",
    "  useEffect(() => {",
    "    let loading = true;",
    "    let unsubscribe;",
    "    async function connect() {",
    "      const tickets = await loadShowpassSdk();",
    "      if (!loading) return;",
    "      unsubscribe = tickets.addCartCountListener(setCount);",
    "      loading = false;",
    "    }",
    "    void connect();",
    "    return () => unsubscribe?.();",
    "  }, []);",
    "}",
  ]);

  const findings = cleanupFindings(report);
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /teardown flag/);
});

test("accepts a typed cleanup binding returned from its owner", () => {
  const report = runAudit([
    "function subscribe(tickets) {",
    "  const unsubscribe: () => void =",
    "    tickets.addCartCountListener(setCount);",
    "  return () => unsubscribe();",
    "}",
  ]);

  assert.deepEqual(cleanupFindings(report), []);
});

test("does not treat setup-time unsubscribe as effect teardown", () => {
  const report = runAudit([
    "function Cart({ tickets, setCount }) {",
    "  useEffect(() => {",
    "    const unsubscribe = tickets.addCartCountListener(setCount);",
    "    unsubscribe();",
    "  }, [tickets]);",
    "}",
  ]);

  assert.equal(cleanupFindings(report).length, 1);
});

test("accepts cleanup stored across class mount and unmount", () => {
  const report = runAudit([
    "class CartWidget {",
    "  mount(tickets) {",
    "    this.unsubscribe = tickets.addCartCountListener(setCount);",
    "  }",
    "  unmount() {",
    "    this.unsubscribe?.();",
    "  }",
    "}",
  ]);

  assert.deepEqual(cleanupFindings(report), []);
});

test("accepts cleanup nested in returned teardown control flow", () => {
  const report = runAudit([
    "function subscribeConditionally(tickets) {",
    "  const unsubscribe = tickets.addCartCountListener(setCount);",
    "  return () => {",
    "    if (active) {",
    "      unsubscribe();",
    "    }",
    "  };",
    "}",
    "function subscribeWithFinally(tickets) {",
    "  const unsubscribe = tickets.addCartCountListener(setCount);",
    "  return () => {",
    "    try {",
    "      stopOtherWork();",
    "    } finally {",
    "      unsubscribe();",
    "    }",
    "  };",
    "}",
  ]);

  assert.deepEqual(cleanupFindings(report), []);
});

test("accepts cleanup from Angular ngOnDestroy", () => {
  const report = runAudit([
    "class CartComponent {",
    "  initialize(tickets) {",
    "    this.unsubscribe = tickets.addCartCountListener(setCount);",
    "  }",
    "  ngOnDestroy() {",
    "    if (this.unsubscribe) {",
    "      this.unsubscribe();",
    "    }",
    "  }",
    "}",
  ]);

  assert.deepEqual(cleanupFindings(report), []);
});

test("does not confuse same-named cleanups in sibling functions", () => {
  const report = runAudit([
    "function leaking(tickets) {",
    "  const unsubscribe = tickets.addCartCountListener(setCount);",
    "}",
    "function cleanedUp(tickets) {",
    "  const unsubscribe = tickets.addCartCountListener(setCount);",
    "  return () => unsubscribe();",
    "}",
  ]);

  const findings = cleanupFindings(report);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].line, 2);
});

test("reports a captured cleanup overwritten before teardown", () => {
  const report = runAudit([
    "function subscribe(tickets) {",
    "  let unsubscribe = tickets.addCartCountListener(setCount);",
    "  unsubscribe = () => {};",
    "  return () => unsubscribe();",
    "}",
  ]);

  assert.equal(cleanupFindings(report).length, 1);
});

test("does not mistake a shadowing teardown parameter for cleanup", () => {
  const report = runAudit([
    "function subscribe(tickets) {",
    "  const unsubscribe = tickets.addCartCountListener(setCount);",
    "  return function teardown(unsubscribe) {",
    "    unsubscribe();",
    "  };",
    "}",
  ]);

  assert.equal(cleanupFindings(report).length, 1);
});

test("ignores reassignments of a shadowing local cleanup", () => {
  const report = runAudit([
    "function subscribe(tickets) {",
    "  const unsubscribe = tickets.addCartCountListener(setCount);",
    "  {",
    "    let unsubscribe = () => {};",
    "    unsubscribe = makeOtherCleanup();",
    "    unsubscribe();",
    "  }",
    "  return () => unsubscribe();",
    "}",
  ]);

  assert.deepEqual(cleanupFindings(report), []);
});

test("retains required-params checks for current widget methods", () => {
  const report = runAudit(
    [
      "async function mount() {",
      "  const tickets = await loadShowpassSdk();",
      '  await tickets.calendarWidget("venue");',
      "  await tickets.checkoutWidget();",
      "}",
    ],
    1,
  );
  const rules = report.findings.map((finding) => finding.rule);

  assert.ok(rules.includes("missing-widget-params"));
  assert.ok(rules.includes("missing-checkout-params"));
});
