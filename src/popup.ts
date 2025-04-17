// Popup script for Chrome Ext Bot
console.log("Popup script loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup DOM loaded");

  document.getElementById('open-sidebar')?.addEventListener('click', async () => {
    try {
      const chromeWindow = await chrome.windows.getCurrent();
      if (!chromeWindow.id) throw new Error('Window ID not found');
      await chrome.sidePanel.open({ windowId: chromeWindow.id });
      console.log('Side panel opened successfully');
      // Close the popup
      window.close();
    } catch (error) {
      console.error('Error opening side panel:', error);
    }
  });
});
