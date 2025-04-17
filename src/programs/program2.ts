import { Program } from '@/classes/program';
import { Step } from '@/classes/step';
import { type ProgramData } from '@/types';

export const program2: ProgramData = {
  name: "Program 2 (Demo)",
  description: "This is a demo program. It does nothing.",
  createProgram: () => {
    const program = new Program("Program 2");
    
    // Define steps for Program 2
    const step1 = new Step("Setup", () => {
      console.log("Program 2. Step 1. Setting up Program 2");
      return Promise.resolve("ready");
    }, { "ready": "Analyze" }, 1000, 2000, 500, 1500);
    
    const step2 = new Step("Analyze", () => {
      console.log("Program 2. Step 2. Analyzing data in Program 2");
      return Promise.resolve("success");
    }, { "success": "Report" }, 1500, 2500, 800, 1800);
    
    const step3 = new Step("Report", () => {
      console.log("Program 2. Step 3. Generating report in Program 2");
      return Promise.resolve("done");
    }, {}, 2000, 3000, 1000, 2000);
    
    program.addStep(step1);
    program.addStep(step2);
    program.addStep(step3);
    
    return program;
  }
}; 