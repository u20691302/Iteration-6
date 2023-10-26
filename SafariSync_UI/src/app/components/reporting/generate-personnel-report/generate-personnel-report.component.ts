import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Contractor } from 'src/app/models/contractor/contractor.model';
import { Skills } from 'src/app/models/skills/skills.model';
import { Supplier } from 'src/app/models/supplier/supplier.model';
import { SupplierType } from 'src/app/models/supplier/supplierType.model';
import { Ratings } from 'src/app/models/user/ratings.model';
import { User } from 'src/app/models/user/user.model';
import { UserSkill } from 'src/app/models/user/userSkill.model';
import { ContractorService } from 'src/app/services/contractor/contractor.service';
import { SkillService } from 'src/app/services/skills/skills.service';
import { SupplierService } from 'src/app/services/supplier/supplier.service';
import { User1Service } from 'src/app/services/user/User1.service';

import { DomSanitizer, SafeResourceUrl, SafeUrl  } from '@angular/platform-browser';
import jsPDF, * as jspdf from 'jspdf';
import 'jspdf-autotable';
import {UserOptions} from "jspdf-autotable"
import { UserStoreService } from 'src/app/services/user/user-store.service';
import { UserService } from 'src/app/services/user/user.service';

interface jsPDFWithPlugin extends jspdf.jsPDF {
  autotable: (options: UserOptions) => jspdf.jsPDF;
}

