import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, tap, mergeMap, of } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ScheduledTaskContractor } from 'src/app/models/scheduledActivity/scheduleTaskContractor.model';
import { ScheduledActivity } from 'src/app/models/scheduledActivity/scheduledActivity.model';
import { ScheduledTaskUser } from 'src/app/models/scheduledActivity/scheduledTaskUser.model';


@Injectable({
  providedIn: 'root'
})
export class ScheduledActivityService {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }

  AddScheduledActivity(addScheduledActivityRequest: ScheduledActivity): Observable<ScheduledActivity> {
    return this.http.post<ScheduledActivity>(this.baseApiUrl + '/api/ScheduledActivity/AddScheduledActivity/',addScheduledActivityRequest);
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
  
  getOneScheduledTaskUser(id: number): Observable<ScheduledTaskUser[]> {
    return this.http.get<ScheduledTaskUser[]>(`${this.baseApiUrl}/api/ScheduledActivity/ReadOneScheduledTaskUserAsync/${id}`);
  } 
  
  getOneScheduledtaskContractor(id: number): Observable<ScheduledTaskContractor[]> {
    return this.http.get<ScheduledTaskContractor[]>(`${this.baseApiUrl}/api/ScheduledActivity/ReadOneScheduledTaskContractorAsync/${id}`);
  }  
   
  // loadScheduledActivity(scheduledActivityID: number): Observable<ScheduledActivity> {
  //   return this.http.get<ScheduledActivity>(this.baseApiUrl + '/api/ScheduledActivity/ReadOneScheduledActivityAsync/' + scheduledActivityID)
  // }

  // updateScheduledActivity(updateScheduledActivityRequest: ScheduledActivity): Observable<ScheduledActivity> {
  //   return this.http.put<ScheduledActivity>(this.baseApiUrl + '/api/ScheduledActivity/UpdateScheduledActivityAsync/', updateScheduledActivityRequest);
  // }

  // deleteScheduledActivity(scheduledActivityID: number): Observable<ScheduledActivity> {
  //   return this.http.delete<ScheduledActivity>(this.baseApiUrl + '/api/ScheduledActivity/DeleteScheduledActivity/' + scheduledActivityID);
  // }

  // AddScheduledActivityTask(addScheduledActivityTaskRequest: ScheduledActivityTask): Observable<ScheduledActivityTask> {
  //   return this.http.post<ScheduledActivityTask>(this.baseApiUrl + '/api/ScheduledActivity/AddScheduledActivity/', addScheduledActivityTaskRequest);
  // }

  // LoadScheduledActivityTask(scheduledActivityTaskId: number): Observable<ScheduledActivityTask> {
  //   return this.http.get<ScheduledActivityTask>(this.baseApiUrl + '/api/ScheduledActivity/ReadOneScheduledActivityTaskAsync/' + scheduledActivityTaskId)
  // }

  // deleteScheduledActivityTask(scheduledActivityTaskID: number): Observable<ScheduledActivityTask> {
  //   return this.http.delete<ScheduledActivityTask>(this.baseApiUrl + '/api/ScheduledActivity/DeleteScheduledActivityTask/' + scheduledActivityTaskID);
  // }

  // AddTask(addTaskRequest: TaskS, id: number): Observable<TaskS> {
  //   return this.http.post<TaskS>(this.baseApiUrl + '/api/ScheduledActivity/AddTask/', addTaskRequest)
  //     .pipe(
  //       mergeMap((createdTask: TaskS) => {
  //         // Extract the ID from the createdTask object
  //         var taskId = Number(createdTask.task_ID);
  //         const scheduledActivityTask = {
  //           scheduledActivity_ID: id,
  //           task_ID: taskId
  //         };
  
  //         // Make a separate request to create the scheduledActivity task and return the result as an Observable
  //         return this.http.post<TaskS>(this.baseApiUrl + '/api/ScheduledActivity/AddScheduledActivityTask/', scheduledActivityTask)
  //           .pipe(
  //             mergeMap(() => {
  //               console.log('ScheduledActivity Task created successfully!');
  //               // Return the createdTask as the final result of the observable chain
  //               return of(createdTask);
  //             }),
  //           );
  //       })
  //     );
  // }
  
  // loadTask(taskID: number): Observable<TaskS> {
  //   return this.http.get<TaskS>(this.baseApiUrl + '/api/ScheduledActivity/ReadOneTaskAsync/' + taskID)
  // }

  // updateTask(updateTaskRequest: TaskS): Observable<TaskS> {
  //   return this.http.put<TaskS>(this.baseApiUrl + '/api/ScheduledActivity/UpdateTaskAsync/', updateTaskRequest);
  // }
}
