import { Skills } from "../skills/skills.model";

export interface TaskS {
    task_ID: number;
    task_Name: string;
    task_Description: string;
    skill_ID: number;
    skill?: Skills;
  }