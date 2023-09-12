import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Notification } from 'src/app/models/Notification/Notification.model';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }

  readAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseApiUrl}/api/Dashboard/GetAllNotifications`);
  }

}
