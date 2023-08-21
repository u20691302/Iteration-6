import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { Report } from 'src/app/models/report/report.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import jsPDF from 'jspdf';



@Component({
  selector: 'app-view-previous-reports',
  templateUrl: './view-previous-reports.component.html',
  styleUrls: ['./view-previous-reports.component.scss']
})
export class ViewPreviousReportsComponent {
  constructor(private sanitizer: DomSanitizer, private reportService: ReportsService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      startDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required]
    });
   }

  reports: Report[] = [];
  startDateTime: Date | null = null;
  endDateTime: Date | null = null;
  searchTerm: string = '';
  form: FormGroup;
  pdfSrc: SafeResourceUrl = '';
  downloadReport: jsPDF = new jsPDF('portrait', 'px', 'a4');

  ngOnInit(): void {
    this.GetAllReports();
  }

  GetAllReports(): void {
    this.reportService.getAllReports(this.searchTerm).subscribe(
      (reports) => {
        if (this.startDateTime == null || this.endDateTime == null || this.startDateTime > this.endDateTime) {
          this.reports = reports;
        } else {
          this.reports = reports.filter(reports => {
            const createdDate = reports.createdAt;
            return createdDate >= this.startDateTime! && createdDate <= this.endDateTime!;
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  OnSearch(): void {
    this.GetAllReports();
  }

  ClearSearchTerm(): void {
    this.searchTerm = '';
    this.OnSearch();
  }

  clearDatePickers(): void {
    this.startDateTime = null;
    this.endDateTime = null;
    this.GetAllReports();
  }

  getCurrentDateTime(): string {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  }

  validateDateRange(): void {
    this.form.controls['startDateTime'].markAsDirty();
    this.form.controls['endDateTime'].markAsDirty();
  }

  isDateRangeValid(): boolean {
    if (this.form.controls['startDateTime'].dirty || this.form.controls['endDateTime'].dirty) {
      if (this.startDateTime && this.endDateTime) {
        const startDate = new Date(this.startDateTime);
        const endDate = new Date(this.endDateTime);
        return startDate < endDate;
      }
    }
    return true;
  }

  OpenPDFModal(content: any, pdfData: string) {
    // Assuming you have the base64-encoded PDF data in a variable named `pdfData`
  
    // Convert base64 to Uint8Array
    const pdfArray = new Uint8Array(atob(pdfData).split('').map(char => char.charCodeAt(0)));
    
    // Create a Blob from Uint8Array
    const pdfBlob = new Blob([pdfArray], { type: 'application/pdf' });
  
    // Create a blob URL for the PDF
    const pdfUrl = URL.createObjectURL(pdfBlob);
  
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
  
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }
  
  downloadPDF(){
    this.downloadReport.save('Stock Report' + ' ' + new Date())
  }
}
