import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from 'src/app/services/user/user-store.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { User } from 'src/app/models/user/user.model';
import { TimerService } from 'src/app/services/user/timer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: User = {
    user_ID: 0,
    username: '',
    password: '',
    surname: '',
    email: '',
    idPassport: '',
    cellphone: '',
    role: '',
    profileImage: '',
    idImage: '',
    rating_ID: 0,
    regDate: new Date()
  };

  form: FormGroup; // Add this line

  constructor(private timerService: TimerService,private userService: UserService, private router: Router, private toast: NgToastService, private userStore: UserStoreService) {
    this.form = new FormGroup({
      IdPassport: new FormControl('', [Validators.required, Validators.pattern(/(([0-9]{2})(0|1)([0-9])([0-3])([0-9]))([ ]?)(([0-9]{4})([ ]?)([0-1][8]([ ]?)[0-9]))/)]),
      Password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{5,}$')])
    });
  }

  login() {
    this.userService.login(this.user)
      .subscribe(
        response => {
          
          // Handle successful login response
          console.log("this is the response", response); // Log the response for testing or perform further actions
          this.userService.storeToken(response.token);
          let tokePayload = this.userService.decodedToken();
          this.userService.storeRole(tokePayload.role);
          
          this.userStore.setFullNameForStore(tokePayload.unique_name);
          this.userStore.setRoleForStore(tokePayload.role);
          this.userStore.setSurnameFromStore(tokePayload.family_name);
          this.userStore.setIdNumFromStore(tokePayload.certserialnumber);
          this.userStore.setEmailFromStore(tokePayload.email);
          this.userStore.setCellPhoneFromStore(tokePayload.cellphone);
          this.userStore.setUserIdFromStore(tokePayload.userid);
          this.userStore.setProfileImageFromStore(tokePayload.profileImage);
          this.userStore.setRatingFromStore(tokePayload.rating);
          
          this.userStore.setIdImageFromStore(tokePayload.idImage);
          this.timerService.startTimer();

          this.toast.success({detail: "SUCCESS", summary: "Logged in Successfully", duration: 5000})
          this.router.navigate(['/dashboard']);
        },
        error => {
          // Handle login error
          this.toast.error({detail: "ERROR", summary: error.error, duration: 5000})
        }
      );
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('Password') as HTMLInputElement;
    const eyeIcon = document.querySelector('.toggle-password') as HTMLElement;
  
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
  }
}