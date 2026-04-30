import { JiraIssueApiResp } from "./jira.type";

export class JiraApiService {
  private _baseUrl = "";
  private _token = "";

  constructor(baseUrl: string, token: string) {
    this._baseUrl = baseUrl;
    this._token = token;
  }

  public async getMyIssue(status: string[]): Promise<JiraIssueApiResp> {
    //*all
    const params = new URLSearchParams({
      jql: `project=iFOMS AND assignee=currentUser() ${status?.length ? `AND status in (${status.map((item) => `'${item}'`).join(",")})` : ""}`,
      fields: "project,summary,assignee,status,customfield_12574",
      maxResults: "50",
    });

    const resp = await fetch(
      `${this._baseUrl}/rest/api/3/search/jql?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${btoa(this._token)}`,
        },
      },
    );

    return (await resp.json()) as JiraIssueApiResp;
  }

  public async getStatus() {
    const resp = await fetch(
      `${this._baseUrl}/rest/api/3/project/IFOMS/statuses`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${btoa(this._token)}`,
        },
      },
    );
    console.log(await resp.json());
    // return (await resp.json()) as JiraIssueApiResp;
  }
}
