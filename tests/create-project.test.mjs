import assert from "node:assert/strict";
import { test } from "node:test";
import { build } from "esbuild";

async function loadSource(path) {
  const result = await build({
    entryPoints: [new URL(path, import.meta.url).pathname],
    bundle: true,
    platform: "node",
    format: "esm",
    write: false,
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`
  );
}

const { TogglClient } = await loadSource("../src/toggl-client.ts");
const { tool_handler, list_of_tools } = await loadSource("../src/tool-handler.ts");

test("template_id is optional in the create-project tool schema", () => {
  const tool = list_of_tools.find((tool) => tool.name === "toggl_create_project");
  assert.deepEqual(tool.inputSchema.required, ["workspace_id", "name"]);
  assert.equal(tool.inputSchema.properties.template_id.type, "integer");
  assert.equal(tool.inputSchema.properties.template_id.minimum, 1);
});

for (const template_id of [undefined, 11111]) {
  test(`create-project forwards the correct API body with template_id=${template_id}`, async (t) => {
    const body = {
      name: "Systems & Tools",
      client_id: 67890,
      active: true,
      billable: false,
      color: "#e36a00",
      is_private: true,
      ...(template_id === undefined ? {} : { template_id }),
    };
    const requests = [];
    const response = { id: 22222, ...body };
    t.mock.method(globalThis, "fetch", async (url, options) => {
      requests.push({ url, options });
      return new Response(JSON.stringify(response), { status: 200 });
    });
    const handler = tool_handler(new TogglClient("test-token-not-a-credential"));
    const result = await handler({
      method: "tools/call",
      params: {
        name: "toggl_create_project",
        arguments: { workspace_id: 12345, ...body },
      },
    });

    assert.equal(requests.length, 1);
    assert.equal(requests[0].url, "https://api.track.toggl.com/api/v9/workspaces/12345/projects");
    assert.equal(requests[0].options.method, "POST");
    assert.deepEqual(JSON.parse(requests[0].options.body), body);
    assert.deepEqual(JSON.parse(result.content[0].text), response);
  });
}

test("minimal ordinary project creation does not add optional fields", async (t) => {
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    assert.deepEqual(JSON.parse(options.body), { name: "New project" });
    return new Response(JSON.stringify({ id: 22222, name: "New project" }), { status: 200 });
  });
  const result = await tool_handler(new TogglClient("test-token-not-a-credential"))({
    method: "tools/call",
    params: {
      name: "toggl_create_project",
      arguments: { workspace_id: 12345, name: "New project" },
    },
  });
  assert.equal(result.isError, undefined);
  assert.equal(JSON.parse(result.content[0].text).id, 22222);
});
