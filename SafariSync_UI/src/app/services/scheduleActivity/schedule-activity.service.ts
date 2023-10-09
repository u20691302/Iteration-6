import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, tap, mergeMap, of, concatMap } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ScheduledTaskContractor } from 'src/app/models/scheduledActivity/scheduleTaskContractor.model';
import { ScheduledActivity } from 'src/app/models/scheduledActivity/scheduledActivity.model';
import { ScheduledActivityScheduledTask } from 'src/app/models/scheduledActivity/scheduledActivityScheduledTask';
import { ScheduledTask } from 'src/app/models/scheduledActivity/scheduledTask.model';
import { ScheduledTaskToolbox } from 'src/app/models/scheduledActivity/scheduledTaskToolbox.model';
import { ScheduledTaskUser } from 'src/app/models/scheduledActivity/scheduledTaskUser.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduledActivityService {

  baseApiUrl: string = environment.baseApiUrl
  scheduledtasks: number = 0;

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

  constructor(private http: HttpClient) { }

  AddScheduledActivity(addScheduledActivityRequest: ScheduledActivity): Observable<ScheduledActivity> {
    return this.http.post<ScheduledActivity>(this.baseApiUrl + '/api/ScheduledActivity/AddScheduledActivity/',addScheduledActivityRequest);
  }

  AddScheduledTask(addScheduledTaskRequest: ScheduledTask, id: number): Observable<ScheduledTask> {
      return this.http.post<ScheduledTask>(this.baseApiUrl + '/api/ScheduledActivity/AddScheduledTask/', addScheduledTaskRequest)
          .pipe(
              concatMap((scheduledTask: ScheduledTask) => {
                  var scheduledTaskId = Number(scheduledTask.scheduledTask_ID);
                  this.scheduledTask = scheduledTask;
                  this.scheduledtasks = scheduledTaskId;
                  const scheduledActivityScheduledTask = {
                      scheduledActivity_ID: id,
                      scheduledTask_ID: scheduledTaskId
                  };

                  return this.http.post<ScheduledActivityScheduledTask>(this.baseApiUrl + '/api/ScheduledActivity/AddScheduledActivityScheduledTask/', scheduledActivityScheduledTask);
              }),
              concatMap((scheduledActivityScheduledTask: ScheduledActivityScheduledTask) => {

                  var scheduledTaskId = Number(scheduledActivityScheduledTask.scheduledTask_ID);
                  const userTask = {
                      scheduledTask_ID: scheduledTaskId,
                      users: addScheduledTaskRequest.users
                  };

                  return this.http.post<any>(this.baseApiUrl + '/api/ScheduledActivity/AddScheduledTaskUser/', userTask);
              }),
              concatMap(() => {

                  const contractorTask = {
                      scheduledTask_ID: this.scheduledtasks,
                      contractors: addScheduledTaskRequest.contractors
                  };

                  if (contractorTask.contractors && contractorTask.contractors.length > 0) {
                      // Send the request only if the contractors array is not empty
                      return this.http.post<any>(this.baseApiUrl + '/api/ScheduledActivity/AddScheduledTaskContractor/', contractorTask);
                  } else {
                      // Return an observable that immediately completes if the contractors array is empty
                      return of(null);
                  }
              }),
              map(() => {
                  // Return the created scheduled task
                  return this.scheduledTask;
              })
          );
  }

  
  getAllScheduledActivities(term: string): Observable<ScheduledActivity[]> {
    return this.http.get<ScheduledActivity[]>(`${this.baseApiUrl}/api/ScheduledActivity/ReadAllScheduledActivityAsync`).pipe(
      map(scheduledActivities => {
        if (term === null) { 
          return scheduledActivities;
        }
        
        const filteredScheduledActivitys = scheduledActivities.filter((scheduledActivity: ScheduledActivity) =>
          scheduledActivity.activity?.activity_Name.toLowerCase().includes(term.toLowerCase()) ||
          scheduledActivity.activity?.activity_Description.toLowerCase().includes(term.toLowerCase()) ||
          scheduledActivity.startDate?.toString().toLowerCase().includes(term.toLowerCase()) ||
          scheduledActivity.endDate?.toString().toLowerCase().includes(term.toLowerCase()) ||
          scheduledActivity.activity_Location?.toLowerCase().includes(term.toLowerCase()) ||
          scheduledActivity.users?.surname.toLowerCase().includes(term.toLowerCase()) ||
          scheduledActivity.users?.username.toLowerCase().includes(term.toLowerCase())
        );
        
        return filteredScheduledActivitys;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  getOneScheduledActivity(id: number): Observable<ScheduledActivity> {
    return this.http.get<ScheduledActivity>(`${this.baseApiUrl}/api/ScheduledActivity/ReadOneScheduledActivityAsync/${id}`);
  } 

  getOneScheduledTask(id: number): Observable<ScheduledTask> {
    return this.http.get<ScheduledTask>(`${this.baseApiUrl}/api/ScheduledActivity/ReadOneScheduledTaskAsync/${id}`);
  } 
  
  getOneScheduledTaskUser(id: number): Observable<ScheduledTaskUser[]> {
    return this.http.get<ScheduledTaskUser[]>(`${this.baseApiUrl}/api/ScheduledActivity/ReadOneScheduledTaskUserAsync/${id}`);
  } 
  
  getOneScheduledtaskContractor(id: number): Observable<ScheduledTaskContractor[]> {
    return this.http.get<ScheduledTaskContractor[]>(`${this.baseApiUrl}/api/ScheduledActivity/ReadOneScheduledTaskContractorAsync/${id}`);
  }  

  deleteScheduledActivity(scheduledActivityID: number): Observable<ScheduledActivity> {
    return this.http.delete<ScheduledActivity>(this.baseApiUrl + '/api/ScheduledActivity/DeleteScheduledActivity/' + scheduledActivityID);
  }

  deleteScheduledActivityScheduledTask(scheduledActivityScheduledTaskID: number): Observable<ScheduledActivityScheduledTask> {
    return this.http.delete<ScheduledActivityScheduledTask>(this.baseApiUrl + '/api/ScheduledActivity/DeleteScheduledActivityScheduledTask/' + scheduledActivityScheduledTaskID);
  }

  updateScheduledActivity(updateScheduledActivityRequest: ScheduledActivity): Observable<ScheduledActivity> {
    return this.http.put<ScheduledActivity>(this.baseApiUrl + '/api/ScheduledActivity/UpdateScheduledActivity/', updateScheduledActivityRequest);
  }

  updateScheduledTask(updateScheduledActivityRequest: ScheduledTask): Observable<ScheduledTask> {
    return this.http.put<ScheduledTask>(this.baseApiUrl + '/api/ScheduledActivity/UpdateScheduledTask/', updateScheduledActivityRequest);
  }

  getOneScheduledTaskToolbox(id: number): Observable<ScheduledTaskToolbox[]> {
    return this.http.get<ScheduledTaskToolbox[]>(`${this.baseApiUrl}/api/ScheduledActivity/ReadOneScheduledTaskToolboxAsync/${id}`);
  } 

  AddScheduledTaskToolbox(addScheduledTaskToolboxRequest: ScheduledTaskToolbox): Observable<ScheduledTaskToolbox> {
    return this.http.post<ScheduledTaskToolbox>(this.baseApiUrl + '/api/ScheduledActivity/AddScheduledTaskToolbox/',addScheduledTaskToolboxRequest);
  }
}
