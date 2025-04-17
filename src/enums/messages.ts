export enum MessageAction {
  // Program 1 background actions
  P1_FIND_TAB = 'PROGRAM_1_STEP_1_FIND_BORINORGE_TAB',
  P1_ACTIVATE_TAB = 'PROGRAM_1_STEP_2_ACTIVATE_BORINORGE_TAB',
  P1_OPEN_TAB = 'PROGRAM_1_STEP_3_OPEN_BORINORGE_TAB',
  P1_HIGHLIGHT = 'PROGRAM_1_STEP_5_HIGHLIGHT_TITLE',
  P1_FIND_PROJECT = 'PROGRAM_1_STEP_6_FIND_PROJECT',
  P1_OPEN_LINK = 'PROGRAM_1_STEP_7_OPEN_LINK',
  P1_SHOW_ANIM = 'PROGRAM_1_STEP_8_SHOW_ANIMATION',
  P1_NAV_BACK = 'PROGRAM_1_STEP_9_NAVIGATE_BACK',
  P1_SCROLL = 'PROGRAM_1_STEP_10_SCROLL_DOWN',

  // Content script actions
  CS_HIGHLIGHT = 'CONTENT_SCRIPT_HIGHLIGHT_TITLE',
  CS_FIND_PROJECT = 'CONTENT_SCRIPT_FIND_PROJECT',
  CS_OPEN_LINK = 'CONTENT_SCRIPT_OPEN_LINK',
  CS_SHOW_ANIM = 'CONTENT_SCRIPT_SHOW_ANIMATION',
  CS_NAV_BACK = 'CONTENT_SCRIPT_NAVIGATE_BACK',
  CS_SCROLL = 'CONTENT_SCRIPT_SCROLL_DOWN'
}

// Message interfaces
export interface BaseMessage {
  action: MessageAction;
}

export interface TabMessage extends BaseMessage {
  tabId: number;
}

export interface ProjectMessage extends TabMessage {
  currentProjectUrl: string;
}

export interface LinkMessage extends TabMessage {
  url: string;
}

export interface ResponseMessage {
  success: boolean;
  error?: string;
  message?: string;
  tab?: chrome.tabs.Tab;
  projectUrl?: string;
  isAtEnd?: boolean;
} 