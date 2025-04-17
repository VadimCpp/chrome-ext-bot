export * from './messages';

export enum Program1Steps {
  FIND_BORINORGE_TAB = 'findBorinorgeTab',
  ACTIVATE_BORINORGE_TAB = 'activateBorinorgeTab',
  OPEN_BORINORGE_TAB = 'openBorinorgeTab',
  FINISH_WITH_ERROR = 'finishWithError',
  HIGHLIGHT_TITLE = 'highlightTitle',
  FIND_PROJECT = 'findProject',
  OPEN_LINK = 'openLink',
  SHOW_ANIMATION = 'showAnimation',
  NAVIGATE_BACK = 'navigateBack',
  SCROLL_DOWN = 'scrollDown',
  FINALIZE = 'finalize'
}
