import { ActivityTask } from './activityTask.model';
import { TaskS } from './task.model';

export interface Activity {
  activity_ID: number;
  activity_Name: string;
  activity_Description: string;
  activityTask: ActivityTask[];
}