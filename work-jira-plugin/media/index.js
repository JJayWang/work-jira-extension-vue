(function () {
  const vscode = acquireVsCodeApi();
  const openBtn = document.querySelector("#open-input-btn");
  const wrapper = document.querySelector("#wrapper");

  renderListFromState();

  openBtn.addEventListener("click", () => {
    vscode.postMessage({ type: "openEnterToken" });
  });

  if (initData.hasToken) {
    openBtn.classList.add("d-none");
  }

  /** extension communication */
  window.addEventListener("message", (evt) => {
    const message = evt.data;
    switch (message.type) {
      case "toggle-openBtn-show":
        message.value
          ? openBtn.classList.add("d-none")
          : openBtn.classList.remove("d-none");
        break;
      case "set-data":
        if (message.value && message.value.length) {
          vscode.setState({ issues: message.value });
          renderListFromState();
        }
      default:
        console.log("message trigger");
        break;
    }
  });

  function renderListFromState() {
    const state = vscode.getState();
    if (state && state.issues) {
      wrapper.innerHTML = "";
      wrapper.innerHTML = state.issues
        .map(
          (item) =>
            `<div class='jira-item'>${item.name} (${item.status.name})</div>`,
        )
        .join("");
    }
  }
})();
