import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pdf-viewer',
  template: `
    <div *ngIf="pdfUrl">
      <embed [src]="pdfUrl" type="application/pdf" width="100%" height="600px">
    </div>
  `,
})
export class PdfViewerComponent implements OnInit {
  pdfUrl: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const pdfName = params['pdfName'];
      this.pdfUrl = `assets/PDFs/${pdfName}`;
    });
  }
}
