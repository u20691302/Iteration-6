import { Component,OnInit } from '@angular/core';
import { Audit } from 'src/app/models/audit/Audit.model';

import { AuditService } from 'src/app/services/audit/audit.service';

@Component({
  selector: 'app-audit-action-records',
  templateUrl: './audit-action-records.component.html',
  styleUrls: ['./audit-action-records.component.scss']
})
export class AuditActionRecordsComponent implements OnInit {
  audits: Audit[] = [];
  searchTerm: string = '';

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.getAudits()
  }

  getAudits(): void {
    // Fetch the audit data from your service
    this.auditService.ReadAllAuditsAsync(this.searchTerm).subscribe((data) => {
      this.audits = data;
    });
  }

  OnSearch(): void {
    this.getAudits();
  }

  ClearSearchTerm(): void {
    this.searchTerm = '';
    this.OnSearch();
  }
}
