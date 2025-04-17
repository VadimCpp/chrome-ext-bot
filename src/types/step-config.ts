export type StepTransitions = Record<string, string>;

export type StepConfig = {
  name: string;
  transitions: StepTransitions;
  minPreDelay?: number;
  maxPreDelay?: number;
  minPostDelay?: number;
  maxPostDelay?: number;
}
