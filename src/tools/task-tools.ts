import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const listTasksTool: Tool = {
  name: "toggl_list_tasks",
  description:
    "List all tasks within a specific project. Tasks are sub-categories of a project (e.g., PTO project might have tasks: Vacation, Sick, Holiday).",
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

export const createTaskTool: Tool = {
  name: "toggl_create_task",
  description: "Create a new task within a project.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: { type: "number", description: "The workspace ID" },
      project_id: { type: "number", description: "The project ID" },
      name: { type: "string", description: "Task name" },
      active: { type: "boolean", description: "Whether the task is active (default: true)" },
      estimated_seconds: { type: "number", description: "Estimated time in seconds" },
      user_id: { type: "number", description: "Assign task to a specific user ID" },
    },
    required: ["workspace_id", "project_id", "name"],
  },
};

export const updateTaskTool: Tool = {
  name: "toggl_update_task",
  description: "Update an existing task within a project.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: { type: "number", description: "The workspace ID" },
      project_id: { type: "number", description: "The project ID" },
      task_id: { type: "number", description: "The task ID to update" },
      name: { type: "string", description: "New task name" },
      active: { type: "boolean", description: "Active status" },
      estimated_seconds: { type: "number", description: "Estimated time in seconds" },
      user_id: { type: "number", description: "Reassign to a specific user ID" },
    },
    required: ["workspace_id", "project_id", "task_id"],
  },
};

export const deleteTaskTool: Tool = {
  name: "toggl_delete_task",
  description: "Delete a task from a project.",
  inputSchema: {
    type: "object",
    properties: {
      workspace_id: { type: "number", description: "The workspace ID" },
      project_id: { type: "number", description: "The project ID" },
      task_id: { type: "number", description: "The task ID to delete" },
    },
    required: ["workspace_id", "project_id", "task_id"],
  },
};
