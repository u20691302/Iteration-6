import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, tap, mergeMap, of } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Activity } from 'src/app/models/activity/activity.model';
import { ActivityTask } from 'src/app/models/activity/activityTask.model';
import { TaskS } from 'src/app/models/activity/task.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }

  AddActivity(addActivityRequest: Activity): Observable<Activity> {
    return this.http.post<Activity>(this.baseApiUrl + '/api/Activity/AddActivity/',addActivityRequest);
  }

  getAllActivity(term: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseApiUrl}/api/Activity/ReadAllActivityAsync`).pipe(
      map(activitys => {
        if (term === null) {
          return activitys;
        }
        
        const filteredActivitys = activitys.filter((activity: Activity) =>
          activity.activity_Name.toLowerCase().includes(term.toLowerCase()) ||
          activity.activity_Description.toLowerCase().includes(term.toLowerCase())
        );
        
        return filteredActivitys;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }
   
  loadActivity(activityID: number): Observable<Activity> {
    return this.http.get<Activity>(this.baseApiUrl + '/api/Activity/ReadOneActivityAsync/' + activityID)
  }

  updateActivity(updateActivityRequest: Activity): Observable<Activity> {
    return this.http.put<Activity>(this.baseApiUrl + '/api/Activity/UpdateActivityAsync/', updateActivityRequest);
  }

  deleteActivity(activityID: number): Observable<Activity> {
    return this.http.delete<Activity>(this.baseApiUrl + '/api/Activity/DeleteActivity/' + activityID);
  }

  AddActivityTask(addActivityTaskRequest: ActivityTask): Observable<ActivityTask> {
    return this.http.post<ActivityTask>(this.baseApiUrl + '/api/Activity/AddActivity/', addActivityTaskRequest);
  }

  LoadActivityTask(activityTaskId: number): Observable<ActivityTask> {
    return this.http.get<ActivityTask>(this.baseApiUrl + '/api/Activity/ReadOneActivityTaskAsync/' + activityTaskId)
  }

  deleteActivityTask(activityTaskID: number): Observable<ActivityTask> {
    return this.http.delete<ActivityTask>(this.baseApiUrl + '/api/Activity/DeleteActivityTask/' + activityTaskID);
  }

  AddTask(addTaskRequest: TaskS, id: number): Observable<TaskS> {
    return this.http.post<TaskS>(this.baseApiUrl + '/api/Activity/AddTask/', addTaskRequest)
      .pipe(
        mergeMap((createdTask: TaskS) => {
          // Extract the ID from the createdTask object
          var taskId = Number(createdTask.task_ID);
          const activityTask = {
            activity_ID: id,
            task_ID: taskId
          };
  
          // Make a separate request to create the activity task and return the result as an Observable
          return this.http.post<TaskS>(this.baseApiUrl + '/api/Activity/AddActivityTask/', activityTask)
            .pipe(
              mergeMap(() => {
                console.log('Activity Task created successfully!');
                // Return the createdTask as the final result of the observable chain
                return of(createdTask);
              }),
            );
        })
      );
  }
  
  loadTask(taskID: number): Observable<TaskS> {
    return this.http.get<TaskS>(this.baseApiUrl + '/api/Activity/ReadOneTaskAsync/' + taskID)
  }

  updateTask(updateTaskRequest: TaskS): Observable<TaskS> {
    return this.http.put<TaskS>(this.baseApiUrl + '/api/Activity/UpdateTaskAsync/', updateTaskRequest);
  }
}
