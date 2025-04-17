// Content script for Chrome Ext Bot
import { getCardHrefUrl } from './utils/dom';
import { MessageAction } from './enums/messages';

console.log("Content script loaded");

// Listen for messages from background script
chrome.runtime.onMessage.addListener((
  message: any, 
  sender: chrome.runtime.MessageSender, 
  sendResponse: (response: any) => void
) => {
  console.log("Message received in content script:", message);

  // Handle different message actions
  switch (message.action) {
    case MessageAction.CS_HIGHLIGHT:
      handleHighlightTitle(message, sendResponse);
      break;
      
    case MessageAction.CS_FIND_PROJECT:
      handleFindProject(message, sendResponse);
      break;
      
    case MessageAction.CS_OPEN_LINK:
      handleOpenLink(message, sendResponse);
      break;
      
    case MessageAction.CS_SHOW_ANIM:
      handleShowAnimation(sendResponse);
      break;
      
    case MessageAction.CS_NAV_BACK:
      handleNavigateBack(sendResponse);
      break;
      
    case MessageAction.CS_SCROLL:
      handleScrollDown(sendResponse);
      break;
  }

  return true; // Will respond asynchronously
});

/**
 * Highlights an element on the page
 */
function handleHighlightTitle(message: any, sendResponse: (response: any) => void): void {
  // Find the element matching the selector
  const element = document.querySelector(message.selector);

  if (element) {
    // Add highlight with fade transition
    element.setAttribute("style", `
      border: 3px solid #4CAF50 !important;
      border-radius: 5px !important;
      padding: 5px !important;
      background-color: rgba(76, 175, 80, 0.1) !important;
    `);

    sendResponse({ success: true });
  } else {
    sendResponse({ success: false, error: "Element not found" });
  }
}

/**
 * Finds and highlights the next project card
 */
function handleFindProject(message: any, sendResponse: (response: any) => void): void {
  const currentProjectUrl = message.currentProjectUrl;
  
  // Get current scroll position and viewport dimensions
  const scrollTop = window.scrollY;
  const viewportHeight = window.innerHeight;
  const viewportBottom = scrollTop + viewportHeight * 0.8; // 80% of viewport height for better UX

  // Find all project cards that are visible in the viewport
  const projectCards = Array.from(document.querySelectorAll(".card"))
    .filter(card => {
      const rect = card.getBoundingClientRect();
      const cardTop = rect.top + scrollTop;
      const cardBottom = rect.bottom + scrollTop;
      // Check if card is at least partially visible in viewport
      return cardTop < viewportBottom && cardBottom > scrollTop;
    });

  if (projectCards.length === 0) {
    sendResponse({ success: false, error: "No visible project cards found" });
    return;
  }

  // Get URLs from visible cards using helper function
  const projectUrls = projectCards
    .map((card) => getCardHrefUrl(card as HTMLElement))
    .filter((url): url is string => url !== null);

  if (projectUrls.length === 0) {
    sendResponse({ success: false, error: "No valid project URLs found" });
    return;
  }

  // Handle case when no current project is specified
  if (!currentProjectUrl) {
    return handleFirstProject(projectCards[0], projectUrls[0], sendResponse);
  }

  // Find index of current project among visible cards
  const currentIndex = projectUrls.findIndex((url) => 
    url === currentProjectUrl || `https://www.borinorge.no${url}` === currentProjectUrl
  );

  if (currentIndex === -1 || currentIndex === projectUrls.length - 1) {
    // If current project not found or was last visible project, return error
    sendResponse({
      success: false,
      error: "No more visible projects available",
    });
    return;
  }

  // Handle next project
  return handleNextProject(
    projectCards[currentIndex + 1], 
    projectUrls[currentIndex + 1], 
    sendResponse
  );
}

/**
 * Handles the first project in the list
 */
function handleFirstProject(
  firstCard: Element, 
  firstProject: string, 
  sendResponse: (response: any) => void
): void {
  // Add highlight to first card
  firstCard.setAttribute("style", `
    border: 3px solid #4CAF50 !important;
    border-radius: 5px !important;
    padding: 5px !important;
    background-color: rgba(76, 175, 80, 0.1) !important;
  `);

  sendResponse({
    success: true,
    projectUrl: firstProject.startsWith("http")
      ? firstProject
      : `https://www.borinorge.no${firstProject}`,
  });
}

/**
 * Handles the next project in the list
 */
function handleNextProject(
  nextCard: Element, 
  nextProject: string, 
  sendResponse: (response: any) => void
): void {
  // Add highlight effect to next card
  nextCard.setAttribute("style", `
    border: 3px solid #4CAF50 !important;
    border-radius: 5px !important;
    padding: 5px !important;
    background-color: rgba(76, 175, 80, 0.1) !important;
    transition: all 0.3s ease-in-out !important;
  `);

  sendResponse({
    success: true,
    projectUrl: nextProject.startsWith("http")
      ? nextProject
      : `https://www.borinorge.no${nextProject}`,
  });
}

/**
 * Opens a link in the current tab
 */
function handleOpenLink(message: any, sendResponse: (response: any) => void): void {
  window.location.href = message.url;
}

/**
 * Shows an animation overlay
 */
function handleShowAnimation(sendResponse: (response: any) => void): void {
  // Create overlay div for the animation
  const overlay = document.createElement("div");
  overlay.setAttribute("style", `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  `);

  // Create message text
  const message = document.createElement("div");
  message.textContent = "It Works!";
  message.setAttribute("style", `
    color: white;
    font-size: 72px;
    font-weight: bold;
    transform: scale(0);
    transition: transform 0.5s ease-in-out;
  `);

  overlay.appendChild(message);
  document.body.appendChild(overlay);

  // Trigger animations
  setTimeout(() => {
    overlay.setAttribute("style", overlay.getAttribute("style")!.replace("opacity: 0", "opacity: 1"));
    message.setAttribute("style", message.getAttribute("style")!.replace("transform: scale(0)", "transform: scale(1)"));
  }, 100);

  // Remove overlay after animation
  setTimeout(() => {
    overlay.setAttribute("style", overlay.getAttribute("style")!.replace("opacity: 1", "opacity: 0"));
    message.setAttribute("style", message.getAttribute("style")!.replace("transform: scale(1)", "transform: scale(0)"));
    setTimeout(() => overlay.remove(), 500);
  }, 2000);

  sendResponse({ success: true });
}

/**
 * Navigates back in browser history
 */
function handleNavigateBack(sendResponse: (response: any) => void): void {
  window.history.back();
}

/**
 * Scrolls the page down
 */
function handleScrollDown(sendResponse: (response: any) => void): void {
  const currentScrollPosition = window.scrollY;
  const screenHeight = window.innerHeight;
  const scrollAmount = currentScrollPosition + (screenHeight / 2);
  
  // Check if we can scroll further
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (currentScrollPosition >= maxScroll) {
    sendResponse({ success: true, isAtEnd: true });
    return;
  }

  window.scrollTo({
    top: scrollAmount,
    behavior: 'smooth'
  });
  
  sendResponse({ success: true });
}
