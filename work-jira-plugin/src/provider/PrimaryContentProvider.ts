import vscode from "vscode";
import { getNonce } from "../utils/getNonce";
import path from "path";
import fs from "fs";
import { InitialScriptModel } from "../types/common.type";
import { JiraWorkItemModel } from "../types/jira.work.type";

export class PrimaryContentProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private pathPrefix = "media";

  constructor(
    private readonly _context: vscode.ExtensionContext,
    private readonly _initData: InitialScriptModel,
  ) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken,
  ): Thenable<void> | void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      // localResourceRoots: [
      //   // 必須包含 media 資料夾路徑
      //   vscode.Uri.joinPath(this._context.extensionUri, "media"),
      // ],
    };

    webviewView.webview.html = this._getHtmlForWebview();

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "openEnterToken":
          vscode.commands.executeCommand("work-jira-extension.setToken");
          break;
        default:
          break;
      }
    });
  }

  public notifyOpenBtn(show: boolean) {
    this._view?.webview.postMessage({
      type: "toggle-openBtn-show",
      value: show,
    });
  }

  public setData(data: JiraWorkItemModel[]) {
    this._view?.webview.postMessage({
      type: "set-data",
      value: data,
    });
  }

  private _getHtmlForWebview() {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = this.getStaticPath("assets/index-BujxjlMy.js");
    const styleMain = this.getStaticPath("assets/index-DEm2-gV0.css");

    let html = fs.readFileSync(
      path.join(
        this._context.extensionPath,
        this.pathPrefix,
        "index-template.html",
      ),
      "utf-8",
    );

    const hostSetting = [
      { key: "{cspSource}", value: this._view?.webview.cspSource },
      { key: "{nonce}", value: getNonce() },
      { key: "{index.js-uri}", value: scriptUri?.toString() },
      { key: "{index.css-uri}", value: styleMain?.toString() },
    ];

    hostSetting.forEach((item) => {
      html = html.replace(new RegExp(item.key, "g"), item.value || "");
    });

    return html;
  }

  private getStaticPath(file: string) {
    return this._view?.webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, this.pathPrefix, file),
    );
  }
}
