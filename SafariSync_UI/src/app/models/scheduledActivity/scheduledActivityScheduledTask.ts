import { ScheduledTask } from "./scheduledTask.model";

export interface ScheduledActivityScheduledTask {
  scheduledActivityScheduledTask_ID: number;
  scheduledActivity_ID: number;
  scheduledTask_ID: number;
  scheduledTask: ScheduledTask;
}
