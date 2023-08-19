import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Supplier } from 'src/app/models/supplier/supplier.model';
import { SupplierType } from 'src/app/models/supplier/supplierType.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }

  AddSupplier(addSupplierRequest: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.baseApiUrl + '/api/Supplier/AddSupplier/', addSupplierRequest);
  }

  getAllSuppliers(term: string): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.baseApiUrl}/api/Supplier/ReadAllSuppliersAsync`).pipe(
      map(suppliers => {
        if (term === null) {
          return suppliers;
        }
        
        const filteredSuppliers = suppliers.filter((supplier: Supplier) =>
          supplier.supplier_Name.toLowerCase().includes(term.toLowerCase()) ||
          supplier.supplier_Phone_Number.toLowerCase().includes(term.toLowerCase()) ||
          supplier.supplier_Email_Address.toLowerCase().includes(term.toLowerCase()) ||
          supplier.supplier_Address.toLowerCase().includes(term.toLowerCase()) || 
          supplier.supplierType?.supplierType_Name.toLowerCase().includes(term.toLowerCase())
        );
        
        return filteredSuppliers;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  getAllSupplierTypes(): Observable<SupplierType[]> {
    return this.http.get<SupplierType[]>(`${this.baseApiUrl}/api/Supplier/ReadAllSupplierTypesAsync`).pipe(
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }
  
  loadSupplier(supplierID: number): Observable<Supplier> {
    return this.http.get<Supplier>(this.baseApiUrl + '/api/Supplier/ReadOneSupplierAsync/' + supplierID)
  }

  updateSupplier(supplierID: number, updateSupplierRequest: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(this.baseApiUrl + '/api/Supplier/UpdateSupplierAsync/' + supplierID, updateSupplierRequest);
  }

  deleteSupplier(supplierID: number): Observable<Supplier> {
    return this.http.delete<Supplier>(this.baseApiUrl + '/api/Supplier/DeleteSupplier/' + supplierID);
  }
}
