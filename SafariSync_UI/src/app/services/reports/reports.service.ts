import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, tap, mergeMap, of } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Report } from 'src/app/models/report/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }

  getAllReports(term: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.baseApiUrl}/api/Reporting/ReadAllReportsAsync`).pipe(
      map(reports => {
        if (term === null) {
          return reports;
        }
        const filteredReports = reports.filter((report: Report) =>
          report.report_Title.toLowerCase().includes(term.toLowerCase()) ||
          report.createdAt.toString().toLowerCase().includes(term.toLowerCase())
        );
        return filteredReports;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  SaveReport(saveReportRequest: Report): Observable<Report> {
    console.log(saveReportRequest)
    return this.http.post<Report>(this.baseApiUrl + '/api/Reporting/SaveReport/', saveReportRequest);
  }
}