@Component({
  selector: 'app-generate-personnel-report',
  templateUrl: './generate-personnel-report.component.html',
  styleUrls: ['./generate-personnel-report.component.scss']
})
export class GeneratePersonnelReportComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer,private userService: User1Service, private skillService: SkillService, private modalService: NgbModal, private supplierService: SupplierService, private contractorService: ContractorService, private userStore: UserStoreService, private userTyService: UserService) { }


  users: User[] = [];
  ratings: Ratings[] = [];
  searchTerm: string = '';
  searchTermSupplier: string = '';
  searchTermContractor: string = '';
  fullName: string = '';
  num: number = 0;
  allPersonnel: number = 0;
  public surname: string = "";




  userName: string = '';
  skills: Skills[] = [];
  userSkills: Skills[] = [];
  isSkillListEmpty: boolean = true;
  selectedSkill: number | null = null;

  suppliers: Supplier[] = [];
  supplierTypes: SupplierType[] = [];

  contractors: Contractor[] = [];

  generatedPdf: any;
  pdfSrc: SafeResourceUrl = '';

  downloadReport: jsPDF = new jsPDF('portrait', 'px', 'a4');

  user: User = {
    user_ID: 0,
    username: '',
    surname: '',
    email: '',
    idPassport: '',
    cellphone: '',
    role: '',
    rating_ID: 0,
    regDate: new Date(),
    userSkill: [
      {
        userSkill_ID: 0,
        user_ID: 0,
        skill_ID: 0,
        skills: {
          skill_ID: 0, 
          skill_Name: '',
          skill_Description: ''
        }
      }
    ],
    password: '', // Add the password property
    profileImage: '', // Add the profileImage property
    idImage: '' // Add the idImage property
  };

  rating: Ratings = {
    rating_ID: 0,
    rating: 0
  };

  userSkill: UserSkill[] = [
    {
      userSkill_ID: 0,
      user_ID: 0,
      skill_ID: 0,
      skills: {
        skill_ID: 0,
        skill_Name: '',
        skill_Description: ''
      }
    }
  ];

  supplier: Supplier = {
    supplier_ID: 0,
    supplier_Name: '',
    supplier_Phone_Number: '',
    supplier_Email_Address: '',
    supplier_Address: '',
    supplierType_ID: 0
  };

  supplierType: SupplierType = {
    supplierType_ID: 0,
    supplierType_Name: ''
  };





  ngOnInit(): void {
    this.GetAllUsers();
    this.GetAllSuppliers();
    this.GetAllContractors();
    //get the users name
    this.userStore.getFullNameFromStore().subscribe(val => {
      let fullNameFromToken = this.userTyService.getFullNameFromToekn();
      this.fullName = val || fullNameFromToken;
    });

    this.userStore.getSurnameFromStore().subscribe(val => {
      let surnamefromToken = this.userTyService.getSurnameFromToken();
      this.surname = val || surnamefromToken;
    });

  }

  GetAllUsers(): void {
    this.userService.getAllUsers(this.searchTerm).subscribe({
      next: (users) => {
        this.users = users;
        console.log(this.users)
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  ClearSearchTerm(): void {
    this.searchTerm = '';
    this.OnSearch();
  }

  OnSearch(): void {
    this.GetAllUsers();
  }

  GetAllSuppliers(): void {
    this.supplierService.getAllSuppliers(this.searchTermSupplier).subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  ClearSearchTermSupplier(): void {
    this.searchTermSupplier = '';
    this.OnSearchSupplier();
  }

  OnSearchSupplier(): void {
    this.GetAllSuppliers();
  }

  GetAllContractors(): void {
    this.contractorService.getAllContractors(this.searchTermContractor).subscribe({
      next: (contractors) => {
        this.contractors = contractors;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  ClearSearchTermContractor(): void {
    this.searchTermContractor = '';
    this.OnSearchSupplier();
  }

  OnSearchContractor(): void {
    this.GetAllContractors();
  }

  ////////////////////////////////
  //////////////////////////////
  ///////////////////////////////
  ///////////////////////////////

  generatePDF() {
    const doc = new (jspdf as any).jsPDF('portrait', 'px', 'a4');
  
    const fullnamee = "Generated By: " + this.fullName + " " + this.surname;
    const date = "Date Generated: " + new Date();
    const title = "Report Name: " + "Personnel Report";

    function addHeader(doc: any, isFirstPage: boolean) {
      const headerText = 'SafariSync';
      const headerHeight = 30;
      const headerColor = '#001844';

    const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(12);
        doc.setTextColor(255);
        doc.setFillColor(headerColor);
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), headerHeight, 'F');
  
        // Calculate the width of the text
        const textWidth = doc.getStringUnitWidth(headerText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  
        // Calculate the x position to center the text
        const xPosition = (doc.internal.pageSize.getWidth() - textWidth) / 2;
  
        doc.text(headerText, xPosition, headerHeight / 2);
  
        // Add titles only on the first page
        if (isFirstPage) {
          const titles = [title, fullnamee, date];
          const titleFontSize = 12;
          const titleSpacing = 1; // Adjust the spacing between titles
          const titleStartY = headerHeight + 20; // Adjust the initial Y position
  
          doc.setFontSize(titleFontSize);
          doc.setTextColor(0); // Set title text color to black
  
          // Add different titles underneath each other
          for (let j = 0; j < titles.length; j++) {
            const title = titles[j];
            const titleY = titleStartY + j * (titleFontSize + titleSpacing);
            const titleXPosition = 10; // Adjust this value as needed
            doc.text(title, titleXPosition, titleY);
          }
        }
      }
    }
  
    function addFooter(doc: any) {
      const footerHeight = 30;
      const footerColor = '#FF0000'; // Red color
    
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(footerColor);
        doc.rect(0, doc.internal.pageSize.getHeight() - footerHeight, doc.internal.pageSize.getWidth(), footerHeight, 'F');
        doc.setFontSize(12);
        doc.setTextColor(255);
        doc.text("EPI-USE", 10, doc.internal.pageSize.getHeight() - footerHeight / 2);
    
        // Add the image to the bottom right of the footer
        const imageWidth = 50; // Adjust the width of the image as needed
        const imageHeight = 20; // Adjust the height of the image as needed
        const imageX = doc.internal.pageSize.getWidth() - imageWidth - 10; // Adjust the X position
        const imageY = doc.internal.pageSize.getHeight() - footerHeight + (footerHeight - imageHeight) / 2;
        doc.addImage('/assets/EPI-USE/EPI-USE Logo.jpg', 'jpg', imageX, imageY, imageWidth, imageHeight);
      }
    }
  
    let startY = 80;
  addHeader(doc, true);

  const combinedData: string[][] = []; // This array will store combined data for all personnel

  // Combine data from users, suppliers, and contractors into a single array
  this.users.forEach((user) => {
    combinedData.push([user.username]); // Update data fields here
  });

  this.suppliers.forEach((supplier) => {
    combinedData.push([supplier.supplier_Name]); // Update data fields here
  });

  this.contractors.forEach((contractor) => {
    combinedData.push([contractor.contractor_Name]); // Update data fields here
  });

  // Generate the table with combined data
  doc.autoTable({
    head: [['Name']],
    body: combinedData,
    startY: startY,
    didDrawRow: function (data: any) {
      if (data.row.index === combinedData.length - 1) {
        data.row.styles.fontStyle = 'bold';
      }
    },
  });

  // Generate the totals table as before
  startY = this.generateTotalsTable(doc, startY, this.calculateTotalQuantityUsers(), this.calculateTotalQuantityExternal());

  // Add footer as per your existing code
  addFooter(doc);

  this.generatedPdf = new Blob([doc.output('blob')], { type: 'application/pdf' });

  const blobUrl = URL.createObjectURL(this.generatedPdf);
  this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);

  this.downloadReport = doc;
}
  
  








generateTotalsTable(doc: any, startY: number, totalUsers: number, totalExternal: number) {
  const tableData = [];
  const header = ['Total Internal Personnel', 'Total External Personnel'];

  // Push header row
  tableData.push(header);

  const totalsRow = [
    totalUsers.toString(),
    totalExternal.toString()
  ];
  tableData.push(totalsRow);

  const headerStyles = {
    fillColor: '#FF0000', // RGB color for the header background
    textColor: 255, // Text color (white)
    fontStyle: 'bold' // Bold font style for the header
  };

  doc.autoTable({
    head: [header],
    body: tableData.slice(1),
    startY: startY,
    theme: 'grid', // Use the 'grid' theme for the table
    headStyles: headerStyles // Apply the header styles
  });

  // Update startY for the next content
  return doc.autoTable.previous.finalY + 20;
}






OpenPDFModal(content: any) {
  const modalRef = this.modalService.open(content, {
    size: 'dialog-centered',
    backdrop: 'static'
  });
}

downloadPDF() {
  this.downloadReport.save('Personnel Report');
}

calculateTotalQuantityUsers(): number {
  return this.users.length;
}

calculateTotalQuantityExternal(): number {
  this.num = this.suppliers.length + this.contractors.length;
  return this.num;
}

calculateTotalQuantityPersonnel(): number {
  this.allPersonnel = this.suppliers.length + this.contractors.length + this.users.length;
  return this.allPersonnel;
}

}
