import { ScheduledActivity } from "../scheduledActivity/scheduledActivity.model";
import { User } from "../user/user.model";
import { NotificationStatus } from "./notificationStatus.model";

export interface NotificationSupervisor {
    notification_ID: number;
    date: Date;
    user_ID: number;
    notification_Message: string;
    notificationStatus_ID: number;
    scheduledActivity_ID: number;
    scheduledActivity?: ScheduledActivity[];
    noticationStatus?: NotificationStatus;
    user?: User;
  }