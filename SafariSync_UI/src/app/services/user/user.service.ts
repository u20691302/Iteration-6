import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/app/environments/environment';
import { User } from 'src/app/models/user/user.model';
import { RatingSettings } from 'src/app/models/user/ratingsettings.model';

@Injectable()
export class UserService {
  private users: User[] = [];
  private userPayload:any;
  private token: string = "";
  private Token: string = "";

  baseApiUrl: string = environment.baseApiUrl;

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

  SendRegSMS(role: string, cellnum: string): Observable<any> {
    const params = new HttpParams()
      .set('role', role)
      .set('cellnum', cellnum);
  
    return this.http.post<any>(`${this.baseApiUrl}/api/user/SendRegSMS`, {}, { params });
  }
  
  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue);
    return;
  }

  storeRole(theRole: string){
    localStorage.setItem('role', theRole);
    return;
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
    return ;
  }


  logout(){
    localStorage.clear();
    this.router.navigate(['login']);
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/api/user/getAllUsers`);
  }

  decodedToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
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

  readAllRatingSettings(): Observable<RatingSettings[]> {
    return this.http.get<RatingSettings[]>(`${this.baseApiUrl}/api/Dashboard/ReadAllRatingsAsync`);
  }

  updateRatingSettings(ratingID: number, updatedRatingSetting: RatingSettings): Observable<RatingSettings> {
    console.log(updatedRatingSetting, ratingID)
    return this.http.put<RatingSettings>(this.baseApiUrl + '/api/Dashboard/UpdateRatingAsync/' + ratingID, updatedRatingSetting);
  }
}
