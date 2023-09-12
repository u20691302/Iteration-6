import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Skills } from 'src/app/models/skills/skills.model';
import { Ratings } from 'src/app/models/user/ratings.model';
import { User } from 'src/app/models/user/user.model';
import { UserSkill } from 'src/app/models/user/userSkill.model';
import { SkillService } from 'src/app/services/skills/skills.service';
import { User1Service } from 'src/app/services/user/User1.service';
import { LinearScale, BarController, BarElement } from 'chart.js';
import { Report } from 'src/app/models/report/report.model';
import { UserService } from 'src/app/services/user/user.service';
import { UserStoreService } from 'src/app/services/user/user-store.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import 'jspdf-autotable'; // Import jspdf-autotable
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Chart from 'chart.js/auto';
import jsPDF, * as jspdf from 'jspdf';

// Import UserOptions from jspdf-autotable
import { UserOptions } from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

interface jsPDFWithPlugin extends jspdf.jsPDF {
  autotable: (options: UserOptions) => jspdf.jsPDF;
}

@Component({
  selector: 'app-generate-performance',
  templateUrl: './generate-performance.component.html',
  styleUrls: ['./generate-performance.component.scss'],
})
export class GeneratePerformanceComponent {
  data: any;
  @ViewChild('myTemp') myTempRef!: ElementRef;

