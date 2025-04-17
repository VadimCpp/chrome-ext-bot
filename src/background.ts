import { MessageAction, BaseMessage, ResponseMessage, TabMessage, ProjectMessage, LinkMessage } from '@/enums';

console.log('Background script is running');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message: BaseMessage, sender, sendResponse: (response: ResponseMessage) => void) => {
  console.log('Received message:', message);

  // Handle different message actions
  switch (message.action) {
    case MessageAction.P1_FIND_TAB:
      handleFindTab(sendResponse);
      break;
      
    case MessageAction.P1_ACTIVATE_TAB:
      handleActivateTab(message as TabMessage, sendResponse);
      break;
      
    case MessageAction.P1_OPEN_TAB:
      handleOpenTab(sendResponse);
      break;
      
    case MessageAction.P1_HIGHLIGHT:
      handleHighlight(message as TabMessage, sendResponse);
      break;
      
    case MessageAction.P1_FIND_PROJECT:
      handleFindProject(message as ProjectMessage, sendResponse);
      break;
      
    case MessageAction.P1_OPEN_LINK:
      handleOpenLink(message as LinkMessage, sendResponse);
      break;
      
    case MessageAction.P1_SHOW_ANIM:
      handleShowAnimation(message as TabMessage, sendResponse);
      break;
      
    case MessageAction.P1_NAV_BACK:
      handleNavigateBack(message as TabMessage, sendResponse);
      break;
      
    case MessageAction.P1_SCROLL:
      handleScroll(message as TabMessage, sendResponse);
      break;
  }

  // Return true to indicate we'll respond asynchronously
  return true;
});

// Find a tab with borinorge.no domain
function handleFindTab(sendResponse: (response: ResponseMessage) => void): void {
  chrome.tabs.query({ url: '*://*.borinorge.no/*' }, (tabs) => {
    if (tabs.length > 0) {
      sendResponse({ success: true, tab: tabs[0] });
    } else {
      sendResponse({ success: false, message: 'No borinorge.no tab found' });
    }
  });
}

// Activate an existing tab
function handleActivateTab(message: TabMessage, sendResponse: (response: ResponseMessage) => void): void {
  chrome.tabs.update(message.tabId, { active: true }, (tab) => {
    if (chrome.runtime.lastError) {
      console.error('Error activating tab:', chrome.runtime.lastError);
      sendResponse({ success: false, error: chrome.runtime.lastError.message });
    } else {
      sendResponse({ success: true, tab: tab });
    }
  });
}

// Open a new tab with borinorge.no
function handleOpenTab(sendResponse: (response: ResponseMessage) => void): void {
  chrome.tabs.create({ url: 'https://borinorge.no' }, (tab) => {
    if (chrome.runtime.lastError) {
      console.error('Error creating tab:', chrome.runtime.lastError);
      sendResponse({ success: false, error: chrome.runtime.lastError.message });
    } else {
      sendResponse({ success: true, tab: tab });
    }
  });
}

// Highlight an element in the page
function handleHighlight(message: TabMessage, sendResponse: (response: ResponseMessage) => void): void {
  chrome.tabs.sendMessage(message.tabId, {
    action: MessageAction.CS_HIGHLIGHT,
    selector: 'h1'
  }, (response) => {
    if (chrome.runtime.lastError) {
      sendResponse({ success: false, error: chrome.runtime.lastError.message });
      return;
    }

    if (response && response.success) {
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: response ? response.error : 'No response from content script' });
    }
  });
}

// Find a project on the page
function handleFindProject(message: ProjectMessage, sendResponse: (response: ResponseMessage) => void): void {
  chrome.tabs.sendMessage(message.tabId, {
    action: MessageAction.CS_FIND_PROJECT,
    currentProjectUrl: message.currentProjectUrl
  }, (response) => {
    if (chrome.runtime.lastError) {
      sendResponse({ success: false, error: chrome.runtime.lastError.message });
      return;
    }

    if (response && response.success && response.projectUrl) {
      sendResponse({ success: true, projectUrl: response.projectUrl });
    } else {
      sendResponse({ success: false, error: response ? response.error : 'No response from content script' });
    }
  });
}

// Open a link in the current tab
function handleOpenLink(message: LinkMessage, sendResponse: (response: ResponseMessage) => void): void {
  chrome.tabs.sendMessage(message.tabId, {
    action: MessageAction.CS_OPEN_LINK,
    url: message.url
  }, () => {
    if (chrome.runtime.lastError) {
      sendResponse({ success: false, error: chrome.runtime.lastError.message });
      return;
    }

    sendResponse({ success: true });
  });
}

// Show animation in the content
function handleShowAnimation(message: TabMessage, sendResponse: (response: ResponseMessage) => void): void {
  chrome.tabs.sendMessage(message.tabId, {
    action: MessageAction.CS_SHOW_ANIM
  }, (response) => {
    if (chrome.runtime.lastError) {
      sendResponse({ success: false, error: chrome.runtime.lastError.message });
      return;
    }

    if (response && response.success) {
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: response ? response.error : 'No response from content script' });
    }
  });
}

// Navigate back in browser history
function handleNavigateBack(message: TabMessage, sendResponse: (response: ResponseMessage) => void): void {
  chrome.tabs.sendMessage(message.tabId, {
    action: MessageAction.CS_NAV_BACK
  }, () => {
    if (chrome.runtime.lastError) {
      sendResponse({ success: false, error: chrome.runtime.lastError.message });
      return;
    }

    sendResponse({ success: true });
  });
}

// Scroll the page
function handleScroll(message: TabMessage, sendResponse: (response: ResponseMessage) => void): void {
  chrome.tabs.sendMessage(message.tabId, {
    action: MessageAction.CS_SCROLL
  }, (response) => {
    if (chrome.runtime.lastError) {
      sendResponse({ success: false, error: chrome.runtime.lastError.message });
      return;
    }

    if (response && response.success) {
      if (response.isAtEnd) {
        sendResponse({ success: true, isAtEnd: true });
      } else {
        sendResponse({ success: true });
      }
    } else {
      sendResponse({ success: false, error: response ? response.error : 'No response from content script' });
    }
  });
}

console.log('Background script loaded');
