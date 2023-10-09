import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, fromEvent, merge, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private logoutTimer: Subscription | undefined;
  private timerSubject = new Subject<void>();
  timerExpired$ = this.timerSubject.asObservable();
  activityTimeout = 5000; // Adjust this value as needed (in milliseconds)
  baseApiUrl: string = environment.baseApiUrl;


  constructor(private http: HttpClient) {
    this.fetchTimeoutFromBackend(); // Fetch the timeout value from the backend when the service is initialized
  }

  public async fetchTimeoutFromBackend() {
    try {
      const response = await this.http.get<any>(`${this.baseApiUrl}/api/user/timeout`).pipe(take(1)).toPromise();
      const timeout = response.timeout.timer_Time as number; // Cast the response to the number type
      this.activityTimeout = timeout * 1000; // Convert seconds to milliseconds
      localStorage.setItem('timeout', timeout.toString());

      //console.log("Response from the backend:", response);
      // Call any methods or set up timers that depend on this.activityTimeout here.
    } catch (error) {
      // Handle error here
      console.error("Error fetching timeout from the backend:", error);
    }
  }

  updateTimeout(newTimeout: number): Observable<any> {
    const url = `${this.baseApiUrl}/api/user/updateTimeout`;
    const params = new HttpParams().set('newTimeout', newTimeout.toString());

    localStorage.setItem('timeout', newTimeout.toString());

  
    return this.http.put(url, null, { params });
    
  }
  
  
  

  startTimer(): void {
    localStorage.setItem("timeout", (this.activityTimeout/1000).toString());
    // Merge mousemove and keydown events
    const activity$ = merge(fromEvent(document, 'mousemove'), fromEvent(document, 'keydown')).pipe(
      debounceTime(this.activityTimeout), // Wait for no activity for the specified duration
      distinctUntilChanged()
    );

    // Subscribe to the activity stream and start the timer when there's no activity
    this.logoutTimer = activity$.pipe(switchMap(() => timer(this.activityTimeout))).subscribe(() => {
      this.timerSubject.next();
    });
  }

  stopTimer(): void {
    if (this.logoutTimer) {
      this.logoutTimer.unsubscribe();
    }
  }
}
