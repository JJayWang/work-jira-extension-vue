import { JiraIssueApiResp } from "./jira.type";

type TokenProvider = () => Promise<string> | string;

export class JiraApiService {
  private _baseUrl = "";
  private _getToken: TokenProvider;

  constructor(baseUrl: string, getToken: TokenProvider) {
    this._baseUrl = baseUrl;
    this._getToken = getToken;
  }

  public async getMyIssue(status: string[]): Promise<JiraIssueApiResp> {
    const token = await this._getToken();

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
          Authorization: `Basic ${btoa(token)}`,
        },
      },
    );

    return (await resp.json()) as JiraIssueApiResp;
  }

  public async getIssue(key: string) {
    const token = await this._getToken();

    const params = new URLSearchParams({
      fields: "*all",
      failFast: "true",
    });

    const resp = await fetch(
      `${this._baseUrl}/rest/api/3/issue/${key}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${btoa(token)}`,
        },
      },
    );

    return await resp.json();
  }

  public async getStatus() {
    const resp = await fetch(
      `${this._baseUrl}/rest/api/3/project/IFOMS/statuses`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${btoa(await this._getToken())}`,
        },
      },
    );
    console.log(await resp.json());
  }
}
