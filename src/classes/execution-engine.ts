import { Program } from '@/classes/program';
import { Step } from '@/classes/step';

// Executes the state machine.
export class ExecutionEngine {
  /**
   * @param {Program} program - The state machine program to execute.
   * @param {function} onStepComplete - Callback when a step completes.
   * @param {function} onFinish - Callback when execution is finished.
   */
  constructor(
    public program: Program,
    public onStepComplete: (stepResult: { program: string; step: string; outcome: string; count: number }) => void,
    public onFinish: (result: { program: string; totalStepsExecuted: number }) => void
  ) {
    this.running = false;
  }

  // Flag to track if execution is running
  private running: boolean;

  // Executes the state machine.
  async run(): Promise<void> {
    this.running = true;
    let currentStep: Step | undefined = this.program.getStep(this.program.initialStep!);
    let stepCounter = 0;

    while (this.running && currentStep) {
      try {
        // Wait for pre-execution delay
        const preDelay = currentStep.getPreExecutionDelay();
        if (preDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, preDelay));
        }

        // Execute the step
        const outcome = await currentStep.action();
        
        // Get the next step based on the outcome
        const nextStepName = currentStep.transitions[outcome];
        if (!nextStepName) {
          throw new Error(`Invalid transition from ${currentStep.name} with outcome ${outcome}`);
        }

        // Handle special "end" transition
        if (nextStepName === "end") {
          this.running = false;
          this.finish(stepCounter);
          return;
        }

        // Callback to update UI/logs or send messages.
        if (this.onStepComplete) {
          this.onStepComplete({
            program: this.program.name,
            step: currentStep.name,
            outcome,
            count: ++stepCounter,
          });
        }

        // Wait for post-execution delay
        const postDelay = currentStep.getPostExecutionDelay();
        if (postDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, postDelay));
        }

        currentStep = this.program.getStep(nextStepName);
      } catch (error) {
        console.error(`Error in step ${currentStep?.name}:`, error);
        currentStep = this.program.getStep('error');
      }
    }
    
    // Only call finish if execution completed normally (not interrupted)
    if (this.running) {
      this.finish(stepCounter);
    }
  }

  // Stops the execution process.
  stop(): void {
    this.running = false;
    // Clear program state when execution is interrupted
    this.program.clearState();
  }

  // Called when execution is finished. Sends a final report.
  finish(totalStepsExecuted: number): void {
    // Clear program state when execution completes
    this.program.clearState();
    
    if (this.onFinish) {
      this.onFinish({
        program: this.program.name,
        totalStepsExecuted,
      });
    }
  }
} 