import { User } from "../user/user.model";

export interface ScheduledTaskUser {
  scheduledTaskUser_ID: number;
  userId: number;
  scheduledTask_ID: number;
  user?: User;
}
