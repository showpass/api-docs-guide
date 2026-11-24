import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

const methods = new Set(["get", "put", "post", "delete", "options", "head", "patch", "trace"]);
const catalogPath = "src/docs-app/data/api-reference-catalog.json";

export function readReferenceArtifacts(root = process.cwd()) {
  const catalog = JSON.parse(readFileSync(path.resolve(root, catalogPath), "utf8"));
  return catalog.map((profile) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(profile.slug) ||
        !/^\/openapi\/[a-z0-9.-]+\.json$/.test(profile.schemaPath) ||
        !/^[a-f0-9]{40}$/.test(profile.sourceRevision) ||
        (profile.sourceDiffSha256 && !/^[a-f0-9]{64}$/.test(profile.sourceDiffSha256))) {
      throw new Error(`Invalid API reference metadata for ${profile.slug}`);
    }

    const bytes = readFileSync(path.resolve(root, "public", profile.schemaPath.slice(1)));
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    if (sha256 !== profile.sha256) {
      throw new Error(`OpenAPI checksum mismatch for ${profile.schemaPath}`);
    }

    const spec = JSON.parse(bytes.toString("utf8"));
    if (!spec.openapi?.startsWith("3.1.") || spec.info?.version !== profile.contractVersion || !spec.paths) {
      throw new Error(`OpenAPI version or contract mismatch for ${profile.schemaPath}`);
    }

    const route = `/api/${profile.slug}`;
    const operations = Object.entries(spec.paths).flatMap(([apiPath, item]) =>
      Object.entries(item)
        .filter(([method]) => methods.has(method))
        .map(([method, operation]) => ({ ...operation, method, apiPath })),
    );
    const ids = new Set();
    for (const { operationId, summary } of operations) {
      if (typeof operationId !== "string" || !/^[A-Za-z][\w.-]*$/.test(operationId) || ids.has(operationId) || !summary) {
        throw new Error(`Missing or duplicate OpenAPI operation ID or summary in ${profile.schemaPath}`);
      }
      ids.add(operationId);
    }

    return { profile, route, operations, description: profile.description ?? spec.info.description ?? "" };
  });
}
