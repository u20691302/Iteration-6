import { AuditAction } from "./AuditAction.model";

export interface Audit{
    audit_ID: number;
    date: Date; 
    message: string;
    username:string;
    auditAction_ID: number;
    auditAction?: AuditAction;
}