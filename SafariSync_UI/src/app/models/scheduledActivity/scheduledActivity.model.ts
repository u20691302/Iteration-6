import { Activity } from "../activity/activity.model";
import { User } from "../user/user.model";
import { ActivityStatus } from "./activityStatus.model";
import { ScheduledActivityScheduledTask } from "./scheduledActivityScheduledTask";

export interface ScheduledActivity {
  scheduledActivity_ID: number;
  startDate: Date;
  endDate: Date;
  activity_Location: string;
  user_ID: number;
  activityStatus_ID: number;
  activity_ID: number;
  users?: User;
  activityStatus?: ActivityStatus;
  activity: Activity;
  scheduledActivityScheduledTask: ScheduledActivityScheduledTask[];
}
