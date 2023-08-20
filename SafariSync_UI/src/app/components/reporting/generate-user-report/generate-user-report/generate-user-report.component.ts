import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Ratings } from 'src/app/models/user/ratings.model';
import { UserSkill } from 'src/app/models/user/userSkill.model';
import { SkillService } from 'src/app/services/skills/skills.service';
import { Skills } from 'src/app/models/skills/skills.model';
import { User1Service } from 'src/app/services/user/User1.service';

@Component({
  selector: 'app-generate-user-report',
  templateUrl: './generate-user-report.component.html',
  styleUrls: ['./generate-user-report.component.scss']
})
export class GenerateUserReportComponent {
  constructor(private userService: User1Service, private skillService: SkillService, private modalService: NgbModal, private formBuilder: FormBuilder) {
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

  ngOnInit(): void {
    this.GetAllUsers();
    this.GetAllRatings();
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
}
