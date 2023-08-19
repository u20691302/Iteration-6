import { Skills } from "../skills/skills.model";

export interface UserSkill {
  userSkill_ID: number;
  user_ID: number;
  skill_ID: number;
  skills?: Skills;
}
