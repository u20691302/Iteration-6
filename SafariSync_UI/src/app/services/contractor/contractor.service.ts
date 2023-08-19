import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Contractor } from 'src/app/models/contractor/contractor.model';
import { ContractorType } from 'src/app/models/contractor/contractorType.model';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }

  AddContractor(addContractorRequest: Contractor): Observable<Contractor> {
    return this.http.post<Contractor>(this.baseApiUrl + '/api/Contractor/AddContractor/', addContractorRequest);
  }

  getAllContractors(term: string): Observable<Contractor[]> {
    return this.http.get<Contractor[]>(`${this.baseApiUrl}/api/Contractor/ReadAllContractorsAsync`).pipe(
      map(contractors => {
        if (term === null) {
          return contractors;
        }
        
        const filteredContractors = contractors.filter((contractor: Contractor) =>
          contractor.contractor_Name.toLowerCase().includes(term.toLowerCase()) ||
          contractor.contractor_Phone_Number.toLowerCase().includes(term.toLowerCase()) ||
          contractor.contractor_Email_Address.toLowerCase().includes(term.toLowerCase()) ||
          contractor.contractor_Address.toLowerCase().includes(term.toLowerCase()) || 
          contractor.contractorType?.contractorType_Name.toLowerCase().includes(term.toLowerCase())
        );
        
        return filteredContractors;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  getAllContractorTypes(): Observable<ContractorType[]> {
    return this.http.get<ContractorType[]>(`${this.baseApiUrl}/api/Contractor/ReadAllContractorTypesAsync`).pipe(
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }
  
  loadContractor(contractorID: number): Observable<Contractor> {
    return this.http.get<Contractor>(this.baseApiUrl + '/api/Contractor/ReadOneContractorAsync/' + contractorID)
  }

  updateContractor(contractorID: number, updateContractorRequest: Contractor): Observable<Contractor> {
    return this.http.put<Contractor>(this.baseApiUrl + '/api/Contractor/UpdateContractorAsync/' + contractorID, updateContractorRequest);
  }

  deleteContractor(contractorID: number): Observable<Contractor> {
    return this.http.delete<Contractor>(this.baseApiUrl + '/api/Contractor/DeleteContractor/' + contractorID);
  }
}
