import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/activity/activity.model';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivityTask } from 'src/app/models/activity/activityTask.model';
import { Observable, tap } from 'rxjs';
import { TaskS } from 'src/app/models/activity/task.model';
import { Skills } from 'src/app/models/skills/skills.model';
import { SkillService } from 'src/app/services/skills/skills.service';

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.scss']
})

export class ViewActivityComponent implements OnInit {

  constructor(private activityService: ActivityService, private skillService: SkillService, private modalService: NgbModal) { }

  activities: Activity[] = [];
  activityName = "";
  activityTask: ActivityTask[] = [];
  tasks: TaskS[] = [];
  filteredTasks: ActivityTask[] = [];
  addUpdateTasks: TaskS[] = [];
  skills: Skills[] = []
  searchTerm: string = '';
  searchTaskTerm: string = '';
  isAddMode: boolean = true;

  addUpdateActivityRequest: Activity = {
    activity_ID: 0,
    activity_Name: '',
    activity_Description: '',
    activityTask: [
      {
        activityTask_ID: 0,
        activity_ID: 0,
        task_ID: 0,
        task: {
          task_ID: 0,
          task_Name: '',
          task_Description: '',
          skill_ID: 0,
          skill: {
            skill_ID: 0,
            skill_Name: '',
            skill_Description: ''
          },
        },
      },
    ],
  };

  Activity: Activity = {
    activity_ID: 0,
    activity_Name: '',
    activity_Description: '',
    activityTask: [
      {
        activityTask_ID: 0,
        activity_ID: 0,
        task_ID: 0,
        task: {
          task_ID: 0,
          task_Name: '',
          task_Description: '',
          skill_ID: 0,
          skill: {
            skill_ID: 0,
            skill_Name: '',
            skill_Description: ''
          },
        },
      },
    ],
  };

  AddUpdateActivityTaskRequest: ActivityTask = {
    activityTask_ID: 0,
    activity_ID: 0,
    task_ID: 0
  };

  addUpdateTaskRequest: TaskS = {
    task_ID: 0,
    task_Name: '',
    task_Description: '',
    skill_ID: 0,
    skill: {
      skill_ID: 0,
      skill_Name: '',
      skill_Description: ''
    }
  }

  Task: TaskS = {
    task_ID: 0,
    task_Name: '',
    task_Description: '',
    skill_ID: 0,
    skill: {
      skill_ID: 0,
      skill_Name: '',
      skill_Description: ''
    }
  }

  ngOnInit(): void {
    this.GetAllActivity();
  }

