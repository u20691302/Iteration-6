import { TaskS } from './task.model';

export interface ActivityTask {
  activityTask_ID: number;
  activity_ID: number;
  task_ID: number;
  task?: TaskS;
}