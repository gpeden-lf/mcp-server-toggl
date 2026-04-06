import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const listProjectsTool: Tool = {
  name: "toggl_list_projects",
  description:
    "List all projects in a workspace. Auto-paginates through all results. Can filter by active status and client IDs.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "number",
        description: "The workspace ID",
      },
      active: {
        type: "boolean",
        description: "Filter by active status. Omit to get all projects.",
      },
      client_ids: {
        type: "array",
        items: { type: "number" },
        description: "Filter by client IDs",
      },
    },
    required: ["workspace_id"],
  },
};

export const getProjectTool: Tool = {
  name: "toggl_get_project",
  description: "Get details for a single project by its ID.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: {
        type: "number",
        description: "The workspace ID",
      },
      project_id: {
        type: "number",
        description: "The project ID",
      },
    },
    required: ["workspace_id", "project_id"],
  },
};

export const createProjectTool: Tool = {
  name: "toggl_create_project",
  description: "Create a new project in a workspace.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: { type: "number", description: "The workspace ID" },
      name: { type: "string", description: "Project name" },
      client_id: { type: "number", description: "Client ID to associate with the project" },
      active: { type: "boolean", description: "Whether the project is active (default: true)" },
      billable: { type: "boolean", description: "Whether the project is billable" },
      color: { type: "string", description: "Project color hex code (e.g. #e36a00)" },
      is_private: { type: "boolean", description: "Whether the project is private (default: true)" },
    },
    required: ["workspace_id", "name"],
  },
};

export const updateProjectTool: Tool = {
  name: "toggl_update_project",
  description: "Update an existing project in a workspace.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: { type: "number", description: "The workspace ID" },
      project_id: { type: "number", description: "The project ID to update" },
      name: { type: "string", description: "New project name" },
      client_id: { type: "number", description: "New client ID" },
      active: { type: "boolean", description: "Active status" },
      billable: { type: "boolean", description: "Billable status" },
      color: { type: "string", description: "Project color hex code" },
      is_private: { type: "boolean", description: "Private status" },
    },
    required: ["workspace_id", "project_id"],
  },
};

export const deleteProjectTool: Tool = {
  name: "toggl_delete_project",
  description: "Delete a project from a workspace.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: { type: "number", description: "The workspace ID" },
      project_id: { type: "number", description: "The project ID to delete" },
    },
    required: ["workspace_id", "project_id"],
  },
};