  GetAllActivity(): void {
    this.activityService.getAllActivity(this.searchTerm).subscribe({
      next: (activities) => {
        this.activities = activities;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  OnSearch(): void {
    this.GetAllActivity();
  }

  ClearSearchTerm(): void {
    this.searchTerm = '';
    this.OnSearch();
  }

  OpenAddModal(content:any){
    this.isAddMode = true;
    this.addUpdateActivityRequest = {
      activity_ID: 0,
      activity_Name: '',
      activity_Description: '',
      activityTask:[]
    };
    this.addUpdateTasks = [];
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  AddActivity(success: any, failed:any) {
    this.Activity = {
      activity_ID: 0,
      activity_Name: this.addUpdateActivityRequest.activity_Name,
      activity_Description: this.addUpdateActivityRequest.activity_Description,
      activityTask:[]
    };
    this.activityService.AddActivity(this.Activity).subscribe({
      next: (activity: Activity) => {
        this.ngOnInit();
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

  LoadActivity(id:number, content: any){
    this.isAddMode = false;
    if (!isNaN(id)) {
      this.activityService.loadActivity(id)
      .subscribe({
        next: (response) => {
          this.addUpdateActivityRequest = response;
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

  UpdateActivity(success: any, failed:any) {
    this.addUpdateActivityRequest = {
      activity_ID: this.addUpdateActivityRequest.activity_ID,
      activity_Name: this.addUpdateActivityRequest.activity_Name,
      activity_Description: this.addUpdateActivityRequest.activity_Description,
      activityTask:[]
    };
    this.activityService.updateActivity(this.addUpdateActivityRequest).subscribe({
      next: (activity: Activity) => {
        this.ngOnInit();
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
    this.Activity = this.addUpdateActivityRequest;
  }

  OpenDeleteModal(content: any, activity: Activity) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.Activity = activity;
  }

  DeleteActivity(activityID: number, success: any, failed: any) {
    this.activityService.deleteActivity(activityID).subscribe({
      next: (response) => {
        this.activities = this.activities.filter(activities => activities.activity_ID !== activityID);
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

  LoadActivityTask(id:number): void {
    this.activityService.LoadActivityTask(id).subscribe({
      next: (activityTasks) => {
        this.AddUpdateActivityTaskRequest = activityTasks;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }
  
  openTaskModel(id: number, content: any){
    this.LoadTask(id);
    this.GetAllSkills();
    const modalRef = this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });
  }

  LoadTask(id: number) {
    this.isAddMode = false;
    if (!isNaN(id)) {
      this.activityService.loadActivity(id).subscribe({
        next: (response) => {
          this.addUpdateActivityRequest = response;
          console.log(response)
          this.activityName = this.addUpdateActivityRequest.activity_Name;
          
          this.filterTasksBySearchTerm(this.addUpdateActivityRequest.activityTask);
        }
      });
    }
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

  filterTasksBySearchTerm(tasks: ActivityTask[]): void {
    if (!this.searchTaskTerm || this.searchTaskTerm.trim() === '') {
      this.filteredTasks = tasks
    }
    const lowercaseSearchTerm = this.searchTaskTerm.toLowerCase();

    this.filteredTasks=tasks.filter(task =>
      task.task &&
      (task.task.task_Name.toLowerCase().includes(lowercaseSearchTerm) ||
      task.task.task_Description.toLowerCase().includes(lowercaseSearchTerm)) ||
      task.task?.skill?.skill_Name.toLowerCase().includes(lowercaseSearchTerm)
    );
  }

  ClearTaskSearchTerm(): void {
    this.searchTaskTerm = '';
    this.filterTasksBySearchTerm(this.addUpdateActivityRequest.activityTask)
  }
  
  OpenActivityTaskDeleteModal(content: any, id:number) {
    this.LoadActivityTask(id);
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.Activity = this.addUpdateActivityRequest;
  }

  ConfirmActivityTaskDelete(activityID: number, success: any, LastTaskError: any, failed: any) {
    this.DeleteActivityTask(activityID).subscribe({
      next: (response) => {
        this.modalService.open(success, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      },
      error: (response) => {
        if (response && response.status === 500) {
          this.modalService.open(LastTaskError, {
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

  DeleteActivityTask(activityTaskID: number): Observable<any> {
    return this.activityService.deleteActivityTask(activityTaskID).pipe(
      tap({
        next: (response) => {
          this.filteredTasks = this.filteredTasks.filter(filteredTasks => filteredTasks.activityTask_ID !== activityTaskID);
          this.addUpdateActivityRequest.activityTask = this.addUpdateActivityRequest.activityTask?.filter(
            (task) => task.activityTask_ID !== activityTaskID
          );
        },
        error: (response) => {
          console.log(response);
        }
      })
    );
  }

  OpenTaskAddModal(content:any){
    this.isAddMode = true;
    this.addUpdateTaskRequest = {
      task_ID: 0,
      task_Name: '',
      task_Description: '',
      skill_ID: 0
    };
    this.addUpdateTasks = [];
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  AddTask(success: any, failed: any) {
    this.Task = {
      task_ID: 0,
      task_Name: this.addUpdateTaskRequest.task_Name,
      task_Description: this.addUpdateTaskRequest.task_Description,
      skill_ID: this.addUpdateTaskRequest.skill_ID
    };
    
    const id = this.addUpdateActivityRequest.activity_ID;
    this.activityService.AddTask(this.Task, id).subscribe({
      next: (task: TaskS) => {
        this.LoadTask(id);
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
  
  LoadTaskToUpdate(id:number, content: any){
    this.isAddMode = false;
    if (!isNaN(id)) {
      this.activityService.loadTask(id)
      .subscribe({
        next: (response) => {
          this.addUpdateTaskRequest = response;
          const modalRef = this.modalService.open(content, {
            size: 'dialog-centered',
            backdrop: 'static'
          });
        }
      })
    }
  }

  OpenUpdateTaskModal(content:any){
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  UpdateTask(success: any, failed:any) {
    this.addUpdateTaskRequest = {
      task_ID: this.addUpdateTaskRequest.task_ID,
      task_Name: this.addUpdateTaskRequest.task_Name,
      task_Description: this.addUpdateTaskRequest.task_Description,
      skill_ID: this.addUpdateTaskRequest.skill_ID
    };
    this.activityService.updateTask(this.addUpdateTaskRequest).subscribe({
      next: (task: TaskS) => {
        this.LoadTask(this.addUpdateActivityRequest.activity_ID);
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

  OpenAddUpdateTaskConfirmDetailsModal(content: any) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.Task = this.addUpdateTaskRequest;
  }
}
