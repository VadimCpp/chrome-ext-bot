import { Program } from '@/classes/program';
import { Step } from '@/classes/step';
import { type ProgramData } from '@/types';
import { MessageAction, Program1Steps } from '@/enums';

export const program1: ProgramData = {
  name: "Program 1",
  description: "The program navigates to borinorge.no website and shows bot's possibilities.",
  createProgram: () => {
    const program = new Program("Program 1");

    /**
     * Step 1: Find an existing Borinorge tab
     * Looks for any open tab with borinorge.no domain
     */
    const step1 = new Step(
      Program1Steps.FIND_BORINORGE_TAB,
      () => {
        console.log("Program 1. Step 1. Find Borinorge tab");
        return new Promise((resolve) => {
          chrome.runtime.sendMessage({ action: MessageAction.P1_FIND_TAB }, (response: any) => {
            if (response?.success && response.tab?.id) {
              console.log('Successfully found Borinorge tab:', response);
              program.setState('tabId', response.tab.id);
              resolve("success");
            } else {
              console.log('Failed to find Borinorge tab.');
              resolve("failed");
            }
          });
        });
      },
      {
        "success": Program1Steps.ACTIVATE_BORINORGE_TAB,
        "failed": Program1Steps.OPEN_BORINORGE_TAB
      },
      500, 1000, 300, 800
    );

    /**
     * Step 2: Activate the found Borinorge tab
     * Makes the tab active in the browser window
     */
    const step2 = new Step(
      Program1Steps.ACTIVATE_BORINORGE_TAB,
      () => {
        console.log("Program 1. Step 2. Activate Borinorge tab");
        return new Promise((resolve) => {
          const tabId = program.getState('tabId');

          if (!tabId) {
            console.log('No tab ID found in state');
            resolve("failed");
            return;
          }

          chrome.runtime.sendMessage({
            action: MessageAction.P1_ACTIVATE_TAB,
            tabId: tabId
          }, (response: any) => {
            if (response?.success) {
              console.log('Successfully activated Borinorge tab:', response.tab);
              program.setState('tabId', response.tab.id);
              resolve("success");
            } else {
              console.log('Error activating tab:', response.error);
              resolve("failed");
            }
          });
        });
      },
      {
        "success": Program1Steps.HIGHLIGHT_TITLE,
        "failed": Program1Steps.OPEN_BORINORGE_TAB
      },
      500, 1000, 300, 800
    );

    /**
     * Step 3: Open a new Borinorge tab
     * Creates a new tab with borinorge.no if no existing tab was found
     */
    const step3 = new Step(
      Program1Steps.OPEN_BORINORGE_TAB,
      () => {
        console.log("Program 1. Step 3. Open Borinorge tab");
        return new Promise((resolve) => {
          chrome.runtime.sendMessage({ action: MessageAction.P1_OPEN_TAB }, (response: any) => {
            if (response?.success) {
              console.log('Successfully opened Borinorge tab:', response.tab);
              program.setState('tabId', response.tab.id);
              resolve("success");
            } else {
              console.log('Error opening tab:', response.error);
              resolve("failed");
            }
          });
        });
      },
      {
        "success": Program1Steps.HIGHLIGHT_TITLE,
        "failed": Program1Steps.FINISH_WITH_ERROR
      },
      500, 1000, 300, 800
    );

    /**
     * Step 4: Error handling step
     * Terminates the program if previous steps failed
     */
    const step4 = new Step(
      Program1Steps.FINISH_WITH_ERROR,
      () => {
        console.log("Program 1. Step 4. Finished with error");
        return Promise.resolve("done");
      },
      { "done": "end" },
      500, 1000, 300, 800
    );

    /**
     * Step 5: Highlight the page title
     * Adds a visual highlight to the h1 element on the page
     */
    const step5 = new Step(
      Program1Steps.HIGHLIGHT_TITLE,
      () => {
        console.log("Program 1. Step 5. Highlight title");
        return new Promise((resolve) => {
          const tabId = program.getState('tabId');
          if (!tabId) {
            console.log('No tab ID found in state');
            resolve("failed");
            return;
          }

          chrome.runtime.sendMessage({
            action: MessageAction.P1_HIGHLIGHT,
            tabId: tabId
          }, (response: any) => {
            if (response?.success) {
              console.log('Successfully highlighted title.');
              resolve("success");
            } else {
              console.log('Error highlighting title:', response.error);
              resolve("failed");
            }
          });
        });
      },
      {
        "success": Program1Steps.FIND_PROJECT,
        "failed": Program1Steps.FINISH_WITH_ERROR
      },
      500, 1000, 300, 800
    );

    /**
     * Step 6: Find a project on the page
     * Locates a project card that's visible in the viewport
     */
    const step6 = new Step(
      Program1Steps.FIND_PROJECT,
      () => {
        console.log("Program 1. Step 6. Find project");
        return new Promise((resolve) => {
          const tabId = program.getState('tabId');
          if (!tabId) {
            console.log('No tab ID found in state');
            resolve("failed");
            return;
          }

          const currentProjectUrl = program.getState('currentProjectUrl');

          chrome.runtime.sendMessage({
            action: MessageAction.P1_FIND_PROJECT,
            tabId: tabId,
            currentProjectUrl: currentProjectUrl
          }, (response: any) => {
            if (response?.success && response.projectUrl) {
              console.log('Project found: ', response.projectUrl);
              program.setState('currentProjectUrl', response.projectUrl);
              resolve("success");
            } else {
              console.log('Error finding project:', response.error);
              resolve("failed");
            }
          });
        });
      },
      {
        "success": Program1Steps.OPEN_LINK,
        "failed": Program1Steps.SCROLL_DOWN
      },
      500, 1000, 1000, 1500
    );

    /**
     * Step 7: Open the project link
     * Navigates to the selected project's detail page
     */
    const step7 = new Step(
      Program1Steps.OPEN_LINK,
      () => {
        console.log("Program 1. Step 7. Open link");
        return new Promise((resolve) => {
          const tabId = program.getState('tabId');
          const projectUrl = program.getState('currentProjectUrl');

          if (!tabId || !projectUrl) {
            console.log('Missing tab ID or project URL in state');
            resolve("failed");
            return;
          }

          chrome.runtime.sendMessage({
            action: MessageAction.P1_OPEN_LINK,
            tabId: tabId,
            url: projectUrl
          }, () => {
            // Ignore response since page will reload
            console.log('Opening project link...');
            resolve("success");
          });
        });
      },
      {
        "success": Program1Steps.SHOW_ANIMATION,
        "failed": Program1Steps.FINALIZE
      },
      500, 1000, 300, 800
    );

    /**
     * Step 8: Show an animation overlay
     * Displays a visual "It Works!" animation on the page
     */
    const step8 = new Step(
      Program1Steps.SHOW_ANIMATION,
      () => {
        console.log("Program 1. Step 8. Show animation");
        return new Promise((resolve) => {
          const tabId = program.getState('tabId');
          if (!tabId) {
            console.log('No tab ID found in state');
            resolve("failed");
            return;
          }

          chrome.runtime.sendMessage({
            action: MessageAction.P1_SHOW_ANIM,
            tabId: tabId
          }, (response: any) => {
            if (response?.success) {
              console.log('Successfully showed animation.');
              resolve("success");
            } else {
              console.log('Error showing animation:', response.error);
              resolve("failed");
            }
          });
        });
      },
      { "success": Program1Steps.NAVIGATE_BACK, "failed": Program1Steps.FINALIZE },
      2000, 3000, 2000, 3000
    );

    /**
     * Step 9: Navigate back to the projects list
     * Returns to the previous page in browser history
     */
    const step9 = new Step(
      Program1Steps.NAVIGATE_BACK,
      () => {
        console.log("Program 1. Step 9. Navigate back");
        return new Promise((resolve) => {
          const tabId = program.getState('tabId');
          if (!tabId) {
            console.log('No tab ID found in state');
            resolve("failed");
            return;
          }

          chrome.runtime.sendMessage(
            { action: MessageAction.P1_NAV_BACK, tabId: tabId },
            () => {
              // Ignore response since page will reload
              console.log('Navigating back...');
              resolve("success");
            }
          );
        });
      },
      { "success": Program1Steps.FIND_PROJECT, "failed": Program1Steps.FINALIZE },
      1000, 2000, 1000, 2000
    );

    /**
     * Step 10: Scroll down the page
     * Scrolls to reveal more project cards if needed
     */
    const step10 = new Step(
      Program1Steps.SCROLL_DOWN,
      () => {
        console.log("Program 1. Step 10. Scroll down");
        return new Promise((resolve) => {
          const tabId = program.getState('tabId');
          if (!tabId) {
            console.log('No tab ID found in state');
            resolve("failed");
            return;
          }

          chrome.runtime.sendMessage(
            { action: MessageAction.P1_SCROLL, tabId: tabId },
            (response: any) => {
              if (response?.success) {
                console.log('Successfully scrolled down.');
                if (response.isAtEnd) {
                  console.log('Reached end of scrolling.');
                  resolve("finished");
                } else {
                  resolve("success");
                }
              } else {
                console.log('Error scrolling down:', response.error);
                resolve("failed");
              }
            }
          );
        });
      },
      {
        "success": Program1Steps.FIND_PROJECT,
        "failed": Program1Steps.FINALIZE,
        "finished": Program1Steps.FINALIZE
      },
      1000, 2000, 1000, 2000
    );

    /**
     * Step 11: Finalize the program
     * Completes the program execution
     */
    const step11 = new Step(
      Program1Steps.FINALIZE,
      () => {
        console.log("Program 1. Step 11. Finalizing Program 1");
        return Promise.resolve("done");
      },
      { "done": "end" },
      2000, 3000, 1000, 2000
    );

    // Add all steps to the program
    program.addStep(step1);
    program.addStep(step2);
    program.addStep(step3);
    program.addStep(step4);
    program.addStep(step5);
    program.addStep(step6);
    program.addStep(step7);
    program.addStep(step8);
    program.addStep(step9);
    program.addStep(step10);
    program.addStep(step11);
    
    return program;
  }
};