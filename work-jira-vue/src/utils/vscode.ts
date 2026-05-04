import type { VSCodeStateType } from '@/types/VSCodeState';
import type { WebviewApi } from 'vscode-webview';

class VSCodeAPIWrapper {
  private readonly vsCodeApi: WebviewApi<VSCodeStateType> | undefined;

  constructor() {
    if (typeof acquireVsCodeApi === 'function') {
      this.vsCodeApi = acquireVsCodeApi();
    }
  }

  public postMessage(message: any) {
    this.vsCodeApi?.postMessage(message);
  }

  public getState() {
    return this.vsCodeApi?.getState();
  }

  public setState(state: VSCodeStateType) {
    this.vsCodeApi?.setState(state);
  }
}

export const vscode = new VSCodeAPIWrapper();
