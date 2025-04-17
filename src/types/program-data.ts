import { Program } from '@/classes/program';

/**
 * Represents the data structure for a program in the application.
 * This includes the program's name, description, and a function to create the program instance.
 */
export type ProgramData = {
  name: string;
  description: string;
  createProgram: () => Program;
}; 