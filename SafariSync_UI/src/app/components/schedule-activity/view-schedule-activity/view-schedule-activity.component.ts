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
import { NotificationSupervisor } from 'src/app/models/notifications/notificationSupervisor.model';
import { NotificationAdmin } from 'src/app/models/notifications/notificationAdmin.model';
import { NotificationUser } from 'src/app/models/notifications/notificationUser.model';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Audit } from 'src/app/models/audit/Audit.model';
import { AuditService } from 'src/app/services/audit/audit.service';
import { UserStoreService } from 'src/app/services/user/user-store.service';
import { ScheduledTaskToolbox } from 'src/app/models/scheduledActivity/scheduledTaskToolbox.model';
import { Toolbox } from 'src/app/models/toolbox/toolbox.model';
import { ToolboxService } from 'src/app/services/toolbox/toolbox.service';

@Component({
  selector: 'app-view-schedule-activity',
  templateUrl: './view-schedule-activity.component.html',
  styleUrls: ['./view-schedule-activity.component.scss']
})

export class ViewScheduleActivityComponent implements OnInit{

  constructor(private toolboxService: ToolboxService, private userStore: UserStoreService, private auditService:AuditService, private notificationService: NotificationService, private contractorService: ContractorService, private userService: User1Service, private scheduledActivityService: ScheduledActivityService, private activityService: ActivityService, private modalService: NgbModal, private formBuilder: FormBuilder, private route: ActivatedRoute, private userTyService: UserService) { 
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
  selectedToolbox: number | null = null;
  selectedStatus: number | null = null;
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
  scheduledTask_ID: number = 0;
  task_Name: string = '';
  scheduledActivity_ID: number = 0;


  employees: User[] = [];
  addUpdateEmployee: User[] = [];
  selectedEmployee: number | null = null;
  isEmployeeListEmpty: boolean = true;
  isToolboxListEmpty: boolean = true;
  
  notifications: any[] = [];
  notificationsContractor: any[] = []
  notificationsAdmin: any[] = []

  contractors: Contractor[] = [];
  addUpdateContractor: Contractor[] = [];
  selectedContractor: number | null = null;
  isContractorListEmpty: boolean = true;

  farmworkers: ScheduledTaskUser[] = [];
  Contractors: ScheduledTaskContractor[] = [];

  scheduledTaskToolboxes: ScheduledTaskToolbox[] = [];

  toolboxes: Toolbox[] = [];

  ActivityID: number = 0;

  hasTaskStatus2: boolean = true;
  allTasksStatus3: boolean = true;
  noTasksStatus2: boolean = true;

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
    scheduledTaskUser: [{
      scheduledTaskUser_ID: 0,
      userId: 0,
      scheduledTask_ID: 0,
      user: {
        user_ID: 0,
        username: '',
        surname: '',
        email: '',
        idPassport: '',
        cellphone: '',
        role: '',
        rating_ID: 0,
        ratings: {
          rating_ID: 0,
          rating: 0,
        },
      },
    }],
    users: [],
    contractors: []
  }

  ScheduledTaskUser: ScheduledTaskUser[] = [{
    scheduledTaskUser_ID: 0,
    userId: 0,
    scheduledTask_ID: 0,
    user: {
      user_ID: 0,
      username: '',
      surname: '',
      email: '',
      idPassport: '',
      cellphone: '',
      role: '',
      rating_ID: 0,
      ratings: {
        rating_ID: 0,
        rating: 0,
      },
    },
  }];

  notificationSupervisor: NotificationSupervisor = {
      notification_ID: 0,
      date: new Date(),
      user_ID: 0,
      notification_Message: '',
      notificationStatus_ID: 0,
      scheduledActivity_ID: 0,
  };

  notificationAdmin: NotificationAdmin = {
    notification_ID: 0,
    date: new Date(),
    notification_Message: '',
    scheduledActivity_ID: 0,
    notificationStatus_ID: 0,
    scheduledTask_ID: 0,
    contractor_ID: 0,
    scheduledTaskToolbox_ID: 0
  };

