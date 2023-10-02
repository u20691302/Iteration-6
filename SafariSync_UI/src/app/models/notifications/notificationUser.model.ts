import { ScheduledTask } from "../scheduledActivity/scheduledTask.model";
import { User } from "../user/user.model";
import { NotificationStatus } from "./notificationStatus.model";

export interface NotificationUser {
    notification_ID: number;
    date: Date;
    user_ID: number;
    notification_Message: string;
    notificationStatus_ID: number;
    scheduledTask_ID: number;
    scheduledActivity_ID: number;
    scheduledActivity?: ScheduledTask[];
    noticationStatus?: NotificationStatus;
    user?: User;
  }