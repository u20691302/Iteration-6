import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { User } from 'src/app/models/user/user.model';
import { Ratings } from 'src/app/models/user/ratings.model';
import { UserSkill } from 'src/app/models/user/userSkill.model';
import { Skills } from 'src/app/models/skills/skills.model';

@Injectable({
  providedIn: 'root'
})
export class User1Service {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }

  getAllUsers(term: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseApiUrl}/api/User/ReadAllUsersAsync`).pipe(
      map(users => {
        if (term === null) {
          return users;
        }
        
        const filteredUsers = users.filter((user: User) =>
          user.username.toLowerCase().includes(term.toLowerCase()) ||
          user.surname.toLowerCase().includes(term.toLowerCase()) ||
          user.email?.toLowerCase().includes(term.toLowerCase()) ||
          user.idPassport?.toLowerCase().includes(term.toLowerCase()) || 
          user.cellphone.toLowerCase().includes(term.toLowerCase()) ||
          user.role.toLowerCase().includes(term.toLowerCase()) ||
          user.ratings?.rating.toString().toLowerCase().includes(term.toLowerCase())
        );
        
        return filteredUsers;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  getAllUsersDashboard(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseApiUrl}/api/User/ReadAllUsersDashboardAsync`).pipe(
      map(users => {
        return users;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  getAllUserForTasks(term: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseApiUrl}/api/User/ReadAllUsersAsync`).pipe(
      map(users => {
        if (term === null) {
          return users;
        }
        
        const filteredUsers = users.filter((user: User) =>
          user.role.toLowerCase().includes(term.toLowerCase())
        );
        
        return filteredUsers;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  getAllRatings(): Observable<Ratings[]> {
    return this.http.get<Ratings[]>(`${this.baseApiUrl}/api/User/ReadAllRatingsAsync`).pipe(
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }
  
  loadUser(userID: number): Observable<User> {
    return this.http.get<User>(this.baseApiUrl + '/api/User/ReadOneUserAsync/' + userID)
  }

  loadUserSkill(userID: number): Observable<UserSkill[]> {
    return this.http.get<UserSkill[]>(this.baseApiUrl + '/api/User/ReadOneUserSkillAsync/' + userID)
  }

  updateUser(userId:number, updateUserRequest: User): Observable<User> {
    return this.http.put<any>(`${this.baseApiUrl}/api/user/${userId}`, updateUserRequest);
  }

  deleteUser(userID: number): Observable<User> {
    return this.http.delete<User>(this.baseApiUrl + '/api/User/DeleteUser/' + userID);
  }

  getAllUsersReport(term: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseApiUrl}/api/User/ReadAllUsersAsync`).pipe(
      map(users => {
        if (term === null) {
          return users;
        }
        
        const filteredUsers = users.filter((user: User) =>
          user.username.toLowerCase().includes(term.toLowerCase()) ||
          user.surname.toLowerCase().includes(term.toLowerCase()) ||
          user.role.toLowerCase().includes(term.toLowerCase()) ||
          user.ratings?.rating.toString().toLowerCase().includes(term.toLowerCase()) ||
          user.userSkill?.length.toString().includes(term.toLowerCase())
        );
        
        return filteredUsers;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  updateUserRole(updateScheduledActivityRequest: User): Observable<User> {
    return this.http.put<User>(this.baseApiUrl + '/api/User/UpdateUserRoleAsync/', updateScheduledActivityRequest);
  }
}