  notificationUser: NotificationUser= {
    notification_ID: 0,
    date: new Date(),
    user_ID: 0,
    notification_Message: '',
    scheduledActivity_ID: 0,
    notificationStatus_ID: 0,
    scheduledTask_ID: 0,
  };

  Auditstream: Audit = {
    audit_ID: 0,
    date: new Date(),
    message: '',
    username:'',
    auditAction_ID:0
  };

  scheduledTaskToolbox: ScheduledTaskToolbox = {
    scheduledTaskToolbox_ID: 0,
    toolbox_ID: 0,
    scheduledTask_ID: 0
  }

  fullName: string = '';
  userID: number = 0;

  ngOnInit(): void {
    this.GetAllScheduledActivities();

    this.route.url.subscribe(urlSegments => {
      this.savedRoute = urlSegments.join('/'); // Convert URL segments to a string
      this.userTyService.setCurrentPath(this.savedRoute);
    });

    this.userStore.getFullNameFromStore().subscribe(val => {
      let fullNameFromToken = this.userTyService.getFullNameFromToekn();
      this.fullName = val || fullNameFromToken;
    });

    this.userStore.getUserIdFromStore().subscribe(val =>{
      let userid = this.userTyService.getUserIdFromToken();
        this.userID = userid;
    });
  }

  GetAllScheduledActivities(): void {
    this.scheduledActivityService.getAllScheduledActivities(this.searchTerm).subscribe({
      next: (scheduledActivities) => {
        this.scheduledActivities = scheduledActivities;
  
        for(var scheduledActivity of this.scheduledActivities ){
          this.hasTaskStatus2 = scheduledActivity.scheduledActivityScheduledTask.some(task => task.scheduledTask.taskStatus_ID == 2);
          this.allTasksStatus3 = scheduledActivity.scheduledActivityScheduledTask.every(task => task.scheduledTask.taskStatus_ID == 3);
          this.noTasksStatus2 = scheduledActivity.scheduledActivityScheduledTask.every(task => task.scheduledTask.taskStatus_ID == 1);
  
          if(this.hasTaskStatus2){
            this.ScheduledActivity = {
              scheduledActivity_ID: scheduledActivity.scheduledActivity_ID,
              startDate: new Date(),
              endDate: new Date(),
              activity_Location: '',
              user_ID: 0,
              activityStatus_ID: 2,
              activity_ID: 0,
              activity: {
                activity_ID: 0,
                activity_Name: '',
                activity_Description: '',
                activityTask: []
              },
              scheduledActivityScheduledTask: []
            };
          }
          else if (this.allTasksStatus3) {
            this.ScheduledActivity = {
              scheduledActivity_ID: scheduledActivity.scheduledActivity_ID,
              startDate: new Date(),
              endDate: new Date(),
              activity_Location: '',
              user_ID: 0,
              activityStatus_ID: 3,
              activity_ID: 0,
              activity: {
                activity_ID: 0,
                activity_Name: '',
                activity_Description: '',
                activityTask: []
              },
              scheduledActivityScheduledTask: []
            };
          } else if (this.noTasksStatus2) {
              this.ScheduledActivity = {
                scheduledActivity_ID: scheduledActivity.scheduledActivity_ID,
                startDate: new Date(),
                endDate: new Date(),
                activity_Location: '',
                user_ID: 0,
                activityStatus_ID: 1,
                activity_ID: 0,
                activity: {
                  activity_ID: 0,
                  activity_Name: '',
                  activity_Description: '',
                  activityTask: []
                },
                scheduledActivityScheduledTask: []
              };
          }
  
          this.scheduledActivityService.updateScheduledActivityStatus(this.ScheduledActivity).subscribe({
            next: (scheduledActivity: ScheduledActivity) => {
              
            }
          });
        }
      }
    });
  }  

