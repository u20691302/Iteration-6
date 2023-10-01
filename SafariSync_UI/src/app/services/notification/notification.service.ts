import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { NotificationAdmin } from 'src/app/models/notifications/notificationAdmin.model';
import { NotificationSupervisor } from 'src/app/models/notifications/notificationSupervisor.model';
import { NotificationUser } from 'src/app/models/notifications/notificationUser.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }

  getNotificationSupervisor(): Observable<NotificationSupervisor[]> {
    return this.http.get<NotificationSupervisor[]>(`${this.baseApiUrl}/api/Notification/ReadSupervisorNotifications`);
  } 

  getNotificationAdmin(): Observable<NotificationAdmin[]> {
    return this.http.get<NotificationAdmin[]>(`${this.baseApiUrl}/api/Notification/ReadUserNotifications`);
  } 

  getNotificationUser(): Observable<NotificationUser[]> {
    return this.http.get<NotificationUser[]>(`${this.baseApiUrl}/api/Notification/ReadAdminNotifications`);
  } 

  AddNotifcationSupervisor(addNotificationSupervisorRequest: NotificationSupervisor): Observable<NotificationSupervisor> {
    return this.http.post<NotificationSupervisor>(this.baseApiUrl + '/api/Notification/AddNotificationSupervisor/', addNotificationSupervisorRequest);
  }

  UpdateNotificationSupervisor(updateNotificationSupervisorRequest: NotificationSupervisor): Observable<NotificationSupervisor> {
    console.log(updateNotificationSupervisorRequest)
    return this.http.put<NotificationSupervisor>(this.baseApiUrl + '/api/Notification/UpdateNotificationSupervisor/',updateNotificationSupervisorRequest);
  }

  AddNotifcationAdmin(addNotificationAdminRequest: NotificationAdmin): Observable<NotificationAdmin> {
    return this.http.post<NotificationAdmin>(this.baseApiUrl + '/api/Notification/AddNotificationAdmin/', addNotificationAdminRequest);
  }

  AddNotifcationUser(addNotificationUserRequest: NotificationUser): Observable<NotificationUser> {
    return this.http.post<NotificationUser>(this.baseApiUrl + '/api/Notification/AddNotificationUser/', addNotificationUserRequest);
  }
}
