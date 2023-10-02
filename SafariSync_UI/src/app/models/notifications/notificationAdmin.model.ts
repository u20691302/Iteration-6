import { Contractor } from "../contractor/contractor.model";
import { ScheduledActivity } from "../scheduledActivity/scheduledActivity.model";
import { ScheduledTask } from "../scheduledActivity/scheduledTask.model";
import { User } from "../user/user.model";
import { NotificationStatus } from "./notificationStatus.model";

export interface NotificationAdmin {
    notification_ID: number;
    date: Date;
    notification_Message: string;
    notificationStatus_ID: number;
    scheduledTask_ID: number;
    contractor_ID: number;
    scheduledActivity_ID: number;
    scheduledTask?: ScheduledTask[];
    noticationStatus?: NotificationStatus;
    contractor?: Contractor;
  }