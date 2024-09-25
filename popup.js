document
  .getElementById("blueStyle")
  .addEventListener("click", () => changeStyle("blue-style"));
document
  .getElementById("redStyle")
  .addEventListener("click", () => changeStyle("red-style"));

function changeStyle(style) {
  chrome.storage.sync.set({ stylePreference: style }, function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "changeStyle",
        style: style,
      });
    });
  });
}
