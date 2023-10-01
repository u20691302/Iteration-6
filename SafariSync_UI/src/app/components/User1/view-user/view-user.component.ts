import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user/user.model';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { Ratings } from 'src/app/models/user/ratings.model';
import { UserSkill } from 'src/app/models/user/userSkill.model';
import { SkillService } from 'src/app/services/skills/skills.service';
import { Skills } from 'src/app/models/skills/skills.model';
import { User1Service } from 'src/app/services/user/User1.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

  constructor(private userService: User1Service, private skillService: SkillService, private modalService: NgbModal) { }

  users: User[] = [];
  ratings: Ratings[] = [];
  searchTerm: string = '';
  userName: string = '';
  skills: Skills[] = [];
  userSkills: Skills[] = [];
  isSkillListEmpty: boolean = true;
  selectedSkill: number | null = null;
  
  addUpdateUserRequest: User = {
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

  ngOnInit(): void {
    this.GetAllUsers();
    this.GetAllRatings();
  }

  GetAllUsers(): void {
    this.userService.getAllUsers(this.searchTerm).subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (response) => {
        console.log(response);
      }
    });
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

  openUpdateUserModal(id:number, content: any){
    this.LoadUser(id);
    this.GetAllSkills();
    this.loadSkillsIntoArray();
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
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
  
  
  deleteSkillFromArray(skill: Skills) {
    const index = this.userSkills.findIndex(s => s.skill_ID === skill.skill_ID);
    if (index !== -1) {
      this.userSkills.splice(index, 1);
    }
    this.isSkillListEmpty = this.userSkills.length === 0;
  }

  addSkillToArray() {
    if (this.selectedSkill) {
      const skillToAdd = this.skills.find(supplier => supplier.skill_ID === Number(this.selectedSkill));
      if (skillToAdd) {
        this.userSkills.push(skillToAdd);
        this.selectedSkill = null;
        this.isSkillListEmpty = this.userSkills.length === 0;
      }
    }
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

  OpenUpdateModal(content:any){
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  UpdateUser(success: any, failed: any) {
    this.userService.updateUser(this.addUpdateUserRequest.user_ID, this.addUpdateUserRequest).subscribe({
      next: (response) => {
        this. GetAllUsers();
        const modalRef = this.modalService.open(success, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      },
      error: (response) => {
        console.log(response);
        const modalRef = this.modalService.open(failed, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      }
    });
  }

  OpenUpdateConfirmDetailsModal(content: any) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.user = this.addUpdateUserRequest;
  }

  OpenConfirmationModal(content: any, form: NgForm) {
    form.ngSubmit.emit();
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  OpenDeleteModal(content: any, user: User) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.user = user;
  }

  DeleteUser(User_ID: number, success: any, failed: any, associationError: any) {
    this.userService.deleteUser(User_ID).subscribe({
      next: (response) => {
        this.users = this.users.filter(user => User_ID !== User_ID);
        this.ngOnInit();
      },
      error: (response) => {
        if (response && response.status === 500) {
          this.modalService.open(associationError, {
            size: 'dialog-centered',
            backdrop: 'static'
          });
        } else {
          this.modalService.open(failed, {
            size: 'dialog-centered',
            backdrop: 'static'
          });
        }
      }
    });
  }
}

