import { User } from "../user/user.model";

export interface Report {
  report_ID: number;
  report_Title: string;
  createdAt: Date;
  user_ID: number;
  pdfUrl: string;
  user?: User;
}
