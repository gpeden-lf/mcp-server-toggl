# mcp-server-toggl

An MCP server for [Toggl Track](https://toggl.com/track/) that provides team-wide time tracking, reporting, and full workspace management through the Model Context Protocol.

Built on Toggl's v9 API and Reports API v3, this server lets AI assistants query time entries, generate summary reports, manage project membership, and do full CRUD on clients, projects, and tasks.

## Setup

### 1. Get a Toggl API Token

1. Log in to [Toggl Track](https://track.toggl.com/)
2. Go to your [Profile Settings](https://track.toggl.com/profile)
3. Scroll to the bottom and copy your API Token

### 2. Configure Claude Desktop

Add this to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "toggl": {
      "command": "npx",
      "args": ["-y", "mcp-server-toggl"],
      "env": {
        "TOGGL_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

### 3. Configure GitHub Copilot

Edit `~/.copilot/mcp-config.json`:

```json
{
  "mcpServers": {
    "toggl": {
      "command": "node",
      "args": ["/path/to/mcp-server-toggl/dist/index.js"],
      "env": {
        "TOGGL_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

Restart Copilot after saving.

### 4. Build from Source (optional)

```bash
git clone https://github.com/gpeden-lf/mcp-server-toggl.git
cd mcp-server-toggl
npm install
npm run build
```

Then point your MCP client at the built server:

```json
{
  "mcpServers": {
    "toggl": {
      "command": "node",
      "args": ["/path/to/mcp-server-toggl/dist/index.js"],
      "env": {
        "TOGGL_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

## Tools

### Workspace & Organization

| Tool | Description |
|------|-------------|
| `toggl_list_workspaces` | List all accessible workspaces |
| `toggl_list_users` | List team members with IDs, names, and emails (requires admin) |
| `toggl_list_clients` | List all clients in a workspace |
| `toggl_create_client` | Create a new client |
| `toggl_update_client` | Update an existing client |
| `toggl_delete_client` | Delete a client |
| `toggl_list_projects` | List projects (auto-paginated, filterable by active status and client) |
| `toggl_get_project` | Get details for a single project |
| `toggl_create_project` | Create a new project |
| `toggl_update_project` | Update an existing project |
| `toggl_delete_project` | Delete a project |
| `toggl_list_tasks` | List tasks within a project |
| `toggl_create_task` | Create a new task within a project |
| `toggl_update_task` | Update an existing task |
| `toggl_delete_task` | Delete a task |

### Project Membership

| Tool | Description |
|------|-------------|
| `toggl_list_project_users` | List all users assigned to a project |
| `toggl_add_user_to_project` | Add a user to a project |
| `toggl_remove_user_from_project` | Remove a user from a project |
| `toggl_add_user_to_client_projects` | Add a user to all active projects under a client (bulk onboard) |
| `toggl_remove_user_from_client_projects` | Remove a user from all projects under a client (bulk offboard) |

### Reporting

| Tool | Description |
|------|-------------|
| `toggl_search_time_entries` | Search time entries across all team members. Supports filtering by project, client, user, task, and description. Auto-paginates and enriches results with names. |
| `toggl_get_summary_report` | Get aggregated time totals grouped by users, projects, or clients. Supports sub-grouping for breakdowns like "each user's time by project." |

## Example Prompts

- "Add [name] to all [Client] projects in Toggl"
- "Remove [name] from all [Client] projects in Toggl"
- "How many hours did each team member log last week?"
- "Show me all time entries for the Marketing project this month"
- "What's the PTO breakdown by person for Q1?"
- "List all active projects in workspace 12345"
- "How much time was logged against Client X in January?"

## Requirements

- Node.js 18+
- A Toggl Track account with an API token
- Admin access required for user and project membership tools

## License

MIT

