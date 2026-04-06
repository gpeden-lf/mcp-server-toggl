import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const listProjectUsersTool: Tool = {
  name: "toggl_list_project_users",
  description: "List all users assigned to a specific project.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: { type: "number", description: "The workspace ID" },
      project_id: { type: "number", description: "The project ID" },
    },
    required: ["workspace_id", "project_id"],
  },
};

export const addUserToProjectTool: Tool = {
  name: "toggl_add_user_to_project",
  description: "Add a user to a specific project.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: { type: "number", description: "The workspace ID" },
      project_id: { type: "number", description: "The project ID" },
      user_id: { type: "number", description: "The user ID to add" },
      manager: { type: "boolean", description: "Whether to add as project manager (default: false)" },
    },
    required: ["workspace_id", "project_id", "user_id"],
  },
};

export const removeUserFromProjectTool: Tool = {
  name: "toggl_remove_user_from_project",
  description: "Remove a user from a specific project.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: { type: "number", description: "The workspace ID" },
      project_id: { type: "number", description: "The project ID" },
      project_user_id: { type: "number", description: "The project_user record ID (from toggl_list_project_users)" },
    },
    required: ["workspace_id", "project_id", "project_user_id"],
  },
};

export const addUserToClientProjectsTool: Tool = {
  name: "toggl_add_user_to_client_projects",
  description: "Add a user to all active projects under a specific client. Use for onboarding a new PM to a client engagement.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: { type: "number", description: "The workspace ID" },
      client_id: { type: "number", description: "The client ID" },
      user_id: { type: "number", description: "The user ID to add" },
      manager: { type: "boolean", description: "Whether to add as project manager (default: false)" },
    },
    required: ["workspace_id", "client_id", "user_id"],
  },
};

export const removeUserFromClientProjectsTool: Tool = {
  name: "toggl_remove_user_from_client_projects",
  description: "Remove a user from all projects under a specific client. Use for offboarding a PM from a client engagement.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: { type: "number", description: "The workspace ID" },
      client_id: { type: "number", description: "The client ID" },
      user_id: { type: "number", description: "The user ID to remove" },
    },
    required: ["workspace_id", "client_id", "user_id"],
  },
};
