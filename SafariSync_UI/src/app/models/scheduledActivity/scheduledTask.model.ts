import { TaskS } from "../activity/task.model";

export interface ScheduledTask {
  scheduledTask_ID: number;
  startDate: Date;
  endDate: Date;
  taskStatus: string;
  task_ID: number;
  task: TaskS;
}

