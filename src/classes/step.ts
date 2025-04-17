/**
 * Represents a state (or step) in the program state machine.
 */
export class Step {
  /**
   * @param {string} name - A unique identifier for the step.
   * @param {function} action - Callback executed for this step. It should return a key indicating the outcome.
   * @param {object} transitions - Mapping from outcome keys to the next step's name.
   * @param {number} [minPreExecutionDelay=2000] - Minimum delay in ms before step execution.
   * @param {number} [maxPreExecutionDelay=5000] - Maximum delay in ms before step execution.
   * @param {number} [minPostExecutionDelay=1000] - Minimum delay in ms after step execution.
   * @param {number} [maxPostExecutionDelay=3000] - Maximum delay in ms after step execution.
   */
  constructor(
    public name: string,
    public action: () => Promise<string>,
    public transitions: Record<string, string> = {},
    public minPreExecutionDelay: number = 2000,
    public maxPreExecutionDelay: number = 5000,
    public minPostExecutionDelay: number = 1000,
    public maxPostExecutionDelay: number = 3000
  ) {}

  // Returns a random delay between minDelay and maxDelay.
  getRandomDelay(minDelay: number, maxDelay: number): number {
    return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  }

  // Returns a random pre-execution delay
  getPreExecutionDelay(): number {
    return this.getRandomDelay(this.minPreExecutionDelay, this.maxPreExecutionDelay);
  }

  // Returns a random post-execution delay
  getPostExecutionDelay(): number {
    return this.getRandomDelay(this.minPostExecutionDelay, this.maxPostExecutionDelay);
  }
}
