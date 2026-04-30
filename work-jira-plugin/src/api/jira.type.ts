export type JiraIssueApiResp = {
  isLast: boolean;
  issues: JiraIssueApiItem[];
};

type JiraIssueApiItem = {
  id: string;
  key: string;
  expand: string;
  fields: {
    assignee: {
      displayName: string;
      emailAddress: string;
    };
    project: {
      name: string;
    };
    summary: string;
    status: {
      id: string;
      name: string;
    };
    customfield_12574: string;
  };
};
