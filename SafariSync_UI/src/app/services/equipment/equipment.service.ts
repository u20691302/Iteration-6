import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Equipment } from 'src/app/models/equipment/equipment.model';
import { EquipmentSupplier } from 'src/app/models/equipment/equipmentSupplier.model';
import { Supplier } from 'src/app/models/supplier/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }

  AddEquipment(addEquipmentRequest: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(this.baseApiUrl + '/api/Equipment/AddEquipment/',addEquipmentRequest);
  }

  AddEquipmentSupplier(addEquipmentSupplierRequest: EquipmentSupplier): Observable<EquipmentSupplier> {
    return this.http.post<EquipmentSupplier>(this.baseApiUrl + '/api/Equipment/AddEquipment/', addEquipmentSupplierRequest);
  }

  getAllEquipments(term: string): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.baseApiUrl}/api/Equipment/ReadAllEquipmentAsync`).pipe(
      map(equipments => {
        if (term === null) {
          return equipments;
        }
        
        const filteredEquipments = equipments.filter((equipment: Equipment) =>
          equipment.equipment_Name.toLowerCase().includes(term.toLowerCase()) ||
          equipment.equipment_Description.toLowerCase().includes(term.toLowerCase()) ||
          equipment.equipment_Quantity_On_Hand.toString().toLowerCase().includes(term.toLowerCase()) ||
          equipment.equipment_Low_Level_Warning.toString().toLowerCase().includes(term.toLowerCase()) ||
          equipment.equipmentSupplier?.some(
            (supplier: EquipmentSupplier) => supplier.supplier?.supplier_Name.toLowerCase().includes(term.toLowerCase())
          )
        );
        
        return filteredEquipments;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  LoadEquipmentSupplier(equipmentSupplierId: number): Observable<EquipmentSupplier> {
    return this.http.get<EquipmentSupplier>(this.baseApiUrl + '/api/Equipment/ReadOneEquipmentSupplierAsync/' + equipmentSupplierId)
  }
      
  loadEquipment(equipmentID: number): Observable<Equipment> {
    return this.http.get<Equipment>(this.baseApiUrl + '/api/Equipment/ReadOneEquipmentAsync/' + equipmentID)
  }

  updateEquipment(updateEquipmentRequest: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(this.baseApiUrl + '/api/Equipment/UpdateEquipmentAsync/', updateEquipmentRequest);
  }

  deleteEquipment(equipmentID: number): Observable<Equipment> {
    return this.http.delete<Equipment>(this.baseApiUrl + '/api/Equipment/DeleteEquipment/' + equipmentID);
  }

  deleteEquipmentSupplier(equipmentSupplierID: number): Observable<EquipmentSupplier> {
    return this.http.delete<EquipmentSupplier>(this.baseApiUrl + '/api/Equipment/DeleteEquipmentSupplier/' + equipmentSupplierID);
  }

  getAllEquipmentsReport(term: string): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.baseApiUrl}/api/Equipment/ReadAllEquipmentAsync`).pipe(
      map(equipments => {
        if (term === null) {
          return equipments;
        }
        
        const filteredEquipments = equipments.filter((equipment: Equipment) =>
          equipment.equipment_Name.toLowerCase().includes(term.toLowerCase()) ||
          equipment.equipment_Description.toLowerCase().includes(term.toLowerCase()) ||
          equipment.equipment_Quantity_On_Hand.toString().toLowerCase().includes(term.toLowerCase())
        );
        
        return filteredEquipments;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }
}
