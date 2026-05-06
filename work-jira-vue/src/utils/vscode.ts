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

  public getAllState() {
    return this.vsCodeApi?.getState() || { issues: [], hasToken: false };
  }

  public getState<T>(key: keyof VSCodeStateType) {
    const state = this.getAllState();
    return state[key] as T;
  }

  public setState<T>(key: keyof VSCodeStateType, value: T) {
    const state = this.getAllState();
    state[key] = value as any;
    this.vsCodeApi?.setState(state);
  }

  public resetState() {
    this.vsCodeApi?.setState({
      hasToken: false,
      issues: [],
    });
  }
}

export const vscode = new VSCodeAPIWrapper();

export const registEvent = <T>(type: string, callback: (data: T) => void) => {
  const handler = (evt: MessageEvent<{ type: string; value: T }>) => {
    const message = evt.data;
    if (message.type === type) {
      callback(message.value as T);
    }
  };
  window.addEventListener('message', handler);

  return () => {
    window.removeEventListener('message', handler);
  };
};
