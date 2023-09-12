import { Activity } from "../activity/activity.model";
import { ScheduledActivity } from "../scheduledActivity/scheduledActivity.model";
import { User } from "../user/user.model";

export interface Notification {
    notification_ID: number;
    date: Date;
    user_ID: number;
    users:User;
    scheduledActivity: ScheduledActivity;
    scheduledTask_ID: number;
    scheduledActivity_ID: number;
    notificationStatus_ID: number;
  }