  constructor(
    private reportsService: ReportsService,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private reportService: ReportsService,
    private userService: User1Service,
    private skillService: SkillService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private tyService: UserService,
    private storeService: UserStoreService
  ) {
    this.form = this.formBuilder.group({
      startDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required],
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
  generatedPdf: any;
  chartInstance: Chart | null = null; // Store the chart instance
  converted: any = '';
  pdfSrc: SafeResourceUrl = '';

  savePDf: any;



  name: string = '';
  surname: string = '';
  fullName: string = '';
  retrievedUserID: number = 0;

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
          skill_Description: '',
        },
      },
    ],
    password: '',
    profileImage: '',
    idImage: '',
    regDate: new Date(),
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
          skill_Description: '',
        },
      },
    ],
    password: '',
    profileImage: '',
    idImage: '',
    regDate: new Date(),
  };

  rating: Ratings = {
    rating_ID: 0,
    rating: 0,
  };

  userSkill: UserSkill[] = [
    {
      userSkill_ID: 0,
      user_ID: 0,
      skill_ID: 0,
      skills: {
        skill_ID: 0,
        skill_Name: '',
        skill_Description: '',
      },
    },
  ];

  saveReportRequest: Report = {
    report_ID: 0,
    report_Title: '',
    createdAt: new Date(),
    user_ID: 0,
    pdfUrl: '',
  };

  ngAfterViewInit(): void {
    // Register Chart.js modules
    Chart.register(LinearScale, BarController, BarElement);
  }

  ngOnInit(): void {
    this.GetAllUsers();

    this.storeService.getUserIdFromStore().subscribe((val) => {
      let idFromToken = this.tyService.getUserIdFromToken();
      this.retrievedUserID = val || idFromToken;
    });

    this.storeService.getFullNameFromStore().subscribe((val) => {
      let fullNameFromToken = this.tyService.getFullNameFromToekn();
      this.name = val || fullNameFromToken;
    });

    this.storeService.getSurnameFromStore().subscribe((val) => {
      let fullNameFromToken = this.tyService.getSurnameFromToken();
      this.surname = val || fullNameFromToken;
    });

    this.fullName = this.name + ' ' + this.surname;
  }

  GetAllUsers(): void {
    this.userService.getAllUsersReport(this.searchTerm).subscribe(
      (users) => {
        if (this.startDateTime == null || this.endDateTime == null || this.startDateTime > this.endDateTime) {
          this.users = users;
        } else {
          this.users = users.filter((user) => {
            const userRegDate = user.regDate;
            return userRegDate >= this.startDateTime! && userRegDate <= this.endDateTime!;
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetAllRatings(): void {
    this.userService.getAllRatings().subscribe({
      next: (ratings) => {
        this.ratings = ratings;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  GetAllSkills(): void {
    var filler = '';
    this.skillService.getAllSkills(filler).subscribe({
      next: (skills) => {
        this.skills = skills;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  OnSearch(): void {
    this.GetAllUsers();
  }

  ClearSearchTerm(): void {
    this.searchTerm = '';
    this.OnSearch();
  }

  LoadUser(id: number) {
    if (!isNaN(id)) {
      this.userService.loadUser(id).subscribe({
        next: (response) => {
          this.addUpdateUserRequest = response;
        },
      });
    }
  }

  loadSkillsIntoArray() {
    const filteredSkills = this.addUpdateUserRequest.userSkill
      ?.map((skillItem) => skillItem.skills)
      .filter((skills) => skills !== undefined) as Skills[];

    this.userSkills = filteredSkills;
    console.log(this.userSkill);
    this.isSkillListEmpty = this.userSkills.length === 0;
  }

  OpenSkillsModal(id: any, content: any, name: string, surname: string) {
    this.LoadUserSkill(id);
    this.LoadUser(id);
    this.userName = name + '' + surname;
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static',
    });
  }

  LoadUserSkill(id: number) {
    if (!isNaN(id)) {
      this.userService.loadUserSkill(id).subscribe({
        next: (response) => {
          this.userSkill = response;
        },
      });
    }
  }

  getNumberOfSkillsForUser(user: User): number {
    return user.userSkill?.length || 0;
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

  // Function to open the PDF modal and generate the report
  openPDFModal(content: any): void {
    // Open the modal
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static',
    });

    // Create the chart with data and add it to the PDF
    this.createChart(this.users);
  }

  createChart(data: any[]) {
    let labelsData: string[] = [];
    let labelsRatings: number[] = [];
    let labelNumSkills: number[] = [];






    

    data.forEach((element: User) => {
      labelsData.push(element.username);
      labelsRatings.push(element.ratings?.rating || 0);
      labelNumSkills.push(element.userSkill?.length || 0);
    });

    const canvas = document.getElementById('chart') as HTMLCanvasElement;

    // Check if the chart instance exists and destroy it if so
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    // Create a PDF instance
    const pdf = new (jsPDF );

    // Define the table data for the PDF
    const tableData = data.map((element) => [element.username, element.ratings?.rating || 0, element.userSkill?.length || 0]);

    // Add a table to the PDF
    pdf.autoTable({
      head: [['Username', 'Rating', '# of Skills']],
      body: tableData,
      startY: 10, // Adjust the starting position for the table
      margin: { top: 40 },
    });

    // Create a callback function to add the chart image after the PDF table is drawn
    const addChartImage = () => {
      // Use the toDataURL method to get the chart as a data URL
      const chartImage = canvas.toDataURL('image/png');
      pdf.addImage(chartImage, 'PNG', 10, 100, 180, 100); // Adjust the coordinates and dimensions as needed

      // Output the PDF as a Blob
      const pdfBlob = pdf.output('blob');

      // Convert the Blob to a SafeResourceUrl
      const pdfUrl = URL.createObjectURL(pdfBlob);

      this.generatedPdf = (this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl));

      this.savePDf = new Blob([pdf.output('blob')], { type: 'application/pdf' })

      const blobUrl = URL.createObjectURL(this.savePDf);
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);

      // Get the iframe element
      const pdfViewer = document.getElementById('pdfViewer') as HTMLIFrameElement;

      // Check if the pdfViewer element is not null before accessing its properties
      if (pdfViewer) {
        // Set the src attribute of the iframe to the PDF URL
        pdfViewer.src = pdfUrl;
      }
    };

    // Use Chart.js onComplete callback to ensure the chart is fully rendered
    this.chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labelsData,
        datasets: [
          {
            label: 'Rating',
            data: labelsRatings,
            borderWidth: 1,
            backgroundColor: '#869EC3', // Bar chart color
            order: 2, // Bar chart will be drawn below
          },
          {
            type: 'line',
            label: '# of Skills',
            data: labelNumSkills,
            borderWidth: 2,
            borderColor: '#CD1543', // Line chart color
            fill: false, // Disable fill for the line chart
            order: 1, // Line chart will be drawn on top
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        // Use Chart.js onComplete callback to ensure the chart is fully rendered
        animation: {
          onComplete: addChartImage,
        },
      },
    });
    this.SaveReport();
  }


  async SaveReport() {
  // Convert the base64 PDF data to a Blob
  const pdfBlob = this.base64ToBlob(this.saveReportRequest.pdfUrl, 'application/pdf');

  // Create an object URL from the Blob
  const blobUrl = URL.createObjectURL(pdfBlob);

  this.saveReportRequest = {
    report_ID: 0,
    report_Title: 'Performance Report',
    createdAt: new Date(),
    user_ID: this.retrievedUserID,
    pdfUrl: blobUrl, // Use the object URL
  };

  this.reportService.SaveReport(this.saveReportRequest)
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

// Function to convert base64 to Blob
base64ToBlob(base64Data: string, contentType: string): Blob {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
}

  
  

  // Function to save and download the report
  async DownloadReport() {
    // Create a PDF instance
    const pdf = new jsPDF();

    // Define the table data for the PDF
    const tableData = this.users.map((user) => [
      user.username,
      user.ratings?.rating || 0,
      user.userSkill?.length || 0,
    ]);

    // Add a table to the PDF
    pdf.autoTable({
      head: [['Username', 'Rating', '# of Skills']],
      body: tableData,
      startY: 10, // Adjust the starting position for the table
      margin: { top: 40 },
    });

    // Use the toDataURL method to get the chart as a data URL
    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    const chartImage = canvas.toDataURL('image/png');

    // Add the chart image to the PDF
    pdf.addImage(chartImage, 'PNG', 10, 100, 180, 100); // Adjust the coordinates and dimensions as needed

    // Save the PDF as a file with a specific name (e.g., "report.pdf")
    pdf.save('Performance Report' + ' ' + new Date());
  }
}
