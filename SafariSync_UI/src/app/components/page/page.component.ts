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
      case 'Dashboard':
        pdfName = 'Dashboard.pdf';
        break;
      case 'My Profile':
        pdfName = 'Profile.pdf';
        break;
      case 'Scheduled Activities':
        pdfName = 'Scheduling.pdf';
        break;
      case 'Activities':
        pdfName = 'Activity.pdf';
        break;
        case 'Skills':
        pdfName = 'Skill.pdf';
        break;
        case 'Employees':
        pdfName = 'User.pdf';
        break;
      case 'Toolboxes':
        pdfName = 'Toolbox.pdf';
        break;
      case 'Equipment':
        pdfName = 'Equipment.pdf';
        break;
      case 'Stock':
        pdfName = 'Stock.pdf';
        break;
        case 'Suppliers':
        pdfName = 'Supplier.pdf';
        break;
        case 'Contractors':
        pdfName = 'Contractor.pdf';
        break;
      case 'Reports':
        pdfName = 'Report.pdf';
        break;
      case 'Settings':
        pdfName = 'Settings.pdf';
        break;     
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
