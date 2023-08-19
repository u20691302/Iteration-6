import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/app/environments/environment';
import { User } from 'src/app/models/user/user.model';

@Injectable()
export class UserService {
  private users: User[] = [];
  private userPayload:any;
  private token: string = "";
  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = this.decodedToken();
  }

  registerUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/api/user/register`, user);
  }

  login(user: User): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/api/User/login`, user).pipe(
      tap(response => {
        this.token = response.Token; // Save the token
        console.log(this.token)
      })
    );
  }

  updateUser(userId: number, user: User): Observable<any> {
    console.log("updateuser method is being called in user service");
    return this.http.put<any>(`${this.baseApiUrl}/api/user/${userId}`, user).pipe(
      tap(response => {
        this.token = response.Token; // Save the token
      })
    );;
  }

  updatePassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put<any>(`${this.baseApiUrl}/api/user/updatepassword/${userId}`, null, {
      params: {
        currentPassword: currentPassword,
        newPassword: newPassword
      }
    }).pipe(
      tap(response => {
        this.token = response.Token; // Save the token if needed
      })
    );
  }

  updateProfileImage(userId: number, newProfilePhoto: FormData): Observable<any> {
    return this.http.put<any>(`${this.baseApiUrl}/api/user/updateprofileimage/${userId}`, newProfilePhoto)
      .pipe(
        tap(response => {
          this.token = response.Token; // Save the token if needed
        })
      );
  }

  SendSMS(idpass: string): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/api/user/SendSMS?idpass=${idpass}`, {});
  }

  sendRegistration(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/api/user/SendRegistration`, email);
  }

  SendRegSMS(cellnum: string): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/api/user/SendRegSMS?cellnum=${cellnum}`, {});
  }
  
  //indian mandem
  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue);
    return console.log(localStorage.getItem('token'));

    
  }

  storeRole(theRole: string){
    localStorage.setItem('role', theRole);
    return console.log("the stored role from the service is", localStorage.getItem('role'));

  }

  getToken(){
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean{
    return !!localStorage.getItem('token');
  }

  isAuthorized(): boolean{
    var role = localStorage.getItem('role');
    if (role == "Admin")
    {
      console.log("the oak is authorized for sho")
      return true;
    }
    else{
      return false;
    }



  }

  getCurrentPath(){
    return localStorage.getItem('path');
  }

  setCurrentPath(thePath: string){
    localStorage.setItem('path', thePath);
    return console.log("the stored PATH from the service is", localStorage.getItem('path'));

  }


  logout(){
    localStorage.clear();
    this.router.navigate(['login']);
  }

  //idk if i need
  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/api/user/getAllUsers`);
  }


  decodedToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log("this is the decoded token",jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token);
  }

  getFullNameFromToekn(){
    if(this.userPayload){
      return this.userPayload.unique_name;
    }
    
  }

  getRoleFromToken(){
    if(this.userPayload)
    return this.userPayload.role;
  }

  getSurnameFromToken(){
    if(this.userPayload)
    return this.userPayload.family_name;
  }

  getIdNumberFromToken(){
    if(this.userPayload)
    return this.userPayload.certserialnumber;
  }

  getEmailFromToken(){
    if(this.userPayload)
    return this.userPayload.email;
  }

  getCellFromToken(){
    if(this.userPayload)
    return this.userPayload.cellphone;
  }

  getUserIdFromToken(){
    if(this.userPayload)
    return this.userPayload.userid;
  }

  getProfileImageFromToken(){
    if(this.userPayload)
    return this.userPayload.profileImage;
  }

  getRatingFromToken(){
    if(this.userPayload)
    return this.userPayload.rating;
  }

  //getProfile(): Observable<User> {
   // const headers = new HttpHeaders({
   //   Authorization: `Bearer ${this.token}` // Include the JWT token in the request headers
    //});

    //return this.http.get<User>(`${this.apiUrl}/api/user/profile`, { headers });
  //}

//FIX
  //updateUser(updatedUser: User): void {
    //const index = this.users.findIndex(u => u.idPassport === updatedUser.idPassport);
    //if (index !== -1) {
    ////  this.users[index] = updatedUser;
   // }
  //}

  getUser(): User[] {
    return this.users;
  }
}
