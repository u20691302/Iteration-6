import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Skills } from 'src/app/models/skills/skills.model';
import { Ratings } from 'src/app/models/user/ratings.model';
import { User } from 'src/app/models/user/user.model';
import { UserSkill } from 'src/app/models/user/userSkill.model';
import { SkillService } from 'src/app/services/skills/skills.service';
import { User1Service } from 'src/app/services/user/User1.service';
import { CategoryScale } from 'chart.js';
import { Chart, ChartData, LinearScale } from 'chart.js';
import { BarController, BarElement } from 'chart.js';
import { Report } from 'src/app/models/report/report.model';
import { UserService } from 'src/app/services/user/user.service';
import { UserStoreService } from 'src/app/services/user/user-store.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import jsPDF, * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-generate-performance',
  templateUrl: './generate-performance.component.html',
  styleUrls: ['./generate-performance.component.scss']
})
export class GeneratePerformanceComponent {
  
  @ViewChild('barChart') private chartRef!: ElementRef;
  @ViewChild('chartModal') private chartModal!: ElementRef; 

  private chart!: Chart;
 
  chartData: ChartData = {
    labels: [],
    datasets: []
  };

  constructor(private sanitizer: DomSanitizer, private reportService: ReportsService, private userService: User1Service, private skillService: SkillService, private modalService: NgbModal, private formBuilder: FormBuilder, private tyService: UserService, private storeService: UserStoreService) {
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
  generatedPdf: any;

  name: string = '';
  surname: string = '';
  fullName: string = '';
  retrievedUserID: number = 0;
  downloadReport: jsPDF = new jsPDF('portrait', 'px', 'a4');
  
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

    this.storeService.getUserIdFromStore().subscribe(val => {
      let idFromToken = this.tyService.getUserIdFromToken();
      this.retrievedUserID = val || idFromToken;
    });

    this.storeService.getFullNameFromStore().subscribe(val => {
      let fullNameFromToken = this.tyService.getFullNameFromToekn();
      this.name = val || fullNameFromToken;
    });

    this.storeService.getSurnameFromStore().subscribe(val => {
      let fullNameFromToken = this.tyService.getSurnameFromToken();
      this.surname = val || fullNameFromToken;
    });

    this.fullName = this.name + ' ' + this.surname;
  }

  GetAllUsers(): void {
    this.userService.getAllUsers(this.searchTerm).subscribe(
      (users) => {
        if (this.startDateTime == null || this.endDateTime == null)  {
          this.users = users;
        }
        else {
          this.users = users.filter(user => {
            const userRegTimestamp = new Date(user.regDate).getTime();
          
            // Normalize timezones for startDateTime and endDateTime
            const startTimestamp = this.startDateTime instanceof Date ? this.startDateTime.getTime() : 0;
            const endTimestamp = this.endDateTime instanceof Date ? this.endDateTime.getTime() : Number.MAX_SAFE_INTEGER;
          
            return userRegTimestamp >= startTimestamp && userRegTimestamp <= endTimestamp;
          });
        }
  
        console.log(this.users);
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








  createChart(): void {
    Chart.register(LinearScale); // Register LinearScale here
    Chart.register(BarController,BarElement); // Register BarController here
    Chart.register(CategoryScale); // Register CategoryScale here
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: this.chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }





  openChartModal(): void {
    if (this.chartModal) {
      const modalRef = this.modalService.open(this.chartModal, {
        size: 'lg',
        centered: true
      });
  
      modalRef.result.then(
        (result) => {
          // Modal closed
        },
        (reason) => {
          // Modal dismissed
        }
      );
  
      // Delay chart creation to ensure modal is fully displayed
      setTimeout(() => {
        this.createChart();
      }, 300);
    }
  }

  refreshChart(): void {
    // Update your chart data here if needed
    this.chart.update();
  }








  OpenPDFModal(content: any) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
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
  
  downloadPDF() {
    this.downloadReport.save('Equipment Report' + ' ' + new Date());
  }
}
