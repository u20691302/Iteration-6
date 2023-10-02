import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Audit } from 'src/app/models/audit/Audit.model';


@Injectable({
  providedIn: 'root'
})


export class AuditService {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }

  ReadAllAuditsAsync(term: string): Observable<Audit[]> {
    return this.http.get<Audit[]>(`${this.baseApiUrl}/api/Audit/ReadAllAuditsAsync`).pipe(
      map(audits => {
        if (term === null) {
          return audits;
        }
        
        const filteredAudit = audits.filter((audit: Audit) =>
        audit.auditAction?.auditAction_Name.toLowerCase().includes(term.toLowerCase()) ||
        audit.date.toString().toLowerCase().includes(term.toLowerCase()) ||
        audit.message.toString().toLowerCase().includes(term.toLowerCase())
        );
        
        return filteredAudit;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );;
  } 

  AddAudit(addAuditRequest: Audit): Observable<Audit> {
    return this.http.post<Audit>(this.baseApiUrl + '/api/Audit/AddAudit/', addAuditRequest);
  }
  
}
