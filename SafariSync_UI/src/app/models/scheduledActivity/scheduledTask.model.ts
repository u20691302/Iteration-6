import { TaskS } from "../activity/task.model";
import { Contractor } from "../contractor/contractor.model";
import { User } from "../user/user.model";
import { TaskStatus } from "./taskStatus.model";

export interface ScheduledTask {
  scheduledTask_ID: number;
  startDate: Date;
  endDate: Date;
  taskStatus_ID: number;
  task_ID: number;
  task: TaskS;
  taskStatus?: TaskStatus;
  users?: User[];
  contractors?: Contractor[];
}
