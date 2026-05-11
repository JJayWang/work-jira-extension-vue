export type VSCodeStateType = {
  hasToken: false;
  issues: IssueStateType[];
  issue: unknown;
};

export type IssueStateType = {
  id: string;
  key: string;
  name: string;
  status: {
    id: string;
    name: string;
  };
  dueDate: string | null;
};
