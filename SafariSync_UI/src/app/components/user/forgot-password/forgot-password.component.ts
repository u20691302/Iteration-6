import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  
  public idpass: string = ""; // Replace with the actual value or get it from your form/input
  form: FormGroup;

  constructor(private userService: UserService, private toast: NgToastService, private router: Router){
    this.form = new FormGroup({
      IdPassport: new FormControl('', [Validators.required, Validators.pattern(/(([0-9]{2})(0|1)([0-9])([0-3])([0-9]))([ ]?)(([0-9]{4})([ ]?)([0-1][8]([ ]?)[0-9]))/)])
    });
  }


  sendResetPasswordLink() {
    
    this.userService.SendSMS(this.idpass).subscribe(
      (response) => {
        console.log('SMS sent successfully:', response);
        this.toast.success({detail: "SUCCESS", summary: "Forgot password link sent", duration: 10000})
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Failed to send SMS:', error);
        this.toast.error({detail: "ERROR", summary: error.error, duration: 5000})
      }
    );
  }
}
