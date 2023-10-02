import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private fullName$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  private surname$ = new BehaviorSubject<string>("");
  private idNum$ = new BehaviorSubject<string>("");
  private email$ = new BehaviorSubject<string>("");
  private cellphone$ = new BehaviorSubject<string>("");
  private userid$ = new BehaviorSubject<string>("");
  private profileimage$ = new BehaviorSubject<string>("");
  private rating$ = new BehaviorSubject<string>("");
  private idimage$ = new BehaviorSubject<string>("");

  constructor() { }

  public getRoleFromStore(){
    return this.role$.asObservable();
  }

  public setRoleForStore(role:string){
    this.role$.next(role);
  }

  public getFullNameFromStore(){
    return this.fullName$.asObservable();
  }

  public setFullNameForStore(fullName:string){
    this.fullName$.next(fullName);
  }

  public getSurnameFromStore(){
    return this.surname$.asObservable();
  }

  public setSurnameFromStore(surname:string){
    this.surname$.next(surname);
  }

  public getIdNumFromStore(){
    return this.idNum$.asObservable();
  }

  public setIdNumFromStore(idnumm:string){
    this.idNum$.next(idnumm);
  }

  public getEmailFromStore(){
    return this.email$.asObservable();
  }

  public setEmailFromStore(emaill:string){
    this.email$.next(emaill);
  }

  public getCellphoneFromStore(){
    return this.cellphone$.asObservable();
  }

  public setCellPhoneFromStore(cellphonee:string){
    this.cellphone$.next(cellphonee);
  }

  public getUserIdFromStore(){
    return this.userid$.asObservable();
  }

  public setUserIdFromStore(userIdd:string){
    this.userid$.next(userIdd);
  }

  public getProfileImageFromStore(){
    return this.profileimage$.asObservable();
  }

  public setProfileImageFromStore(profileimagee:string){
    this.profileimage$.next(profileimagee);
  }

  public getRatingFromStore(){
    return this.rating$.asObservable();
  }

  public setRatingFromStore(ratingg:string){
    this.rating$.next(ratingg);
  }

  public getIdImageFromStore(){
    return this.idimage$.asObservable();
  }

  public setIdImageFromStore(idImagee:string){
    this.idimage$.next(idImagee);
  }
}

