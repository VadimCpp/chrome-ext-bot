import { Program } from '@/classes/program';
import { Step } from '@/classes/step';
import { type ProgramData } from '@/types';

export const program3: ProgramData = {
  name: "Program 3 (Demo)",
  description: "This is a demo program. It does nothing.",
  createProgram: () => {
    const program = new Program("Program 3");
    
    // Define steps for Program 3
    const step1 = new Step("Start", () => {
      console.log("Program 3. Step 1. Starting Program 3");
      return Promise.resolve("running");
    }, { "running": "Optimize" }, 1200, 2200, 600, 1600);
    
    const step2 = new Step("Optimize", () => {
      console.log("Program 3. Step 2. Optimizing in Program 3");
      return Promise.resolve("complete");
    }, { "complete": "Finish" }, 1800, 2800, 900, 1900);
    
    const step3 = new Step("Finish", () => {
      console.log("Program 3. Step 3. Finishing Program 3");
      return Promise.resolve("done");
    }, {}, 2200, 3200, 1200, 2200);
    
    program.addStep(step1);
    program.addStep(step2);
    program.addStep(step3);
    
    return program;
  }
}; 