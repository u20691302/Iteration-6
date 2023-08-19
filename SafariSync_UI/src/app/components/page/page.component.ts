import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  selectedEntry: string | null = null;
  selectedEntryPdfUrl: SafeResourceUrl | null = null;
  showPdfViewer: boolean = false;
  modalRef: NgbModalRef | null = null;

  

  constructor(
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filteredEntries = this.entries.filter(entry => entry !== 'Entry 14');
  }

  entries: string[] = [
    'Dashboard',
    'My Profile',
    'Scheduled Activities',
    'Activities',
    'Skills',
    'Employees',
    'Toolboxes',
    'Equipment',
    'Stock',
    'Suppliers',
    'Contractors',
    'Reports',
    'Settings',
    'Entry 14'
  ];

  filteredEntries: string[] = [];

  searchEntries(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value.trim();
    if (query === '') {
      this.filteredEntries = this.entries.filter(entry => entry !== 'Entry 14');
    } else {
      this.filteredEntries = this.entries.filter(entry =>
        entry.toLowerCase().includes(query.toLowerCase()) && entry !== 'Entry 14'
      );
    }
  }

  showPdf(entry: string): void {
    let pdfName: string;

    switch (entry) {
      case 'Dashboard':
        pdfName = 'PDF1.pdf';
        break;
      case 'My Profile':
        pdfName = 'PDF2.pdf';
        break;
      case 'Scheduled Activities':
        pdfName = 'Bootcamp day 2 memo.pdf';
        break;
      case 'Activities':
        pdfName = 'Technical requirements.pdf';
        break;
        case 'Skills':
        pdfName = 'Technical ERD 2022(2).pdf';
        break;
        case 'Employees':
        pdfName = 'PDF1.pdf';
        break;
      case 'Toolboxes':
        pdfName = 'Tuesday Memo.pdf';
        break;
      case 'Equipment':
        pdfName = 'Bootcamp day 2 memo.pdf';
        break;
      case 'Stock':
        pdfName = 'Technical requirements.pdf';
        break;
        case 'Suppliers':
        pdfName = 'Technical ERD 2022(2).pdf';
        break;
        case 'Contractors':
        pdfName = 'Tuesday Memo.pdf';
        break;
      case 'Reports':
        pdfName = 'Bootcamp day 2 memo.pdf';
        break;
      case 'Settings':
        pdfName = 'Technical requirements.pdf';
        break;     
        case 'Entry 14':
        pdfName = 'PDF1.pdf';
        break;
      // Add more cases for other entries as needed

      default:
        // Handle the case when entry doesn't match any known URLs
        return;
    }

    this.selectedEntry = entry;
    this.selectedEntryPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`assets/PDFs/${pdfName}`);
    this.showPdfViewer = true;
  }

  hidePdfViewer(): void {
    this.showPdfViewer = false;
  }

  openModal(content: any): void {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }

  

}
