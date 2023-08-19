import { Component, OnInit } from '@angular/core';
import { Skills } from 'src/app/models/skills/skills.model';
import { SkillService } from 'src/app/services/skills/skills.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-view-skill',
  templateUrl: './view-skills.component.html',
  styleUrls: ['./view-skills.component.scss']
})
export class ViewSkillsComponent implements OnInit {

  constructor(private skillService: SkillService, private modalService: NgbModal) { }

  skills: Skills[] = [];
  searchTerm: string = '';
  isAddMode: boolean = true;
  output: string = '';

  addUpdateSkillRequest: Skills = {
    skill_ID: 0,
    skill_Name: '',
    skill_Description: ''
  };

  skill: Skills = {
    skill_ID: 0,
    skill_Name: '',
    skill_Description: ''
  };

  ngOnInit(): void {
    this.GetAllSkills();
  }

  GetAllSkills(): void {
    this.skillService.getAllSkills(this.searchTerm).subscribe({
      next: (skills) => {
        this.skills = skills;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  OnSearch(): void {
    this.GetAllSkills();
  }

  ClearSearchTerm(): void {
    this.searchTerm = '';
    this.OnSearch();
  }
  
  OpenAddModal(content:any){
    this.isAddMode = true;
    this.addUpdateSkillRequest = {
      skill_ID: 0,
      skill_Name: '',
      skill_Description: '',
    };
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  AddSkill(success: any, failed: any) {
    console.log(this.addUpdateSkillRequest)
    this.skillService.AddSkill(this.addUpdateSkillRequest).subscribe({
      next: (addUpdateSkillRequest: Skills) => {
        this. ngOnInit();
        const modalRef = this.modalService.open(success, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      },
      error: (response: any) => {
        console.log(response);
        const modalRef = this.modalService.open(failed, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      }
    });
  }

  LoadSkill(id:number, content: any){
    this.isAddMode = false;
    if (!isNaN(id)) {
      this.skillService.loadSkill(id)
      .subscribe({
        next: (response) => {
          this.addUpdateSkillRequest = response;
          const modalRef = this.modalService.open(content, {
            size: 'dialog-centered',
            backdrop: 'static'
          });
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

  UpdateSkill(success: any, failed: any) {
    this.skillService.updateSkill(this.addUpdateSkillRequest.skill_ID, this.addUpdateSkillRequest).subscribe({
      next: (response) => {
        this. GetAllSkills();
        const modalRef = this.modalService.open(success, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      },
      error: (response: any) => {
        console.log(response);
        const modalRef = this.modalService.open(failed, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      }
    });
  }

  OpenAddUpdateConfirmDetailsModal(content: any) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.skill = this.addUpdateSkillRequest;
  }

  OpenConfirmationModal(content: any, form: NgForm) {
    form.ngSubmit.emit();
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  OpenDeleteModal(content: any, skill: Skills) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.skill = skill;
  }

  DeleteSkill(skillID: number, success: any, failed: any, associationError: any) {
    this.skillService.deleteSkill(skillID).subscribe({
      next: (response) => {
        this.skills = this.skills.filter(skill => skill.skill_ID !== skillID);
        const modalRef = this.modalService.open(success, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      },
      error: (response) => {
        if (response && response.status === 400) {
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
