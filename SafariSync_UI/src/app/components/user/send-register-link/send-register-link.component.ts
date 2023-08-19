import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';


@Component({
  selector: 'app-send-register-link',
  templateUrl: './send-register-link.component.html',
  styleUrls: ['./send-register-link.component.scss']
})
export class SendRegisterLinkComponent {

  form: FormGroup;
  public cellnum: string = "";

  constructor(private userService: UserService, private toast: NgToastService, private router: Router){
    this.form = new FormGroup({
      Cellphone: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')])
    });
  }

  sendResetPasswordLink() {
    
    this.userService.SendRegSMS(this.cellnum).subscribe(
      (response) => {
        console.log('SMS sent successfully:', response);
        this.toast.success({detail: "SUCCESS", summary: "Registration password link sent", duration: 10000})
        this.form.reset();
      },
      (error) => {
        console.error('Failed to send SMS:', error);
        this.toast.error({detail: "ERROR", summary: error.error, duration: 5000})
      }
    );
  }

}
