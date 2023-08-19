import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Skills } from 'src/app/models/skills/skills.model';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }

  AddSkill(addSkillRequest: Skills): Observable<Skills> {
    return this.http.post<Skills>(this.baseApiUrl + '/api/Skill/AddSkill/', addSkillRequest);
  }

  getAllSkills(term: string): Observable<Skills[]> {
    return this.http.get<Skills[]>(`${this.baseApiUrl}/api/Skill/ReadAllSkillsAsync`).pipe(
      map(skills => {
        if (term === null) {
          return skills;
        }
        
        const filteredSkills = skills.filter((skill: Skills) =>
          skill.skill_Name.toLowerCase().includes(term.toLowerCase()) ||
          skill.skill_Description.toLowerCase().includes(term.toLowerCase())
        );
        
        return filteredSkills;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }
  
  loadSkill(skillID: number): Observable<Skills> {
    return this.http.get<Skills>(this.baseApiUrl + '/api/Skill/ReadOneSkillAsync/' + skillID)
  }

  updateSkill(skillID: number, updateSkillRequest: Skills): Observable<Skills> {
    return this.http.put<Skills>(this.baseApiUrl + '/api/Skill/UpdateSkillAsync/' + skillID, updateSkillRequest);
  }

  deleteSkill(skillID: number): Observable<Skills> {
    return this.http.delete<Skills>(this.baseApiUrl + '/api/Skill/DeleteSkill/' + skillID);
  }

  readAllSkills(): Observable<Skills[]> {
    return this.http.get<Skills[]>(`${this.baseApiUrl}/api/Skill/ReadAllSkillsAsync`);
  }

  getUserSkills(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/api/User/getUserSkills/${userId}`);
  }
}
