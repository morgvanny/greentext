const TWEET_SELECTOR = '[data-testid="tweetText"]';

function formatGreentext(tweet) {
  if (tweet.dataset.greentextFormatted) return;

  const tweetText = tweet.textContent;
  const lines = tweetText.split("\n");

  const fragment = document.createDocumentFragment();
  let hasGreentext = false;

  lines.forEach((line, index) => {
    const lineElement = document.createElement("span");
    lineElement.textContent = line;

    if (line.trim().startsWith(">")) {
      lineElement.classList.add("greentext");
      hasGreentext = true;
    }

    fragment.appendChild(lineElement);
    if (index < lines.length - 1) {
      fragment.appendChild(document.createElement("br"));
    }
  });

  tweet.textContent = ""; // Clear the tweet content
  tweet.appendChild(fragment);
  tweet.dataset.greentextFormatted = "true";

  if (hasGreentext) {
    tweet.classList.add("has-greentext");
  }
}

function applyStyle(styleName) {
  document.documentElement.classList.remove("blue-style", "red-style");
  document.documentElement.classList.add(styleName);
}

function handleMutations(mutations) {
  const addedNodes = mutations
    .flatMap((mutation) => Array.from(mutation.addedNodes))
    .filter((node) => node.nodeType === Node.ELEMENT_NODE);

  const addedTweets = addedNodes.flatMap((node) =>
    node.matches(TWEET_SELECTOR)
      ? [node]
      : Array.from(node.querySelectorAll(TWEET_SELECTOR))
  );

  addedTweets.forEach(formatGreentext);
}

function observeTwitter() {
  const observer = new MutationObserver(handleMutations);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Initial formatting
document.querySelectorAll(TWEET_SELECTOR).forEach(formatGreentext);

// Start observing for new tweets
observeTwitter();

// Apply saved style preference
chrome.storage.sync.get("stylePreference", function (data) {
  applyStyle(data.stylePreference || "blue-style");
});

// Listen for style change messages from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "changeStyle") {
    applyStyle(request.style);
  }
});
