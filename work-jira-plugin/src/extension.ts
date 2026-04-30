import * as vscode from "vscode";
import { COMMAND_VAL } from "./contants/command.constant";
import { PrimaryContentProvider } from "./provider/PrimaryContentProvider";
import { InitialScriptModel } from "./types/common.type";
import { JiraApiService } from "./api/jira.service";

export async function activate(context: vscode.ExtensionContext) {
  const tokenKey = "work-jira-token";
  const token = await context.secrets.get(tokenKey);
  const hasToken = Boolean(token);

  const config = vscode.workspace.getConfiguration("wJiraExt");
  const baseUrl = config.get<string>("baseUrl");

  const jiraService = new JiraApiService(baseUrl!, token!);

  const initialScript: InitialScriptModel = {
    hasToken,
  };

  const provider = new PrimaryContentProvider(context, initialScript);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("work-jira-content", provider, {
      webviewOptions: {
        retainContextWhenHidden: true,
      },
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND_VAL.SetToken, async () => {
      const token = await vscode.window.showInputBox({
        prompt: "請輸入 API Token",
        password: true,
        ignoreFocusOut: true,
      });

      if (token) {
        context.secrets.store(tokenKey, token);
        provider.notifyOpenBtn(true);
      } else {
        vscode.window.showErrorMessage("No token save!");
        return;
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND_VAL.RemoveToken, () => {
      context.secrets.delete(tokenKey);
      provider.notifyOpenBtn(false);
    }),
  );

  /** 取得工作單資料 */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      COMMAND_VAL.SyncIssue,
      async (status: string[]) => {
        const data = await jiraService.getMyIssue(status);
        const issues = data.issues.map((item) => ({
          id: item.id,
          key: item.key,
          name: item.fields.summary,
          status: {
            id: item.fields.status.id,
            name: item.fields.status.name,
          },
          dueDate: item.fields.customfield_12574,
        }));

        provider.setData(issues);
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND_VAL.ChangeStatus, async () => {
      const key = "selectedStaus";
      const selectedLast = context.globalState.get<string[]>(key) || [];

      const status = ["待處理", "處理中", "Code Review", "SIT"];
      const selected = await vscode.window.showQuickPick(
        status.map((item) => ({
          label: item,
          picked: !selectedLast.length || selectedLast.includes(item),
        })),
        {
          canPickMany: true,
        },
      );

      if (selected) {
        const selectedStatus = selected.map((item) => item.label);
        context.globalState.update(key, selectedStatus);
        vscode.commands.executeCommand(COMMAND_VAL.SyncIssue, selectedStatus);
      }
    }),
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
