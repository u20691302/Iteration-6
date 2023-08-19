import { CanActivate, Router  } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate{
  constructor(private userService: UserService, private router: Router, private toast: NgToastService)
  {

  }
  canActivate():boolean{
    if(this.userService.isLoggedIn()){
      return true;
    }else{
      console.log("Hade you think you clever? - login first!");
      this.toast.error({detail: "ERROR", summary: "Please login first!", duration: 5000});
      this.router.navigate(['login']);
      return false;
    }
  }
}