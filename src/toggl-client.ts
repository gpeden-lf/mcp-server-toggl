const TOGGL_API_BASE = "https://api.track.toggl.com/api/v9";
const TOGGL_REPORTS_BASE = "https://api.track.toggl.com/reports/api/v3";

export class TogglClient {
  private authHeader: string;

  constructor(apiToken: string) {
    this.authHeader =
      "Basic " + Buffer.from(`${apiToken}:api_token`).toString("base64");
  }

  private async request(
    url: string,
    options: RequestInit = {}
  ): Promise<any> {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Toggl API error ${response.status}: ${body}`
      );
    }

    if (response.status === 204) return null;
    return response.json();
  }

  /** GET helper for the main Toggl API v9 */
  async get(path: string, params?: Record<string, string>): Promise<any> {
    let url = `${TOGGL_API_BASE}${path}`;
    if (params) {
      const qs = new URLSearchParams(params).toString();
      if (qs) url += `?${qs}`;
    }
    return this.request(url);
  }

  /** POST helper for the Reports API v3 */
  async postReport(path: string, body: Record<string, any>): Promise<any> {
    return this.request(`${TOGGL_REPORTS_BASE}${path}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  /** POST helper for the main Toggl API v9 */
  private async post(path: string, body: Record<string, any>): Promise<any> {
    return this.request(`${TOGGL_API_BASE}${path}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  /** PUT helper for the main Toggl API v9 */
  private async put(path: string, body: Record<string, any>): Promise<any> {
    return this.request(`${TOGGL_API_BASE}${path}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  /** DELETE helper for the main Toggl API v9 */
  private async delete(path: string): Promise<any> {
    return this.request(`${TOGGL_API_BASE}${path}`, { method: "DELETE" });
  }

  // ── Workspaces ──────────────────────────────────────────────

  async listWorkspaces(): Promise<any[]> {
    return this.get("/me/workspaces");
  }

  // ── Projects (auto-paginated, 200 per page) ────────────────

  async listProjects(
    workspaceId: number,
    options?: { active?: boolean; client_ids?: number[] }
  ): Promise<any[]> {
    const allProjects: any[] = [];
    let page = 1;
    const perPage = 200;

    while (true) {
      const params: Record<string, string> = {
        per_page: String(perPage),
        page: String(page),
      };
      if (options?.active !== undefined) {
        params.active = String(options.active);
      }
      if (options?.client_ids?.length) {
        params.client_ids = options.client_ids.join(",");
      }

      const projects: any[] = await this.get(
        `/workspaces/${workspaceId}/projects`,
        params
      );

      allProjects.push(...projects);

      if (projects.length < perPage) break;
      page++;
    }

    return allProjects;
  }

  // ── Single Project ──────────────────────────────────────────

  async getProject(workspaceId: number, projectId: number): Promise<any> {
    return this.get(`/workspaces/${workspaceId}/projects/${projectId}`);
  }

  async createProject(workspaceId: number, body: {
    name: string;
    client_id?: number;
    active?: boolean;
    billable?: boolean;
    color?: string;
    is_private?: boolean;
  }): Promise<any> {
    return this.post(`/workspaces/${workspaceId}/projects`, body);
  }

  async updateProject(workspaceId: number, projectId: number, body: {
    name?: string;
    client_id?: number;
    active?: boolean;
    billable?: boolean;
    color?: string;
    is_private?: boolean;
  }): Promise<any> {
    return this.put(`/workspaces/${workspaceId}/projects/${projectId}`, body);
  }

  async deleteProject(workspaceId: number, projectId: number): Promise<null> {
    return this.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
  }

  // ── Clients ─────────────────────────────────────────────────

  async listClients(workspaceId: number): Promise<any[]> {
    return this.get(`/workspaces/${workspaceId}/clients`);
  }

  async createClient(workspaceId: number, body: { name: string; notes?: string }): Promise<any> {
    return this.post(`/workspaces/${workspaceId}/clients`, body);
  }

  async updateClient(workspaceId: number, clientId: number, body: { name?: string; notes?: string }): Promise<any> {
    return this.put(`/workspaces/${workspaceId}/clients/${clientId}`, body);
  }

  async deleteClient(workspaceId: number, clientId: number): Promise<null> {
    return this.delete(`/workspaces/${workspaceId}/clients/${clientId}`);
  }

  // ── Users ───────────────────────────────────────────────────

  async listUsers(workspaceId: number): Promise<any[]> {
    return this.get(`/workspaces/${workspaceId}/users`);
  }

  // ── Tasks (project tasks) ──────────────────────────────────

  async listTasks(workspaceId: number, projectId: number): Promise<any[]> {
    return this.get(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks`
    );
  }

  async createTask(workspaceId: number, projectId: number, body: {
    name: string;
    active?: boolean;
    estimated_seconds?: number;
    user_id?: number;
  }): Promise<any> {
    return this.post(`/workspaces/${workspaceId}/projects/${projectId}/tasks`, body);
  }

  async updateTask(workspaceId: number, projectId: number, taskId: number, body: {
    name?: string;
    active?: boolean;
    estimated_seconds?: number;
    user_id?: number;
  }): Promise<any> {
    return this.put(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, body);
  }

  async deleteTask(workspaceId: number, projectId: number, taskId: number): Promise<null> {
    return this.delete(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
  }

  // ── Project Users (membership) ─────────────────────────────

  async listProjectUsers(workspaceId: number, projectId: number): Promise<any[]> {
    // The API ignores project_id as a filter and returns all workspace project_users,
    // so we filter client-side.
    const all = await this.get(`/workspaces/${workspaceId}/project_users`);
    return all.filter((pu: any) => pu.project_id === projectId);
  }

  async addProjectUser(workspaceId: number, projectId: number, userId: number, manager = false): Promise<any> {
    return this.post(`/workspaces/${workspaceId}/project_users`, {
      project_id: projectId,
      user_id: userId,
      manager,
    });
  }

  async removeProjectUser(workspaceId: number, projectUserId: number): Promise<null> {
    return this.delete(`/workspaces/${workspaceId}/project_users/${projectUserId}`);
  }

  async addUserToClientProjects(workspaceId: number, clientId: number, userId: number, manager = false): Promise<any[]> {
    const projects = await this.listProjects(workspaceId, { active: true, client_ids: [clientId] });
    const results = [];
    for (const project of projects) {
      try {
        const result = await this.addProjectUser(workspaceId, project.id, userId, manager);
        results.push({ project_id: project.id, project_name: project.name, result });
      } catch (err) {
        results.push({ project_id: project.id, project_name: project.name, error: String(err) });
      }
    }
    return results;
  }

  async removeUserFromClientProjects(workspaceId: number, clientId: number, userId: number): Promise<any[]> {
    const projects = await this.listProjects(workspaceId, { client_ids: [clientId] });
    const results = [];
    for (const project of projects) {
      try {
        const projectUsers: any[] = await this.listProjectUsers(workspaceId, project.id);
        const membership = projectUsers.find((pu) => pu.user_id === userId && pu.project_id === project.id);
        if (!membership) {
          results.push({ project_id: project.id, project_name: project.name, skipped: "user not a member" });
          continue;
        }
        await this.removeProjectUser(workspaceId, membership.id);
        results.push({ project_id: project.id, project_name: project.name, removed: true });
      } catch (err) {
        results.push({ project_id: project.id, project_name: project.name, error: String(err) });
      }
    }
    return results;
  }

  // ── Reports: Search Time Entries (cursor-paginated) ────────

  async searchTimeEntries(
    workspaceId: number,
    body: Record<string, any>
  ): Promise<any[]> {
    const allEntries: any[] = [];
    let firstRowNumber = 1;
    const pageSize = 50;

    // Always enrich so we get user/project names
    const requestBody = {
      ...body,
      enrich_response: true,
      page_size: pageSize,
      first_row_number: firstRowNumber,
    };

    while (true) {
      requestBody.first_row_number = firstRowNumber;

      const result = await this.postReport(
        `/workspace/${workspaceId}/search/time_entries`,
        requestBody
      );

      if (result && Array.isArray(result)) {
        allEntries.push(...result);
        if (result.length < pageSize) break;
        firstRowNumber += result.length;
      } else {
        break;
      }
    }

    return allEntries;
  }

  // ── Reports: Summary Report ────────────────────────────────

  async getSummaryReport(
    workspaceId: number,
    body: Record<string, any>
  ): Promise<any> {
    return this.postReport(
      `/workspace/${workspaceId}/summary/time_entries`,
      body
    );
  }
}
