import { Activity } from "../activity/activity.model";
import { User } from "../user/user.model";
import { ActivityStatus } from "./ActivityStatus.model";
import { ScheduledActivityScheduledTask } from "./scheduledActivityScheduledTask";

export interface ScheduledActivity {
  scheduledActivity_ID: number;
  startDate: Date;
  endDate: Date;
  activity_Location: string;
  userId: number;
  activityStatus_ID: number;
  activity_ID: number;
  users?: User;
  activityStatus?: ActivityStatus;
  activity: Activity;
  scheduledActivityScheduledTask: ScheduledActivityScheduledTask[];
}
