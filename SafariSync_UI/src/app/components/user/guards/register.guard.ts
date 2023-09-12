import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';


@Injectable({
  providedIn: 'root',
})
export class RegisterGuard implements CanActivate {
  constructor(private router: Router, private toast: NgToastService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = route.queryParams['token'];

    // Check if the token is valid (you can make an API call to validate it)
    if (this.isValidToken(token)) {
      return true; // Allow access to the route
    } else {
      // Redirect to an unauthorized page or login page
      this.toast.error({detail: "ERROR", summary: "You do not have a register link!", duration: 5000});
      this.router.navigate(['/login']); // Replace with your unauthorized page route
      return false;
    }
  }

  private isValidToken(token: string): boolean {
    // Implement logic to validate the token (e.g., make an API request)
    // Return true if the token is valid, false otherwise
    // You may need to call an API endpoint to validate the token on the server
    // and handle the response accordingly
    // For simplicity, you can assume the token is valid if it exists.
    return !!token;
  }
}
