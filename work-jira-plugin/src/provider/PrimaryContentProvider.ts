import vscode, { Uri } from "vscode";
import path from "path";
import fs from "fs";
import { JiraWorkItemModel } from "../types/jira.work.type";
import { getNonce } from "../utils/getNonce";

export class PrimaryContentProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private pathPrefix = "media";
  private vueOutput = "vue-dist";

  constructor(private readonly _context: vscode.ExtensionContext) {}

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
      //   Uri.file(path.join(this._context.extensionPath, "media")),
      //   // vscode.Uri.joinPath(this._context.extensionUri, "media"),
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
    const assets = this.getViteAssets();
    const scriptUri = this.getStaticPath(assets?.js);
    const styleMain = this.getStaticPath(assets?.css[0]);

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
      vscode.Uri.joinPath(
        this._context.extensionUri,
        `${this.pathPrefix}/${this.vueOutput}`,
        file,
      ),
    );
  }

  private getViteAssets() {
    try {
      // 1. 讀取檔案內容
      const manifestContent = fs.readFileSync(
        path.join(
          this._context.extensionPath.toString(),
          `${this.pathPrefix}/${this.vueOutput}/.vite/manifest.json`,
        ),
        "utf-8",
      );

      // 2. 解析為 JSON
      const manifest = JSON.parse(manifestContent);
      console.log(manifest);
      // 3. 取得進入點資訊 (通常是 src/main.ts 或 index.html)
      // 註：這要對應你當初在 Vite 中的進入點路徑
      const entry = manifest["index.html"];

      return {
        js: entry.file, // 主要的 JS 檔名
        css: entry.css ? entry.css : [], // CSS 檔案列表 (陣列)
      };
    } catch (error) {
      console.error("無法讀取 Manifest:", error);
      return null;
    }
  }
}
