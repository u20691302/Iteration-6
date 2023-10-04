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

  searchTerm: string = '';

  

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

  searchEntries(searchTerm: string): void {
    const query = searchTerm.trim();
    if (query === '') {
      this.filteredEntries = this.entries.filter(entry => entry !== 'Entry 14');
    } else {
      this.filteredEntries = this.entries.filter(entry =>
        entry.toLowerCase().includes(query.toLowerCase()) && entry !== 'Entry 14'
      );
    }
  }

  ClearSearchTerm(): void {
    this.searchTerm = '';
    this.searchEntries('');
  }

  showPdf(entry: string): void {
    let pdfName: string;

    switch (entry) {
      // case 'Dashboard':
      //   pdfName = '1PDF1.pdf';
      //   break;
      // case 'My Profile':
      //   pdfName = '1PDF2.pdf';
      //   break;
      // case 'Scheduled Activities':
      //   pdfName = '1Bootcamp day 2 memo.pdf';
      //   break;
      // case 'Activities':
      //   pdfName = '1Technical requirements.pdf';
      //   break;
      //   case 'Skills':
      //   pdfName = '1Technical ERD 2022(2).pdf';
      //   break;
      //   case 'Employees':
      //   pdfName = '1PDF1.pdf';
      //   break;
      // case 'Toolboxes':
      //   pdfName = '1Tuesday Memo.pdf';
      //   break;
      // case 'Equipment':
      //   pdfName = '1Bootcamp day 2 memo.pdf';
      //   break;
      // case 'Stock':
      //   pdfName = '1Technical requirements.pdf';
      //   break;
      //   case 'Suppliers':
      //   pdfName = '1Technical ERD 2022(2).pdf';
      //   break;
      //   case 'Contractors':
      //   pdfName = '1Tuesday Memo.pdf';
      //   break;
      // case 'Reports':
      //   pdfName = '1Bootcamp day 2 memo.pdf';
      //   break;
      // case 'Settings':
      //   pdfName = '1Technical requirements.pdf';
      //   break;     
        case 'Entry 14':
        pdfName = 'Complete.pdf';
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