  isScheduledActivityNotified(scheduledActivityId: number): number {

    if (this.notifications.some(notification => notification.scheduledActivity_ID === scheduledActivityId)){

      const notification = this.notifications.find(notification => notification.scheduledActivity_ID === scheduledActivityId);

      if (notification.notificationStatus_ID == 1){
        return 1;
      }
      else if (notification.notificationStatus_ID == 2){
        return 2;
      }
      else if (notification.notificationStatus_ID == 3){
        return 3;
      }
    }
    return 3;
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

  loadScheduledTask(content: any, id: number, taskID: number): void {
    this.scheduledActivityService.getOneScheduledTask(id).subscribe({
      next: (scheduledTask) => {
        this.scheduledTask = scheduledTask;
        this.task_ID = taskID;
        this.taskstartDateTime = this.scheduledTask.startDate;
        this.taskendDateTime = this.scheduledTask.endDate;
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
    this.selectedEmployee = null;
    this.selectedContractor = null;
    this.GetAllContractors();
    this.GetAllUsers();
    this.loadEmployeesIntoArray();
    this.loadContractorIntoArray();

    this.scheduledTask_ID = id;

    const modalRef = this.modalService.open(content, {
      size: 'xl',
      centered: true,
      backdrop: 'static'
    });
  }

  UpdateScheduledTask(success: any, failed:any) {
  
    this.notificationService.getNotificationUser().subscribe({
      next: (notifications) => {
        // Find users to be deleted from the database
        const usersToDelete = notifications.filter((notificationUser) => {
          return !this.addUpdateEmployee.some((user) => {
            return notificationUser.user_ID === user.user_ID &&
                   notificationUser.scheduledTask_ID === this.scheduledTask.scheduledTask_ID;
          });
        });
    
        // Delete users from the database
        for (const user of usersToDelete) {
          this.notificationService.deleteNotificationUser(user).subscribe(
            (deletedUser) => {
              // Handle deletion success if needed
            },
            (error) => {
              console.error('Error deleting user:', error);
              // Handle deletion error if needed
            }
          );
        }
    
        // Filter out users from addUpdateEmployee based on user_ID and scheduledTask_ID
        this.addUpdateEmployee = this.addUpdateEmployee.filter((user) => {
          return !notifications.some((notificationUser) => {
            return notificationUser.user_ID === user.user_ID &&
                   notificationUser.scheduledTask_ID === this.scheduledTask.scheduledTask_ID;
          });
        });
      }
    });

    this.notificationService.getNotificationAdmin().subscribe({
      next: (notifications) => {
        // Find users to be deleted from the database
        const contractorsToDelete = notifications.filter((notificationAdmin) => {
          return !this.addUpdateContractor.some((contractor) => {
            return notificationAdmin.contractor_ID === contractor.contractor_ID &&
            notificationAdmin.scheduledTask_ID === this.scheduledTask.scheduledTask_ID;
          });
        });
    
        // Delete users from the database
        for (const contractor of contractorsToDelete) {
          this.notificationService.deleteNotificationAdmin(contractor).subscribe(
            (deletedContractor) => {
              // Handle deletion success if needed
            },
            (error) => {
              console.error('Error deleting contractor:', error);
              // Handle deletion error if needed
            }
          );
        }
    
        // Filter out users from addUpdateEmployee based on user_ID and scheduledTask_ID
        this.addUpdateContractor = this.addUpdateContractor.filter((contractor) => {
          return !notifications.some((notificationAdmin) => {
            return notificationAdmin.contractor_ID === contractor.contractor_ID &&
            notificationAdmin.scheduledTask_ID === this.scheduledTask.scheduledTask_ID;
          });
        });
      }
    });

    this.scheduledTask = {
      scheduledTask_ID: this.scheduledTask_ID,
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
      next: (ScheduledTask: ScheduledTask) => {

        if (this.addUpdateEmployee) {
          for (var user of this.addUpdateEmployee) {
            this.notificationUser = {
              notification_ID: 0,
              date: new Date(),
              user_ID: user.user_ID,
              scheduledActivity_ID: this.scheduledActivity_ID,
              notification_Message: 'You, ' + user.username +' '+ user.surname +' have been assigned as a farm worker on a scheduled task.',
              notificationStatus_ID: 3,
              scheduledTask_ID: ScheduledTask.scheduledTask_ID
            };
        
            this.notificationService.AddNotifcationUser(this.notificationUser).subscribe({
              next: () => {
                
              }
            });
          }
        }

        if (this.addUpdateContractor) {
          for (var contractors of this.addUpdateContractor) {
            this.notificationAdmin = {
              notification_ID: 0,
              date: new Date(),
              contractor_ID:  contractors.contractor_ID,
              scheduledTaskToolbox_ID: 0,
              scheduledActivity_ID: this.scheduledActivity_ID,
              notification_Message: contractors.contractor_Name +' have been scheduled as a to a scheduled task, accept to confirm booking.',
              notificationStatus_ID: 3,
              scheduledTask_ID: ScheduledTask.scheduledTask_ID
            };
        
            this.notificationService.AddNotifcationAdmin(this.notificationAdmin).subscribe({
              next: () => {
                
              }
            });
          }
        }

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
    this.GetOneScheduledTaskUser(id, content);
    this.GetOneScheduledTaskContractor(id);
    this.taskName = taskName;
    
  }

  isScheduledTaskNotified(scheduledTaskId: number, userId: number): number {

    if (this.notifications.some(notification => notification.scheduledTask_ID == scheduledTaskId)){

      const notification = this.notifications.find(notification => notification.user_ID == userId && notification.scheduledTask_ID == scheduledTaskId);

      if (notification.notificationStatus_ID == 1){
        return 1;
      }
      else if (notification.notificationStatus_ID == 2){
        return 2;
      }
      else if (notification.notificationStatus_ID == 3){
        return 3;
      }
    }
    return 3;
  }

  GetOneScheduledTaskUser(id: number, content:any): void {
    this.notificationService.getNotificationUser().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      }
    });
    this.scheduledActivityService.getOneScheduledTaskUser(id).subscribe({
      next: (scheduledTaskUser) => {

        this.scheduledTaskUser = scheduledTaskUser;
        const modalRef = this.modalService.open(content, {
          size: 'lg',
          centered: true,
          backdrop: 'static'
        });
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  isScheduledTaskContractorNotified(scheduledTaskId: number,  contractor_ID: number): number {

    if (this.notificationsContractor.some(notification => notification.scheduledTask_ID == scheduledTaskId)){

      const notification = this.notificationsContractor.find(notification => notification.contractor_ID == contractor_ID && notification.scheduledTask_ID == scheduledTaskId);

      if (notification.notificationStatus_ID == 1){
        return 1;
      }
      else if (notification.notificationStatus_ID == 2){
        return 2;
      }
      else if (notification.notificationStatus_ID == 3){
        return 3;
      }
    }
    return 3;
  }

  GetOneScheduledTaskContractor(id: number): void {
    this.notificationService.getNotificationAdmin().subscribe({
      next: (notifications) => {
        this.notificationsContractor = notifications;
      }
    }); 
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
        const username = (this.users.find(user => user.user_ID === Number(this.selectedSupervisor || 0))?.username) + ' '
         + (this.users.find(user => user.user_ID === Number(this.selectedSupervisor || 0))?.surname);

        this.notificationSupervisor= {
          notification_ID: 0,
          date: new Date(),
          user_ID: this.selectedSupervisor || 0,
          notification_Message: 'You, (' + username + ') have been assigned as a supervisor on a scheduled activity.',
          notificationStatus_ID: 3,
          scheduledActivity_ID: this.scheduledActivity_ID
        }

        this.notificationService.UpdateNotificationSupervisor(this.notificationSupervisor).subscribe({
          next: () => {
            this.selectedActivity = null;
            this.selectedSupervisor = null;
            this.startDateTime = new Date();
            this.endDateTime = new Date();
            this.addUpdateScheduledActivityRequest.activity_Location = '';
          }
        });

        this.Auditstream={
          audit_ID:0,
          date:new Date(),
          message:' '+" assigned Employee ID: " + this.selectedSupervisor +" to Scheduled Activity: " + this.scheduledActivity_ID + ' ',
          username:this.fullName,
          auditAction_ID:2
        }
        this.auditService.AddAudit(this.Auditstream).subscribe({
          next: () => {
            
          }
        });

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

        const username = (this.users.find(user => user.user_ID === Number(this.selectedSupervisor || 0))?.username) + ' '
         + (this.users.find(user => user.user_ID === Number(this.selectedSupervisor || 0))?.surname);

        this.notificationSupervisor= {
          notification_ID: 0,
          date: new Date(),
          user_ID: this.selectedSupervisor || 0,
          notification_Message: 'You, (' + username + ') have been assigned as a supervisor on a scheduled activity.',
          notificationStatus_ID: 3,
          scheduledActivity_ID: this.scheduledActivity_ID
        }

        this.notificationService.AddNotifcationSupervisor(this.notificationSupervisor).subscribe({
          next: () => {
            
          }
        });

        this.Auditstream={
          audit_ID:0,
          date:new Date(),
          message:' '+"assigned " + username+" to Scheduled Activity:" + this.scheduledActivity_ID + ' ',
          username:this.fullName,
          auditAction_ID:1
        }
        this.auditService.AddAudit(this.Auditstream).subscribe({
          next: () => {
            
          }
        });

        this.selectedActivity = null;
            this.selectedSupervisor = null;
            this.startDateTime = new Date();
            this.endDateTime = new Date();
            this.addUpdateScheduledActivityRequest.activity_Location = '';

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
      next: (ScheduledTask: ScheduledTask) => {
        this.scheduledTask_ID = ScheduledTask.scheduledTask_ID;
        this.GetOneScheduledActivities(this.scheduledActivity_ID);

        if (this.scheduledTask.users) {
          for (var user of this.scheduledTask.users) {
            this.notificationUser = {
              notification_ID: 0,
              date: new Date(),
              scheduledActivity_ID: this.scheduledActivity_ID,
              user_ID: user.user_ID,
              notification_Message: 'You, ' + user.username +' '+ user.surname +' have been assigned as a farm worker on a scheduled task.',
              notificationStatus_ID: 3,
              scheduledTask_ID: ScheduledTask.scheduledTask_ID
            };
        
            this.notificationService.AddNotifcationUser(this.notificationUser).subscribe({
              next: () => {
                
              }
            });
          }
        }

        if (this.scheduledTask.contractors) {
          for (var contractors of this.scheduledTask.contractors) {
            this.notificationAdmin = {
              notification_ID: 0,
              date: new Date(),
              scheduledActivity_ID: this.scheduledActivity_ID,
              contractor_ID: contractors.contractor_ID,
              scheduledTaskToolbox_ID: 0,
              notification_Message: contractors.contractor_Name +' have been scheduled as a to a scheduled task, accept to confirm booking.',
              notificationStatus_ID: 3,
              scheduledTask_ID: ScheduledTask.scheduledTask_ID
            };
        
            this.notificationService.AddNotifcationAdmin(this.notificationAdmin).subscribe({
              next: () => {
                
              }
            });
          }
        }
        
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

 addEmployeeToArray(content: any) {
  if (this.selectedEmployee) {
    const employeeIdToAdd = Number(this.selectedEmployee);

    // Check if the user with the specified ID is already in the array
    const isUserAlreadyAdded = this.addUpdateEmployee.some(employee => employee.user_ID === employeeIdToAdd);

    if (!isUserAlreadyAdded) {
      const employeeToAdd = this.users.find(employee => employee.user_ID === employeeIdToAdd);
      if (employeeToAdd) {
        this.addUpdateEmployee.push(employeeToAdd);
        this.selectedEmployee = null;
        this.isEmployeeListEmpty = this.addUpdateEmployee.length === 0;
      }
    } else {
      this.selectedEmployee = null;
      const modalRef = this.modalService.open(content, {
        size: 'dialog-centered',
        backdrop: 'static'
      });
    }
  }
}


  deleteEmployeeFromArray(employee: User) {
    const index = this.addUpdateEmployee.findIndex(s => s.user_ID === employee.user_ID);
    if (index !== -1) {
      this.addUpdateEmployee.splice(index, 1);
      console.log(this.addUpdateEmployee)
    }
    this.isEmployeeListEmpty = this.addUpdateEmployee.length === 0;
  }

  loadEmployeesIntoArray() {
    if (this.scheduledTask) {
      this.addUpdateEmployee = this.scheduledTask.scheduledTaskUser
        ?.filter((scheduledTaskUser: ScheduledTaskUser) => scheduledTaskUser.user !== undefined)
        .map((userItem: any) => userItem.user) || [];
    } else {
      this.addUpdateEmployee = [];
    }
    this.isEmployeeListEmpty = this.addUpdateEmployee.length === 0;
  }
  
  

  addContractorToArray(content: any) {
    if (this.selectedContractor) {
      const contractorIdToAdd = Number(this.selectedContractor);
  
      // Check if the contractor with the specified ID is already in the array
      const isContractorAlreadyAdded = this.addUpdateContractor.some(contractor => contractor.contractor_ID === contractorIdToAdd);
  
      if (!isContractorAlreadyAdded) {
        const contractorToAdd = this.contractors.find(contractor => contractor.contractor_ID === contractorIdToAdd);
        if (contractorToAdd) {
          this.addUpdateContractor.push(contractorToAdd);
          this.selectedContractor = null;
          this.isContractorListEmpty = this.addUpdateContractor.length === 0;
        }
      } else {
        this.selectedContractor = null;
        const modalRef = this.modalService.open(content, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
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
    if (this.scheduledTask) {
      this.addUpdateContractor = this.scheduledTask.scheduledTaskContractor
        ?.filter((scheduledTaskContractor: ScheduledTaskContractor) => scheduledTaskContractor.contractor !== undefined)
        .map((userItem: any) => userItem.contractor) || [];
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

  ScheduleTaskModal(content: any, id: number){
    this.loadTask(id);
    this.isAddMode = true;
    const modalRef = this.modalService.open(content, {
      size: 'xl',
      centered: true,
      backdrop: 'static'
    });
  }

  checkTaskSchedule(id: number): boolean {
    for (const scheduledTask of this.addUpdateScheduledActivityRequest.scheduledActivityScheduledTask) {
      if (scheduledTask.scheduledTask.task_ID === id) {
        return true;
      }
    }
    return false;
  }

  openScheduleTaskModal(id: number, content: any, exists: any, name: string){
    this.GetOneScheduledActivities(this.scheduledActivity_ID);
    if(this.checkTaskSchedule(id)){
      const modalRef = this.modalService.open(exists, {
        size: 'xl',
        centered: true,
        backdrop: 'static'
      });
    }
    else{
      this.addUpdateEmployee = [];
      this.addUpdateContractor = [];
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

        this.Auditstream={
          audit_ID:0,
          date:new Date(),
          message:" deleted Scheduled Activity:" + this.scheduledActivity_ID + ' ',
          username:this.fullName,
          auditAction_ID:3
        }
        this.auditService.AddAudit(this.Auditstream).subscribe({
          next: () => {
            
          }
        });
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
        this.GetOneScheduledActivities(this.scheduledActivity_ID)
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

  openAddToolboxModal(content: any, id: number){
    this.isAddMode = true;
    this.GetScheduledTaskToolbox(id);
    this.GetAllToolbox();
    this.scheduledTask_ID = id;

    this.notificationService.getNotificationAdmin().subscribe({
      next: (notifications) => {
        this.notificationsAdmin = notifications;

        const modalRef = this.modalService.open(content, {
          size: 'xl',
          centered: true,
          backdrop: 'static'
        });
      }
    });
    
  }

  GetScheduledTaskToolbox(id: number): void {
    this.scheduledActivityService.getOneScheduledTaskToolbox(id).subscribe({
      next: (scheduledTaskToolboxes) => {
        this.scheduledTaskToolboxes = scheduledTaskToolboxes;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  GetAllToolbox(): void {
    this.toolboxService.getAllToolbox(this.searchTerm).subscribe({
      next: (toolboxes) => {
        this.toolboxes = toolboxes;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  AddScheduledTaskToolbox(success: any, failed: any) {
    this.scheduledTaskToolbox = {
      scheduledTaskToolbox_ID: 0,
      toolbox_ID: Number(this.selectedToolbox || 0),
      scheduledTask_ID: this.scheduledTask_ID
    }

    // Check if the record already exists
    const exists = this.scheduledTaskToolboxes.some(
      (toolbox) => this.scheduledTaskToolbox.toolbox_ID === toolbox.toolbox_ID
    );

    // If the record doesn't exist, add it
    if (!exists) {
      this.scheduledActivityService.AddScheduledTaskToolbox(this.scheduledTaskToolbox).subscribe({
        next: (ScheduledTaskToolbox:ScheduledTaskToolbox) => {
          

          this.notificationAdmin = {
            notification_ID: 0,
            date: new Date(),
            scheduledActivity_ID: this.scheduledActivity_ID,
            contractor_ID: 0,
            scheduledTaskToolbox_ID: ScheduledTaskToolbox.scheduledTaskToolbox_ID,
            notification_Message: this.toolboxes.find(toolbox => toolbox.toolbox_ID === Number(this.selectedToolbox || 0))?.toolbox_Name + ' have been scheduled to a scheduled task, approve to confirm toolbox booking.',
            notificationStatus_ID: 3,
            scheduledTask_ID: this.scheduledTask_ID
          };

          this.selectedToolbox = null;
      
          this.notificationService.AddNotifcationAdmin(this.notificationAdmin).subscribe({
            next: () => {
              this.notificationService.getNotificationAdmin().subscribe({
                next: (notifications) => {
                  this.notificationsAdmin = notifications;
                }
              });
              this.GetScheduledTaskToolbox(this.scheduledTask_ID)
            }
          });
        }
      });
  
      const modalRef = this.modalService.open(success, {
        size: 'xl',
        centered: true,
        backdrop: 'static'
      });
      
    } else {
      const modalRef = this.modalService.open(failed, {
        size: 'xl',
        centered: true,
        backdrop: 'static'
      });
    }
  }


  DeleteScheduledTaskToolbox(scheduledTaskToolboxID: number, success: any, failed: any) {
    this.scheduledActivityService.deleteScheduledTaskToolbox(scheduledTaskToolboxID).subscribe({
      next: (response) => {
        this.GetScheduledTaskToolbox(this.scheduledTask_ID)
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

  isScheduledTaskToolboxNotified(scheduledTaskId: number,  scheduledTaskToolbox_ID: number): number {
        if (this.notificationsAdmin.some(notification => notification.scheduledTask_ID == scheduledTaskId)){

          const notification = this.notificationsAdmin.find(notification => notification.scheduledTask_ID == scheduledTaskId && notification.scheduledTaskToolbox_ID == scheduledTaskToolbox_ID );
          
          if (notification.notificationStatus_ID == 1){
            return 1;
          }
          else if (notification.notificationStatus_ID == 2){
            return 2;
          }
          else if (notification.notificationStatus_ID == 3){
            return 3;
          }
        }
        return 3;
  }

  openUpdateTaskStatus(content: any, id: number){
    this.scheduledTask_ID = id;

    const modalRef = this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });    
  }

  updateScheduledTaskStatus(content: any){
    this.scheduledTask = {
      scheduledTask_ID: this.scheduledTask_ID,
      startDate: new Date(),
      endDate: new Date(),
      taskStatus_ID: Number(this.selectedStatus),
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

    this.scheduledActivityService.updateScheduledTaskStatus(this.scheduledTask).subscribe({
      next: (ScheduledTask: ScheduledTask) => {
        this.scheduledActivityService.getOneScheduledActivity(this.scheduledActivity_ID).subscribe({
          next: (scheduledActivity) => {
            this.addUpdateScheduledActivityRequest = scheduledActivity;
            this.activityName = this.addUpdateScheduledActivityRequest.activity.activity_Name;
            this.ActivityID = this.addUpdateScheduledActivityRequest.activity.activity_ID;
            this.filterTasksBySearchTerm(this.addUpdateScheduledActivityRequest.scheduledActivityScheduledTask);
           
            const modalRef = this.modalService.open(content, {
              size: 'xl',
              centered: true,
              backdrop: 'static'
            }); 
          },
          error: (response) => {
            console.log(response);
          }
        });
      }
    });
  }      
}