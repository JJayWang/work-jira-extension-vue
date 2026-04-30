export type JiraWorkItemModel = {
  key: string;
  name: string;
  status: {
    id: string;
    name: string;
  };
  dueDate: string | null;
};
