export type VSCodeStateType = {
  issues: IssueStateType[];
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
