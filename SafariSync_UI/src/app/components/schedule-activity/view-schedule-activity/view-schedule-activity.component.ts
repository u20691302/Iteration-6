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
import { ScheduledTask } from 'src/app/models/scheduledActivity/scheduledTask.model';
import { Contractor } from 'src/app/models/contractor/contractor.model';
import { ContractorService } from 'src/app/services/contractor/contractor.service';

@Component({
  selector: 'app-view-schedule-activity',
  templateUrl: './view-schedule-activity.component.html',
  styleUrls: ['./view-schedule-activity.component.scss']
})

export class ViewScheduleActivityComponent implements OnInit{

  constructor(private contractorService: ContractorService, private userService: User1Service, private scheduledActivityService: ScheduledActivityService, private activityService: ActivityService, private modalService: NgbModal, private formBuilder: FormBuilder, private route: ActivatedRoute, private userTyService: UserService) { 
    this.form = this.formBuilder.group({
      startDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required],
    });

    this.task = this.formBuilder.group({
      taskstartDateTime: ['', Validators.required],
      taskendDateTime: ['', Validators.required]
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
  task: FormGroup;
  public savedRoute: string = "shap";  // Variable to store the saved route

  taskstartDateTime: Date = new Date();
  taskendDateTime: Date = new Date();
  task_ID: number = 0;
  task_Name: string = '';
  scheduledActivity_ID: number = 0;


  employees: User[] = [];
  addUpdateEmployee: User[] = [];
  selectedEmployee: number | null = null;
  isEmployeeListEmpty: boolean = true;

  contractors: Contractor[] = [];
  addUpdateContractor: Contractor[] = [];
  selectedContractor: number | null = null;
  isContractorListEmpty: boolean = true;

  ActivityID: number = 0;

  addUpdateScheduledActivityRequest: ScheduledActivity = {
    scheduledActivity_ID: 0,
      startDate: new Date(),
      endDate: new Date(),
      activity_Location: '',
      user_ID: 0,
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
          taskStatus_ID: 0,
          taskStatus: {
            taskStatus_ID: 0,
            task_Status: ''
          },
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
      user_ID: 0,
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
          taskStatus_ID: 0,
          taskStatus: {
            taskStatus_ID: 0,
            task_Status: ''
          },
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

  scheduledTask: ScheduledTask = {
    scheduledTask_ID: 0,
    startDate: new Date(),
    endDate: new Date(),
    taskStatus_ID: 0,
    taskStatus: {
      taskStatus_ID: 0,
      task_Status: ''
    },
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
    },
    users: [],
    contractors: []
  }

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

  loadTask(id: number) {
    this.isAddMode = false;
    if (!isNaN(id)) {
      this.activityService.loadActivity(id).subscribe({
        next: (response) => {
          this.addUpdateActivityRequest = response;
          this.activityName = this.addUpdateActivityRequest.activity_Name;
        },
        error: (response) => {
          console.log(response);
        }
      });
    }
  }

  OnSearch(): void {
    this.GetAllScheduledActivities();
  }

  ClearSearchTerm(): void {
    this.searchTerm = '';
    this.OnSearch();
  }

  GetOneScheduledActivities(id: number): void {
    this.scheduledActivityService.getOneScheduledActivity(id).subscribe({
      next: (scheduledActivity) => {
        this.addUpdateScheduledActivityRequest = scheduledActivity;
        this.activityName = this.addUpdateScheduledActivityRequest.activity.activity_Name;
        this.ActivityID = this.addUpdateScheduledActivityRequest.activity.activity_ID;
        this.filterTasksBySearchTerm(this.addUpdateScheduledActivityRequest.scheduledActivityScheduledTask);
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  loadScheduledActivities(content: any, id: number): void {
    this.scheduledActivityService.getOneScheduledActivity(id).subscribe({
      next: (scheduledActivity) => {
        this.addUpdateScheduledActivityRequest = scheduledActivity;
        this.openUpdateModal(content, id)
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  loadScheduledTask(content: any, id: number): void {
    this.scheduledActivityService.getOneScheduledTask(id).subscribe({
      next: (scheduledTask) => {
        this.scheduledTask = scheduledTask;
        this.openTaskUpdateModal(content, id)
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  openTaskUpdateModal(content: any, id: number){
    this.searchTerm = '';
    this.filtered = [];
    this.isAddMode = false;
    this.GetAllContractors();
    this.GetAllUsers();
    this.loadEmployeesIntoArray();
    this.loadContractorIntoArray();

    this.scheduledTask.scheduledTask_ID= id;
    this.scheduledTask.users = this.addUpdateEmployee;
    this.taskstartDateTime = this.addUpdateScheduledActivityRequest.startDate;
    this.taskendDateTime = this.addUpdateScheduledActivityRequest.endDate;
    this.scheduledTask.contractors = this.addUpdateContractor;

    const modalRef = this.modalService.open(content, {
      size: 'xl',
      centered: true,
      backdrop: 'static'
    });
  }

  UpdateScheduledTask(success: any, failed:any) {
    this.scheduledTask = {
      scheduledTask_ID: 0,
      startDate: this.taskstartDateTime,
      endDate: this.taskendDateTime,
      taskStatus_ID: 1,
      task_ID: this.task_ID,
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
      },
      users: this.addUpdateEmployee,
      contractors: this.addUpdateContractor
    }
    this.scheduledActivityService.updateScheduledTask(this.scheduledTask).subscribe({
      next: () => {
        const modalRef = this.modalService.open(success, {
          size: 'xl',
          centered: true,
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
      scheduledActivity.scheduledTask.taskStatus_ID.toString().toLowerCase().includes(lowercaseSearchTerm)
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

  openUpdateModal(content: any, id: number){
    this.searchTerm = '';
    this.filtered = [];
    this.isAddMode = false;
    this.GetAllActivity();
    this.GetAllSupervisors();

    console.log(this.addUpdateScheduledActivityRequest)
    this.scheduledActivity_ID= id;
    this.selectedActivity = this.addUpdateScheduledActivityRequest.activity_ID;
    this.startDateTime = this.addUpdateScheduledActivityRequest.startDate;
    this.endDateTime = this.addUpdateScheduledActivityRequest.endDate;
    this.selectedSupervisor = this.addUpdateScheduledActivityRequest.user_ID;

    const modalRef = this.modalService.open(content, {
      size: 'xl',
      centered: true,
      backdrop: 'static'
    });
  }

  UpdateScheduledActivity(success: any, failed:any) {
    this.ScheduledActivity = {
      scheduledActivity_ID: this.scheduledActivity_ID,
      startDate: this.startDateTime,
      endDate: this.endDateTime,
      activity_Location: this.addUpdateScheduledActivityRequest.activity_Location,
      user_ID: this.selectedSupervisor || 0,
      activityStatus_ID: 1,
      activity_ID: this.selectedActivity || 0,
      activity: {
        activity_ID: 0,
        activity_Name: '',
        activity_Description: '',
        activityTask: []
      },
      scheduledActivityScheduledTask: []
    };

    console.log(this.ScheduledActivity)
    this.scheduledActivityService.updateScheduledActivity(this.ScheduledActivity).subscribe({
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

  openAddTaskModal(content: any, id: number){
    this.isAddMode = true;
    this.GetOneScheduledActivities(id);
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

  validateTaskDateRange(): void {
    this.task.controls['taskstartDateTime'].markAsDirty();
    this.task.controls['taskendDateTime'].markAsDirty();
  }

  isDateTaskRangeValid(): boolean {
    if (this.task.controls['taskstartDateTime'].dirty || this.task.controls['taskendDateTime'].dirty) {
      if (this.taskstartDateTime && this.taskendDateTime) {
        const startDate = new Date(this.taskstartDateTime);
        const endDate = new Date(this.taskendDateTime);
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
      startDate: this.startDateTime,
      endDate: this.endDateTime,
      activity_Location: this.addUpdateScheduledActivityRequest.activity_Location,
      user_ID: this.selectedSupervisor || 0,
      activityStatus_ID: 1,
      activity_ID: this.selectedActivity || 0,
      activity: {
        activity_ID: 0,
        activity_Name: '',
        activity_Description: '',
        activityTask: []
      },
      scheduledActivityScheduledTask: []
    };
    this.scheduledActivityService.AddScheduledActivity(this.ScheduledActivity).subscribe({
      next: (ScheduledActivity:ScheduledActivity) => {
        this.scheduledActivity_ID = ScheduledActivity.scheduledActivity_ID;
        this.ngOnInit();
        const modalRef = this.modalService.open(success, {
          size: 'xl',
          centered: true,
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

  AddScheduledTask(success: any, failed:any) {
    this.scheduledTask = {
      scheduledTask_ID: 0,
      startDate: this.taskstartDateTime,
      endDate: this.taskendDateTime,
      taskStatus_ID: 1,
      task_ID: this.task_ID,
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
      },
      users: this.addUpdateEmployee,
      contractors: this.addUpdateContractor
    }
    this.scheduledActivityService.AddScheduledTask(this.scheduledTask, this.scheduledActivity_ID).subscribe({
      next: () => {
        this.GetOneScheduledActivities(this.scheduledActivity_ID);
        // this.loadTask(id);
        
        const modalRef = this.modalService.open(success, {
          size: 'xl',
          centered: true,
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
      const employeeToAdd = this.users.find(employee => employee.user_ID === Number(this.selectedEmployee));
      if (employeeToAdd) {
        this.addUpdateEmployee.push(employeeToAdd);
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

  loadEmployeesIntoArray() {
    console.log(this.scheduledTask.users)
    if (this.scheduledTask.users) {
      console.log(1)
      this.addUpdateEmployee = this.scheduledTask.users
        .filter((employee): employee is User => employee !== undefined)
        .map(supplierItem => supplierItem);
    } else {
      this.addUpdateEmployee = [];
    }
    this.isEmployeeListEmpty = this.addUpdateEmployee.length === 0;
  }

  addContractorToArray() {
    if (this.selectedContractor) {
      const contractorToAdd = this.contractors.find(contractor => contractor.contractor_ID === Number(this.selectedContractor));
      if (contractorToAdd) {
        this.addUpdateContractor.push(contractorToAdd);
        this.selectedContractor = null;
        this.isContractorListEmpty = this.addUpdateContractor.length === 0;
      }
    }
  }

  deleteContractorFromArray(contractor: Contractor) {
    const index = this.addUpdateContractor.findIndex(s => s.contractor_ID === contractor.contractor_ID);
    if (index !== -1) {
      this.addUpdateContractor.splice(index, 1);
    }
    this.isContractorListEmpty = this.addUpdateContractor.length === 0;
  }

  loadContractorIntoArray() {
    if (this.scheduledTask.contractors) {
      this.addUpdateContractor = this.scheduledTask.contractors
        .filter((supplier): supplier is Contractor => supplier !== undefined)
        .map(supplierItem => supplierItem);
    } else {
      this.addUpdateContractor = [];
    }
    this.isContractorListEmpty = this.addUpdateContractor.length === 0;
  }

  openScheduledTaskModal(id: number, content: any){
    this.GetOneScheduledActivities(id);
    this.scheduledActivity_ID = id;
    const modalRef = this.modalService.open(content, {
      size: 'xl',
      centered: true,
      backdrop: 'static'
    });
  }

  OpenScheduleTaskModal(content: any, id: number){
    this.loadTask(id);
    this.isAddMode = true;
    const modalRef = this.modalService.open(content, {
      size: 'xl',
      centered: true,
      backdrop: 'static'
    });
  }

  openScheduleTaskModal(id: number, content: any, name: string){
    this.task_ID = id;
    this.task_Name = name;
    this.GetAllUsers();
    this.GetAllContractors();
    const modalRef = this.modalService.open(content, {
      size: 'xl',
      centered: true,
      backdrop: 'static'
    });
  }

  GetAllUsers(): void {
    this.userService.getAllUserForTasks('Farm Worker').subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  GetAllContractors(): void {
    this.contractorService.getAllContractors("").subscribe({
      next: (contractors) => {
        this.contractors = contractors;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }


  OpenDeleteModal(content: any, scheduledActivity: ScheduledActivity) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.ScheduledActivity = scheduledActivity;
  }

  DeleteActivity(scheduledActivityID: number, success: any, failed: any) {
    this.scheduledActivityService.deleteScheduledActivity(scheduledActivityID).subscribe({
      next: (response) => {
        this.scheduledActivities = this.scheduledActivities.filter(scheduledActivities => scheduledActivities.scheduledActivity_ID !== scheduledActivityID);
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

  OpenTaskDeleteModal(content: any, scheduledTask: ScheduledTask) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.scheduledTask = scheduledTask;
  }

  DeleteTaskActivity(scheduledTaskID: number, success: any, failed: any) {
    this.scheduledActivityService.deleteScheduledActivityScheduledTask(scheduledTaskID).subscribe({
      next: (response) => {
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

  OpenScheduleTaskDeleteModal(content: any, scheduledTask: ScheduledTask) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.scheduledTask= scheduledTask;
  }
}