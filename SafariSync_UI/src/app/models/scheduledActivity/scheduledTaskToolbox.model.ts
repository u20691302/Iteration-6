import { Toolbox } from "../toolbox/toolbox.model";

export interface ScheduledTaskToolbox {
  scheduledTaskToolbox_ID: number;
  toolbox_ID: number;
  scheduledTask_ID: number;
  toolbox?: Toolbox;
}
