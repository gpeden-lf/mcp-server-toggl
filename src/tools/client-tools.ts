import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const listClientsTool: Tool = {
  name: "toggl_list_clients",
  description: "List all clients in a workspace.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "number",
        description: "The workspace ID",
      },
    },
    required: ["workspace_id"],
  },
};

export const createClientTool: Tool = {
  name: "toggl_create_client",
  description: "Create a new client in a workspace.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: { type: "number", description: "The workspace ID" },
      name: { type: "string", description: "Client name" },
      notes: { type: "string", description: "Optional notes about the client" },
    },
    required: ["workspace_id", "name"],
  },
};

export const updateClientTool: Tool = {
  name: "toggl_update_client",
  description: "Update an existing client in a workspace.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: { type: "number", description: "The workspace ID" },
      client_id: { type: "number", description: "The client ID to update" },
      name: { type: "string", description: "New client name" },
      notes: { type: "string", description: "Updated notes" },
    },
    required: ["workspace_id", "client_id"],
  },
};

export const deleteClientTool: Tool = {
  name: "toggl_delete_client",
  description: "Delete a client from a workspace.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: { type: "number", description: "The workspace ID" },
      client_id: { type: "number", description: "The client ID to delete" },
    },
    required: ["workspace_id", "client_id"],
  },
};
