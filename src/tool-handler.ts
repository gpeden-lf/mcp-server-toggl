import {
  Tool,
  CallToolRequest,
  CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";
import { TogglClient } from "./toggl-client.js";

import { listWorkspacesTool } from "./tools/workspace-tools.js";
import {
  listProjectsTool,
  getProjectTool,
  createProjectTool,
  updateProjectTool,
  deleteProjectTool,
} from "./tools/project-tools.js";
import {
  listClientsTool,
  createClientTool,
  updateClientTool,
  deleteClientTool,
} from "./tools/client-tools.js";
import { listUsersTool } from "./tools/user-tools.js";
import {
  listTasksTool,
  createTaskTool,
  updateTaskTool,
  deleteTaskTool,
} from "./tools/task-tools.js";
import {
  searchTimeEntriesTool,
  getSummaryReportTool,
} from "./tools/report-tools.js";
import {
  listProjectUsersTool,
  addUserToProjectTool,
  removeUserFromProjectTool,
  addUserToClientProjectsTool,
  removeUserFromClientProjectsTool,
} from "./tools/project-user-tools.js";

export const list_of_tools: Tool[] = [
  listWorkspacesTool,
  // Projects
  listProjectsTool,
  getProjectTool,
  createProjectTool,
  updateProjectTool,
  deleteProjectTool,
  // Clients
  listClientsTool,
  createClientTool,
  updateClientTool,
  deleteClientTool,
  // Users
  listUsersTool,
  // Tasks
  listTasksTool,
  createTaskTool,
  updateTaskTool,
  deleteTaskTool,
  // Project membership
  listProjectUsersTool,
  addUserToProjectTool,
  removeUserFromProjectTool,
  addUserToClientProjectsTool,
  removeUserFromClientProjectsTool,
  // Reports
  searchTimeEntriesTool,
  getSummaryReportTool,
];

export function tool_handler(
  toggl: TogglClient
): (request: CallToolRequest) => Promise<CallToolResult> {
  return async (request: CallToolRequest) => {
    console.error("Received CallToolRequest:", request.params.name);
    try {
      const args = (request.params.arguments ?? {}) as any;

      switch (request.params.name) {
        case "toggl_list_workspaces": {
          const result = await toggl.listWorkspaces();
          return {
            content: [{ type: "text", text: JSON.stringify(result) }],
          };
        }

        case "toggl_list_projects": {
          const { workspace_id, active, client_ids } = args;
          const result = await toggl.listProjects(workspace_id, {
            active,
            client_ids,
          });
          return {
            content: [{ type: "text", text: JSON.stringify(result) }],
          };
        }

        case "toggl_get_project": {
          const { workspace_id, project_id } = args;
          const result = await toggl.getProject(workspace_id, project_id);
          return {
            content: [{ type: "text", text: JSON.stringify(result) }],
          };
        }

        case "toggl_list_clients": {
          const { workspace_id } = args;
          const result = await toggl.listClients(workspace_id);
          return {
            content: [{ type: "text", text: JSON.stringify(result) }],
          };
        }

        case "toggl_list_users": {
          const { workspace_id } = args;
          const result = await toggl.listUsers(workspace_id);
          return {
            content: [{ type: "text", text: JSON.stringify(result) }],
          };
        }

        case "toggl_list_tasks": {
          const { workspace_id, project_id } = args;
          const result = await toggl.listTasks(workspace_id, project_id);
          return {
            content: [{ type: "text", text: JSON.stringify(result) }],
          };
        }

        case "toggl_search_time_entries": {
          const {
            workspace_id,
            start_date,
            end_date,
            project_ids,
            client_ids,
            user_ids,
            task_ids,
            description,
          } = args;

          const body: Record<string, any> = {
            start_date,
            end_date,
          };
          if (project_ids) body.project_ids = project_ids;
          if (client_ids) body.client_ids = client_ids;
          if (user_ids) body.user_ids = user_ids;
          if (task_ids) body.task_ids = task_ids;
          if (description) body.description = description;

          const result = await toggl.searchTimeEntries(
            workspace_id,
            body
          );
          return {
            content: [{ type: "text", text: JSON.stringify(result) }],
          };
        }

        case "toggl_get_summary_report": {
          const {
            workspace_id,
            start_date,
            end_date,
            grouping,
            sub_grouping,
            project_ids,
            client_ids,
            user_ids,
            task_ids,
          } = args;

          const body: Record<string, any> = {
            start_date,
            end_date,
          };
          if (grouping) body.grouping = grouping;
          if (sub_grouping) body.sub_grouping = sub_grouping;
          if (project_ids) body.project_ids = project_ids;
          if (client_ids) body.client_ids = client_ids;
          if (user_ids) body.user_ids = user_ids;
          if (task_ids) body.task_ids = task_ids;

          const result = await toggl.getSummaryReport(
            workspace_id,
            body
          );
          return {
            content: [{ type: "text", text: JSON.stringify(result) }],
          };
        }

        case "toggl_create_client": {
          const { workspace_id, name, notes } = args;
          const body: any = { name };
          if (notes !== undefined) body.notes = notes;
          const result = await toggl.createClient(workspace_id, body);
          return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }

        case "toggl_update_client": {
          const { workspace_id, client_id, ...fields } = args;
          const result = await toggl.updateClient(workspace_id, client_id, fields);
          return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }

        case "toggl_delete_client": {
          const { workspace_id, client_id } = args;
          await toggl.deleteClient(workspace_id, client_id);
          return { content: [{ type: "text", text: JSON.stringify({ deleted: true, client_id }) }] };
        }

        case "toggl_create_project": {
          const { workspace_id, name, client_id, active, billable, color, is_private } = args;
          const body: any = { name };
          if (client_id !== undefined) body.client_id = client_id;
          if (active !== undefined) body.active = active;
          if (billable !== undefined) body.billable = billable;
          if (color !== undefined) body.color = color;
          if (is_private !== undefined) body.is_private = is_private;
          const result = await toggl.createProject(workspace_id, body);
          return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }

        case "toggl_update_project": {
          const { workspace_id, project_id, ...fields } = args;
          const result = await toggl.updateProject(workspace_id, project_id, fields);
          return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }

        case "toggl_delete_project": {
          const { workspace_id, project_id } = args;
          await toggl.deleteProject(workspace_id, project_id);
          return { content: [{ type: "text", text: JSON.stringify({ deleted: true, project_id }) }] };
        }

        case "toggl_create_task": {
          const { workspace_id, project_id, name, active, estimated_seconds, user_id } = args;
          const body: any = { name };
          if (active !== undefined) body.active = active;
          if (estimated_seconds !== undefined) body.estimated_seconds = estimated_seconds;
          if (user_id !== undefined) body.user_id = user_id;
          const result = await toggl.createTask(workspace_id, project_id, body);
          return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }

        case "toggl_update_task": {
          const { workspace_id, project_id, task_id, ...fields } = args;
          const result = await toggl.updateTask(workspace_id, project_id, task_id, fields);
          return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }

        case "toggl_delete_task": {
          const { workspace_id, project_id, task_id } = args;
          await toggl.deleteTask(workspace_id, project_id, task_id);
          return { content: [{ type: "text", text: JSON.stringify({ deleted: true, task_id }) }] };
        }

        case "toggl_list_project_users": {
          const { workspace_id, project_id } = args;
          const result = await toggl.listProjectUsers(workspace_id, project_id);
          return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }

        case "toggl_add_user_to_project": {
          const { workspace_id, project_id, user_id, manager } = args;
          const result = await toggl.addProjectUser(workspace_id, project_id, user_id, manager ?? false);
          return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }

        case "toggl_remove_user_from_project": {
          const { workspace_id, project_user_id } = args;
          await toggl.removeProjectUser(workspace_id, project_user_id);
          return { content: [{ type: "text", text: JSON.stringify({ deleted: true, project_user_id }) }] };
        }

        case "toggl_add_user_to_client_projects": {
          const { workspace_id, client_id, user_id, manager } = args;
          const result = await toggl.addUserToClientProjects(workspace_id, client_id, user_id, manager ?? false);
          return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }

        case "toggl_remove_user_from_client_projects": {
          const { workspace_id, client_id, user_id } = args;
          const result = await toggl.removeUserFromClientProjects(workspace_id, client_id, user_id);
          return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }

        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    } catch (error) {
      console.error("Error executing tool:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
            }),
          },
        ],
      };
    }
  };
}
