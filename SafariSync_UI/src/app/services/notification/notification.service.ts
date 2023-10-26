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

  getNotificationSupervisor1(id: number): Observable<NotificationSupervisor[]> {
    return this.http.get<NotificationSupervisor[]>(`${this.baseApiUrl}/api/Notification/ReadSupervisorNotifications1/${id}`);
  } 

  getNotificationUser1(id: number): Observable<NotificationUser[]> {
    return this.http.get<NotificationUser[]>(`${this.baseApiUrl}/api/Notification/ReadUserNotifications1/${id}`);
  } 



  getNotificationAdmin(): Observable<NotificationAdmin[]> {
    return this.http.get<NotificationAdmin[]>(`${this.baseApiUrl}/api/Notification/ReadAdminNotifications`);
  } 

  getNotificationSupervisor(): Observable<NotificationSupervisor[]> {
    return this.http.get<NotificationSupervisor[]>(`${this.baseApiUrl}/api/Notification/ReadSupervisorNotifications`);
  } 

  getNotificationUser(): Observable<NotificationUser[]> {
    return this.http.get<NotificationUser[]>(`${this.baseApiUrl}/api/Notification/ReadUserNotifications`);
  } 



  AddNotifcationAdmin(addNotificationAdminRequest: NotificationAdmin): Observable<NotificationAdmin> {
    return this.http.post<NotificationAdmin>(this.baseApiUrl + '/api/Notification/AddNotificationAdmin/', addNotificationAdminRequest);
  }

  AddNotifcationUser(addNotificationUserRequest: NotificationUser): Observable<NotificationUser> {
    return this.http.post<NotificationUser>(this.baseApiUrl + '/api/Notification/AddNotificationUser/', addNotificationUserRequest);
  }

  AddNotifcationSupervisor(addNotificationSupervisorRequest: NotificationSupervisor): Observable<NotificationSupervisor> {
    return this.http.post<NotificationSupervisor>(this.baseApiUrl + '/api/Notification/AddNotificationSupervisor/', addNotificationSupervisorRequest);
  }





  UpdateNotificationSupervisor(updateNotificationSupervisorRequest: NotificationSupervisor): Observable<NotificationSupervisor> {
    return this.http.put<NotificationSupervisor>(this.baseApiUrl + '/api/Notification/UpdateNotificationSupervisor/',updateNotificationSupervisorRequest);
  }

  UpdateNotificationAdmin(updateNotificationAdminRequest: NotificationAdmin): Observable<NotificationAdmin> {
    return this.http.put<NotificationAdmin>(this.baseApiUrl + '/api/Notification/UpdateNotificationAdmin/',updateNotificationAdminRequest);
  }
  
  UpdateNotificationUser(updateNotificationUserRequest: NotificationUser): Observable<NotificationUser> {
    return this.http.put<NotificationUser>(this.baseApiUrl + '/api/Notification/UpdateNotificationAdmin/',updateNotificationUserRequest);
  }





  UpdateNotificationAdminStatus(updateNotificationAdminRequest: NotificationAdmin): Observable<NotificationAdmin> {
    return this.http.put<NotificationAdmin>(this.baseApiUrl + '/api/Notification/UpdateNotificationAdminStatus/',updateNotificationAdminRequest);
  }

  UpdateNotificationSupervisorStatus(updateNotificationSupervisorRequest: NotificationSupervisor): Observable<NotificationSupervisor> {
    return this.http.put<NotificationSupervisor>(this.baseApiUrl + '/api/Notification/UpdateNotificationSupervisorStatus/',updateNotificationSupervisorRequest);
  }

  UpdateNotificationUserStatus(updateNotificationUserRequest: NotificationUser): Observable<NotificationUser> {
    return this.http.put<NotificationUser>(this.baseApiUrl + '/api/Notification/UpdateNotificationUserStatus/',updateNotificationUserRequest);
  }



  deleteNotificationUser(notificationUser: NotificationUser): Observable<any> {
    const url = `${this.baseApiUrl}/api/Notification/DeleteUserNotification/${notificationUser.user_ID}/${notificationUser.scheduledTask_ID}`;
    return this.http.delete<any>(url);
  }

  deleteNotificationAdmin(notificationAdmin: NotificationAdmin): Observable<any> {
    const url = `${this.baseApiUrl}/api/Notification/DeleteAdminNotification/${notificationAdmin.contractor_ID}/${notificationAdmin.scheduledTask_ID}`;
    return this.http.delete<any>(url);
  }
}
