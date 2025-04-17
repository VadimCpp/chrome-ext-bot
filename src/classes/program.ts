import { Step } from '@/classes/step';

// Represents a state machine with a set of steps.
export class Program {
  /**
   * @param {string} name - The program name.
   * @param {object} steps - Object mapping step names to Step instances.
   * @param {string} initialStep - The name of the starting step.
   */
  constructor(
    public name: string,
    public steps: Record<string, Step> = {},
    public initialStep: string | null = null
  ) {
    this.state = {}; // Temporary state storage for step results
  }

  // State storage for step results
  private state: Record<string, any>;

  // Retrieves a step by its name.
  getStep(stepName: string): Step | undefined {
    return this.steps[stepName];
  }

  // Adds a step and optionally sets it as the initial step if none exists.
  addStep(step: Step): void {
    this.steps[step.name] = step;
    if (!this.initialStep) {
      this.initialStep = step.name;
    }
  }

  // Gets a value from the state
  getState(key: string): any {
    return this.state[key];
  }

  // Sets a value in the state
  setState(key: string, value: any): void {
    this.state[key] = value;
  }

  // Clears all state
  clearState(): void {
    this.state = {};
  }
} 
