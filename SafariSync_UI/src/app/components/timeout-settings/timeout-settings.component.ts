import { Component } from '@angular/core';
import { TimerService } from 'src/app/services/user/timer.service';
import { UserService } from 'src/app/services/user/user.service';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-timeout-settings',
  templateUrl: './timeout-settings.component.html',
  styleUrls: ['./timeout-settings.component.scss']
})
export class TimeoutSettingsComponent {

  constructor(private timerService: TimerService, private userService: UserService, private toast: NgToastService){}

  timeoutnum:number = 69;

  ngOnInit() {
    this.getNums();
  }
  getNums(){
    const stringNum = localStorage.getItem('timeout');

    this.timeoutnum = parseInt(stringNum || '0', 10); // '0' is the default value if stringNum is null or not a valid number
  }

   


    // Example usage in a method
  updateTimerTimeout(newTimeout: number): void {
    console.log(newTimeout);
    this.timerService.updateTimeout(newTimeout).subscribe(
      (response) => {
        console.log('Timeout updated successfully', response);
        this.toast.success({detail: "SUCCESS", summary: "Updated Timeout Settings", duration: 5000})
        // You can handle the response here if needed
        this.timerService.fetchTimeoutFromBackend();
        this.userService.handleTimerExpiration(); // Call this method in your component's ngOnInit
      },
      (error) => {
        console.error('Error updating timeout', error);
        // Handle errors here
      }
    );
  }


}
