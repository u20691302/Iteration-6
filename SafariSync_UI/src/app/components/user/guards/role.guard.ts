import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { NgToastService } from 'ng-angular-popup';


@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate{
  constructor(private userService: UserService, private router: Router, private toast: NgToastService, private route: ActivatedRoute)
  {

  }

  public savedRoute: string = "shap";  // Variable to store the saved route


  canActivate():boolean{

    

    if(this.userService.isAuthorized()){
      return true;
    }else{
      console.log("Hade you think you clever? - you are not an admin!");
      this.toast.error({detail: "ERROR", summary: "You are not an Admin!", duration: 5000});
      const currentPath = this.userService.getCurrentPath();
      if (currentPath !== null) {
        this.savedRoute = currentPath;
        this.router.navigate([this.savedRoute]);
        console.log("THE CURRENT PATH FROM ROLE GUARD IS", this.savedRoute)
      }
      return false;
    }
  }

  
}
