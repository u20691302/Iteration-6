import { Contractor } from "../contractor/contractor.model";

export interface ScheduledTaskContractor {
  scheduledTaskContractor_ID: number;
  Contractor_ID: number;
  scheduledTask_ID: number;
  contractor?: Contractor;
}