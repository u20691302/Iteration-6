import { Component, OnInit } from '@angular/core';
import { ScheduledActivityService } from 'src/app/services/scheduleActivity/schedule-activity.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScheduledActivityScheduledTask } from 'src/app/models/scheduledActivity/scheduledActivityScheduledTask';
import { ScheduledTaskUser } from 'src/app/models/scheduledActivity/scheduledTaskUser.model';
import { ScheduledTaskContractor } from 'src/app/models/scheduledActivity/scheduleTaskContractor.model';
import { ScheduledActivity } from 'src/app/models/scheduledActivity/scheduledActivity.model';
import { Activity } from 'src/app/models/activity/activity.model';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { User } from 'src/app/models/user/user.model';
import { ActivityTask } from 'src/app/models/activity/activityTask.model';
import { User1Service } from 'src/app/services/user/User1.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-view-schedule-activity',
  templateUrl: './view-schedule-activity.component.html',
  styleUrls: ['./view-schedule-activity.component.scss']
})

export class ViewScheduleActivityComponent implements OnInit{

  constructor(private userService: User1Service, private scheduledActivityService: ScheduledActivityService, private activityService: ActivityService, private modalService: NgbModal, private formBuilder: FormBuilder, private route: ActivatedRoute, private userTyService: UserService) { 
    this.form = this.formBuilder.group({
      startDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required]
    });
  }

  scheduledActivities: ScheduledActivity [] = [];
  filteredTasks: ScheduledActivityScheduledTask[] = [];
  scheduledTaskUser: ScheduledTaskUser [] = [];
  scheduledTaskContractor: ScheduledTaskContractor [] = [];
  activityName = "";
  taskName = ""
  searchTerm: string = '';
  searchTaskTerm: string = '';
  isAddMode: boolean = true;
  activities: Activity[] = [];
  selectedActivity: number | null = null;
  startDateTime: Date = new Date();
  endDateTime: Date = new Date();
  users: User[] = [];
  selectedSupervisor: number | null = null;
  filtered: ActivityTask[] = [];
  form: FormGroup;
  public savedRoute: string = "shap";  // Variable to store the saved route


  employees: User[] = [];
  addUpdateEmployee: User[] = [];
  selectedEmployee: number | null = null;
  isEmployeeListEmpty: boolean = true;

  addUpdateScheduledActivityRequest: ScheduledActivity = {
    scheduledActivity_ID: 0,
      startDate: new Date(),
      endDate: new Date(),
      activity_Location: '',
      userId: 0,
      activityStatus_ID: 0,
      activity_ID: 0,
      users: {
        user_ID: 0,
        username: '',
        surname: '',
        email: '',
        idPassport: '',
        cellphone: '',
        role: '',
        rating_ID: 0,
        password: '',
        profileImage: '', 
        idImage: '',
        regDate: new Date()
      },
      activityStatus: {
        activityStatus_ID: 0,
        activity_Status: '',
      },
      activity: {
        activity_ID: 0,
        activity_Name: '',
        activity_Description: '',
        activityTask: []
      },
      scheduledActivityScheduledTask: [
        {
        scheduledActivityScheduledTask_ID: 0,
        scheduledActivity_ID: 0,
        scheduledTask_ID: 0,
        scheduledTask: {
          scheduledTask_ID: 0,
          startDate: new Date(),
          endDate: new Date(),
          taskStatus: '',
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
            }
          }
        }
      }
    ],
  };

  ScheduledActivity: ScheduledActivity = {
    scheduledActivity_ID: 0,
      startDate: new Date(),
      endDate: new Date(),
      activity_Location: '',
      userId: 0,
      activityStatus_ID: 0,
      activity_ID: 0,
      users: {
        user_ID: 0,
        username: '',
        surname: '',
        email: '',
        idPassport: '',
        cellphone: '',
        role: '',
        rating_ID: 0,
        password: '', 
        profileImage: '', 
        idImage: '' ,
        regDate: new Date()
      },
      activityStatus: {
        activityStatus_ID: 0,
        activity_Status: '',
      },
      activity: {
        activity_ID: 0,
        activity_Name: '',
        activity_Description: '',
        activityTask: []
      },
      scheduledActivityScheduledTask: [
        {
        scheduledActivityScheduledTask_ID: 0,
        scheduledActivity_ID: 0,
        scheduledTask_ID: 0,
        scheduledTask: {
          scheduledTask_ID: 0,
          startDate: new Date(),
          endDate: new Date(),
          taskStatus: '',
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
            }
          }
        }
      }
    ],
  };

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

  // scheduledTaskUser: ScheduledTaskUser = {
  //   scheduledTaskUser_ID: 0,
  //   userId: 0,
  //   scheduledTask_ID: 0,
  //   user: {
  //     userId: 0,
  //     username: '',
  //     surname: '',
  //     email: '',
  //     idPassport: '',
  //     cellphone: '',
  //     role: '',
  //     rating_ID: 0,
  //     ratings: {
  //       rating_ID: 0,
  //       rating: 0,
  //     },
  //   },
  // };

  ngOnInit(): void {
    this.GetAllScheduledActivities();

    this.route.url.subscribe(urlSegments => {
      this.savedRoute = urlSegments.join('/'); // Convert URL segments to a string
      console.log("THE ROUTE IS:", this.savedRoute)
      this.userTyService.setCurrentPath(this.savedRoute);
    });
  }

  GetAllScheduledActivities(): void {
    this.scheduledActivityService.getAllScheduledActivities(this.searchTerm).subscribe({
      next: (scheduledActivities) => {
        this.scheduledActivities = scheduledActivities;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  OnSearch(): void {
    this.GetAllScheduledActivities();
  }

  ClearSearchTerm(): void {
    this.searchTerm = '';
    this.OnSearch();
  }

  openTaskModal(id: number, content: any){
    this.GetOneScheduledActivities(id);
    const modalRef = this.modalService.open(content, {
      size: 'xl',
      centered: true,
      backdrop: 'static'
    });
  }

  GetOneScheduledActivities(id: number): void {
    this.scheduledActivityService.getOneScheduledActivity(id).subscribe({
      next: (scheduledActivity) => {
        this.addUpdateScheduledActivityRequest = scheduledActivity;
        this.activityName = this.addUpdateScheduledActivityRequest.activity.activity_Name;
          
          this.filterTasksBySearchTerm(this.addUpdateScheduledActivityRequest.scheduledActivityScheduledTask);
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  filterTasksBySearchTerm(scheduledActivity: ScheduledActivityScheduledTask[]): void {
    if (!this.searchTaskTerm || this.searchTaskTerm.trim() === '') {
      this.filteredTasks = scheduledActivity;
    }
    const lowercaseSearchTerm = this.searchTaskTerm.toLowerCase();

    this.filteredTasks=scheduledActivity.filter(scheduledActivity =>
      scheduledActivity.scheduledTask &&
      (scheduledActivity.scheduledTask.task.task_Name.toLowerCase().includes(lowercaseSearchTerm) ||
      scheduledActivity.scheduledTask.task.task_Description.toLowerCase().includes(lowercaseSearchTerm)) ||
      scheduledActivity.scheduledTask.startDate.toString().toLowerCase().includes(lowercaseSearchTerm) ||
      scheduledActivity.scheduledTask.endDate.toString().toLowerCase().includes(lowercaseSearchTerm) ||
      scheduledActivity.scheduledTask.taskStatus.toString().toLowerCase().includes(lowercaseSearchTerm)
    );
  }

  ClearTaskSearchTerm(): void {
    this.searchTaskTerm = '';
    this.filterTasksBySearchTerm(this.addUpdateScheduledActivityRequest.scheduledActivityScheduledTask)
  }

  openEmployeeModal(content: any, id: number, taskName: string){
    this.GetOneScheduledTaskUser(id);
    this.GetOneScheduledTaskContractor(id);
    this.taskName = taskName;
    const modalRef = this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });
  }

  GetOneScheduledTaskUser(id: number): void {
    this.scheduledActivityService.getOneScheduledTaskUser(id).subscribe({
      next: (scheduledTaskUser) => {
        this.scheduledTaskUser = scheduledTaskUser;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  GetOneScheduledTaskContractor(id: number): void {
    this.scheduledActivityService.getOneScheduledtaskContractor(id).subscribe({
      next: (scheduledTaskContractor) => {
        this.scheduledTaskContractor = scheduledTaskContractor;
      },
      error: (response) => {
        console.log(response);
      }
    });
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

  openAddModal(content: any){
    this.searchTerm = '';
    this.filtered = [];
    this.isAddMode = true;
    this.GetAllActivity();
    this.GetAllSupervisors();
    const modalRef = this.modalService.open(content, {
      size: 'xl',
      centered: true,
      backdrop: 'static'
    });
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

  GetAllSupervisors(): void {
    this.userService.getAllUsers('Supervisor').subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  AddScheduledActivity(success: any, failed:any) {
    this.ScheduledActivity = {
      scheduledActivity_ID: 0,
      startDate: new Date(),
      endDate: new Date(),
      activity_Location: '',
      userId: 0,
      activityStatus_ID: 0,
      activity_ID: 0,
      activity: {
        activity_ID: 0,
        activity_Name: '',
        activity_Description: '',
        activityTask: []
      },
      scheduledActivityScheduledTask: []
    };
    this.scheduledActivityService.AddScheduledActivity(this.ScheduledActivity).subscribe({
      next: (scheduledActivity: ScheduledActivity) => {
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

  LoadTask(id: number) {
    this.isAddMode = false;
    if (!isNaN(id)) {
      this.activityService.loadActivity(id).subscribe({
        next: (response) => {
          this.addUpdateActivityRequest = response;
          console.log(response)
          this.activityName = this.addUpdateActivityRequest.activity_Name;
          
          this.filterTasks(this.addUpdateActivityRequest.activityTask);
        }
      });
    }
  }

  filterTasks(tasks: ActivityTask[]): void {
    if (!this.searchTaskTerm || this.searchTaskTerm.trim() === '') {
      this.filtered = tasks
    }
    const lowercaseSearchTerm = this.searchTaskTerm.toLowerCase();

    this.filtered=tasks.filter(task =>
      task.task &&
      (task.task.task_Name.toLowerCase().includes(lowercaseSearchTerm) ||
      task.task.task_Description.toLowerCase().includes(lowercaseSearchTerm)) ||
      task.task?.skill?.skill_Name.toLowerCase().includes(lowercaseSearchTerm)
    );
  }

  addEmployeeToArray() {
    if (this.selectedEmployee) {
      const supplierToAdd = this.employees.find(employee => employee.user_ID === Number(this.selectedEmployee));
      if (supplierToAdd) {
        this.addUpdateEmployee.push(supplierToAdd);
        this.selectedEmployee = null;
        this.isEmployeeListEmpty = this.addUpdateEmployee.length === 0;
      }
    }
  }

  deleteEmployeeFromArray(employee: User) {
    const index = this.addUpdateEmployee.findIndex(s => s.user_ID === employee.user_ID);
    if (index !== -1) {
      this.addUpdateEmployee.splice(index, 1);
    }
    this.isEmployeeListEmpty = this.addUpdateEmployee.length === 0;
  }
}