import { ExecutionEngine } from '@/classes/execution-engine';
import { type ProgramData } from '@/types';
import { programs } from '@/programs/index';

// Sidebar functionality
document.addEventListener("DOMContentLoaded", () => {
  console.log("Sidebar loaded");

  const programSelect = document.getElementById("programSelect") as HTMLSelectElement;
  const controlPanel = document.getElementById("controlPanel") as HTMLDivElement;
  const programName = document.getElementById("programName") as HTMLHeadingElement;
  const programDescription = document.getElementById("programDescription") as HTMLParagraphElement;
  const startBtn = document.getElementById("startBtn") as HTMLButtonElement;
  const stopBtn = document.getElementById("stopBtn") as HTMLButtonElement;
  const logContent = document.getElementById("logContent") as HTMLDivElement;

  let currentProgramData: ProgramData | null = null;
  let executionEngine: ExecutionEngine | null = null;

  // Handle program selection
  programSelect.addEventListener("change", (e) => {
    const selectedProgram = (e.target as HTMLSelectElement).value;
    if (selectedProgram) {
      currentProgramData = programs[selectedProgram];
      programName.textContent = currentProgramData.name;
      programDescription.textContent = currentProgramData.description;
      controlPanel.classList.add("controlpanel--active");
      
      // Check if there's an ongoing execution that needs to be stopped
      if (executionEngine) {
        // Log program interruption due to program change
        console.log(`Stop (program change)`);
        
        // Stop the execution engine
        executionEngine.stop();
        
        // Display interruption message
        logContent.innerHTML = `<p>[${new Date().toLocaleTimeString()}] Program change caused interruption. No log available</p>`;
        
        executionEngine = null;
      } else {
        // Clear previous log if no execution was running
        logContent.innerHTML = "";
      }
      
      updateButtonStates();
    } else {
      controlPanel.classList.remove("controlpanel--active");
      currentProgramData = null;
      
      // Stop any running execution
      if (executionEngine) {
        // Log program interruption due to program change
        console.log("Program selection cleared. Stop (program change)");
        
        // Stop the execution engine
        executionEngine.stop();
        
        // Display interruption message
        logContent.innerHTML = `<p>[${new Date().toLocaleTimeString()}] Program change caused interruption. No log available</p>`;
        
        executionEngine = null;
      }
    }
  });

  // Handle start button
  startBtn.addEventListener("click", () => {
    if (currentProgramData && !executionEngine) {
      // Log program start
      console.log(`${currentProgramData.name}. Start`);
      
      // Clear previous log content
      logContent.innerHTML = "";
      
      // Create a new program instance
      const program = currentProgramData.createProgram();
      
      // Create execution engine with callbacks
      executionEngine = new ExecutionEngine(
        program,
        // onStepComplete callback
        (stepResult) => {
          // Add new log entry at the top
          logContent.innerHTML = `<p>[${new Date().toLocaleTimeString()}] <b>${stepResult.step}</b> => ${stepResult.outcome}</p>` + logContent.innerHTML;
        },
        // onFinish callback
        (result) => {
          // Log program completion
          console.log(`${currentProgramData!.name}. Finished`);
          
          // Add finish message at the top
          logContent.innerHTML = `<p>[${new Date().toLocaleTimeString()}] Finished. Total steps executed: ${result.totalStepsExecuted}</p>` + logContent.innerHTML;
          executionEngine = null;
          updateButtonStates();
        }
      );
      
      // Start execution
      executionEngine.run();
      updateButtonStates();
      // Add start message at the top
      logContent.innerHTML = `<p>[${new Date().toLocaleTimeString()}] Started ${currentProgramData.name}</p>` + logContent.innerHTML;
    }
  });

  // Handle stop button
  stopBtn.addEventListener("click", () => {
    if (executionEngine) {
      // Log program stop
      console.log(`${currentProgramData!.name}. Stop (interruption)`);
      
      // Immediately stop the execution engine
      executionEngine.stop();
      
      // Clear log content and display interruption message
      logContent.innerHTML = `<p>[${new Date().toLocaleTimeString()}] Program interrupted. No log available</p>`;
      
      executionEngine = null;
      updateButtonStates();
    }
  });

  // Update button states based on program status
  function updateButtonStates(): void {
    startBtn.disabled = !currentProgramData || executionEngine !== null;
    stopBtn.disabled = executionEngine === null;
  }
}); 
