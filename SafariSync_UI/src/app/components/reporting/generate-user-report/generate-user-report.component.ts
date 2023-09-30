import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Ratings } from 'src/app/models/user/ratings.model';
import { UserSkill } from 'src/app/models/user/userSkill.model';
import { SkillService } from 'src/app/services/skills/skills.service';
import { Skills } from 'src/app/models/skills/skills.model';
import { User1Service } from 'src/app/services/user/User1.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { Report } from 'src/app/models/report/report.model';
import { UserStoreService } from 'src/app/services/user/user-store.service';
import { UserService } from 'src/app/services/user/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import jsPDF, * as jspdf from 'jspdf';
import 'jspdf-autotable';
import {UserOptions} from "jspdf-autotable"


interface jsPDFWithPlugin extends jspdf.jsPDF {
  autotable: (options: UserOptions) => jspdf.jsPDF;
}

@Component({
  selector: 'app-generate-user-report',
  templateUrl: './generate-user-report.component.html',
  styleUrls: ['./generate-user-report.component.scss']
})
export class GenerateUserReportComponent {
  constructor(private sanitizer: DomSanitizer, private userStore: UserStoreService, private userService: User1Service, private UserTy: UserService, private reportsService: ReportsService, private skillService: SkillService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      startDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required]
    });
   }

  users: User[] = [];
  ratings: Ratings[] = [];
  searchTerm: string = '';
  userName: string = '';
  skills: Skills[] = [];
  userSkills: Skills[] = [];
  isSkillListEmpty: boolean = true;
  selectedSkill: number | null = null;
  startDateTime: Date | null = null;
  endDateTime: Date | null = null;
  form: FormGroup;
  retrievedUserID: number = 0;

  generatedPdf: any;
  pdfSrc: SafeResourceUrl = '';
  downloadReport: jsPDF = new jsPDF('portrait', 'px', 'a4');

  name: string = '';
  surname: string = '';
  fullName: string = '';
  
  addUpdateUserRequest: User = {
    user_ID: 0,
    username: '',
    surname: '',
    email: '',
    idPassport: '',
    cellphone: '',
    role: '',
    rating_ID: 0,
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
    password: '', 
    profileImage: '',
    idImage: '',
    regDate: new Date()
  };
  
  user: User = {
    user_ID: 0,
    username: '',
    surname: '',
    email: '',
    idPassport: '',
    cellphone: '',
    role: '',
    rating_ID: 0,
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
    password: '',
    profileImage: '', 
    idImage: '',
    regDate: new Date()
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

  saveReportRequest: Report = {
    report_ID: 0,
    report_Title: '',
    createdAt: new Date(),
    user_ID: 0,
    pdfUrl: ''
  };
  
  ngOnInit(): void {
    this.GetAllUsers();
    this.GetAllRatings();
    

    this.userStore.getUserIdFromStore().subscribe(val => {
      let idFromToken = this.UserTy.getUserIdFromToken();
      this.retrievedUserID = val || idFromToken;
    });

    this.userStore.getFullNameFromStore().subscribe(val => {
      let fullNameFromToken = this.UserTy.getFullNameFromToekn();
      this.name = val || fullNameFromToken;
    });

    this.userStore.getSurnameFromStore().subscribe(val => {
      let fullNameFromToken = this.UserTy.getSurnameFromToken();
      this.surname = val || fullNameFromToken;
    });

    this.fullName = this.name + ' ' + this.surname;
  }

  GetAllUsers(): void {
    this.userService.getAllUsers(this.searchTerm).subscribe(
      (users) => {
        if (this.startDateTime == null || this.endDateTime == null || this.startDateTime > this.endDateTime) {
          this.users = users;
        } else {
          this.users = users.filter(user => {
            const userRegDate = user.regDate || 0;
            return userRegDate >= this.startDateTime! && userRegDate <= this.endDateTime!;
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  clearDatePickers(): void {
    this.startDateTime = null;
    this.endDateTime = null;
    this.GetAllUsers();
  }

  GetAllRatings(): void {
    this.userService.getAllRatings().subscribe({
      next: (ratings) => {
        this.ratings = ratings;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  GetAllSkills(): void {
    var filler = "";
    this.skillService.getAllSkills(filler).subscribe({
      next: (skills) => {
        this.skills = skills;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  OnSearch(): void {
    this.GetAllUsers();
  }

  ClearSearchTerm(): void {
    this.searchTerm = '';
    this.OnSearch();
  }

  LoadUser(id:number){
    if (!isNaN(id)) {
      this.userService.loadUser(id)
      .subscribe({
        next: (response) => {
          this.addUpdateUserRequest = response;
        }
      })
    }
  }

  loadSkillsIntoArray() {
    const filteredSkills = this.addUpdateUserRequest.userSkill
      ?.map(skillItem => skillItem.skills)
      .filter(skills => skills !== undefined) as Skills[];
    
    this.userSkills = filteredSkills;
    console.log(this.userSkill)
    this.isSkillListEmpty = this.userSkills.length === 0;
  }
  
  OpenSkillsModal(id: any, content:any, name: string, surname: string){
    this.LoadUserSkill(id);
    this.LoadUser(id);
    this.userName = name + '' + surname;
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  LoadUserSkill(id:number){
    if (!isNaN(id)) {
      this.userService.loadUserSkill(id)
      .subscribe({
        next: (response) => {
          this.userSkill = response;
        }
      })
    }
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

  generatePDF() {
    const doc = new (jspdf as any).jsPDF('portrait', 'px', 'a4');

    const fullnamee = "Generated By: " + this.fullName;
    const date = "Date Generated: " + new Date(); 
    const title = "Report Name: " + "Stock Report"; 

  
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
    
  
    let startY = 80; // Initialize the startY position (including space after header)
    addHeader(doc, true); // Pass true for the first page
  
    // Start with the first stock item
    if (this.users.length > 0) {
      const firstStock = this.users[0];
  
      // Add stock table
      this.addUserTable(doc, firstStock, startY);
      startY = doc.autoTable.previous.finalY + 0; // Update startY with spacing
  
      // Add supplier table
      this.addSkillTable(doc, firstStock, startY);
      startY = doc.autoTable.previous.finalY + 50; // Update startY with spacing
    }
  
    // Iterate through stocks and generate tables, starting from the second stock
    for (let i = 1; i < this.users.length; i++) {
      const stock = this.users[i];
  
      // Add stock table
      this.addUserTable(doc, stock, startY);
      startY = doc.autoTable.previous.finalY + 0; // Update startY with spacing
  
      // Add supplier table
      this.addSkillTable(doc, stock, startY);
      startY = doc.autoTable.previous.finalY + 50; // Update startY with spacing
    }
  
    addFooter(doc);

    this.generatedPdf = new Blob([doc.output('blob')], { type: 'application/pdf' });

    const blobUrl = URL.createObjectURL(this.generatedPdf);
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);

    this.downloadReport = doc;
    this.SaveReport();
  }

  // Add stock table
  // Modify the addStockTable function
addUserTable(doc: any, user: User, startY: number) {
  const tableData = [];
  const header = ['User ID', 'Name', 'Surname', 'Email', 'ID/Passport Number', 'Cellphone', 'Role', 'Ratings', 'Date Registered'];

  // Push header row
  tableData.push(header);

  // Add stock row
  const userRow = [
    user.user_ID.toString(),
    user.username,
    user.surname,
    user.email,
    user.idPassport,
    user.cellphone,
    user.role,
    user.ratings?.rating,
    user.regDate
  ];
  tableData.push(userRow);

  // Create a table using autotable function
  doc.autoTable({
    head: [header],
    body: [userRow],
    startY: startY + 20, // Add 20 pixels to the startY position
    headStyles: { fillColor: '#FF0000' }// Set the header color

  });
}

// Modify the addSupplierTable function
addSkillTable(doc: any, user: User, startY: number) {
  if (user.userSkill && user.userSkill.length > 0) {
    const tableData: any[] = []; // Explicitly define the type here
    const header = ['Skill ID', 'Skill Name', 'Skill Description'];

    let isFirstSupplierTable = true; // Flag to track the first supplier table

    // Iterate through suppliers and populate table data
    user.userSkill?.forEach(skillItem => {
      if (isFirstSupplierTable) {
        tableData.push(header);
        isFirstSupplierTable = false;
      }

      const skillRow = [
        skillItem.skills?.skill_ID,
        skillItem.skills?.skill_Name,
        skillItem.skills?.skill_Description
      ];
      tableData.push(skillRow);
    });

    // Create a table using autotable function
    doc.autoTable({
      head: [header], // Include the header here only once
      body: tableData.slice(1), // Exclude the duplicated header from data
      startY: startY + 20,// Add 20 pixels to the startY position
      headStyles: { fillColor: '#869EC3' }// Set the header color
    });
  }
}

OpenPDFModal(content:any){
  const modalRef = this.modalService.open(content, {
    size: 'dialog-centered',
    backdrop: 'static'
  });
}

downloadPDF(){
  this.downloadReport.save('Stock Report' + ' ' + new Date())
}

  async SaveReport() {
  const blobUrl = URL.createObjectURL(this.generatedPdf);

  // Convert the blob URL to base64
  const pdfBlob = await fetch(blobUrl).then(response => response.blob());
  const pdfBlobBuffer = await pdfBlob.arrayBuffer();
  const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBlobBuffer)));

  this.saveReportRequest = {
    report_ID: 0,
    report_Title: 'Employee Report',
    createdAt: new Date(),
    user_ID: this.retrievedUserID,
    pdfUrl: pdfBase64 // Add the serialized PDF data here
  };

  this.reportsService.SaveReport(this.saveReportRequest)
    .subscribe(
      (response) => {
        console.log('Report saved successfully:', response);
        // Handle success, you can show a success message or perform other actions
      },
      (error) => {
        console.error('Error saving report:', error);
        // Handle error, you can show an error message or perform other actions
      }
    );
}
}
