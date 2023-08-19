import { Component, OnInit } from '@angular/core';
import { Equipment } from 'src/app/models/equipment/equipment.model';
import { EquipmentService } from 'src/app/services/equipment/equipment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { EquipmentSupplier } from 'src/app/models/equipment/equipmentSupplier.model';
import { Observable, tap } from 'rxjs';
import { Supplier } from 'src/app/models/supplier/supplier.model';
import { SupplierService } from 'src/app/services/supplier/supplier.service';

@Component({
  selector: 'app-view-equipment',
  templateUrl: './view-equipment.component.html',
  styleUrls: ['./view-equipment.component.scss']
})

export class ViewEquipmentComponent implements OnInit {

  constructor(private equipmentService: EquipmentService, private supplierService: SupplierService, private modalService: NgbModal) { }

  equipments: Equipment[] = [];
  equipmentName = "";
  equipmentSupplier: EquipmentSupplier[] = [];
  suppliers: Supplier[] = [];
  addUpdateSuppliers: Supplier[] = [];
  selectedSupplier: number | null = null;
  isSupplierListEmpty: boolean = true;
  searchTerm: string = '';
  isAddMode: boolean = true;
  output: string = '';


  addUpdateEquipmentRequest: Equipment = {
    equipment_ID: 0,
    equipment_Name: '',
    equipment_Description: '',
    equipment_Quantity_On_Hand: 0,
    equipment_Low_Level_Warning: 0,
    equipmentSupplier: [
      {
        equipmentSupplier_ID: 0,
        equipment_ID: 0,
        supplier_ID: 0,
        supplier: {
          supplier_ID: 0,
          supplier_Name: '',
          supplier_Phone_Number: '',
          supplier_Email_Address: '',
          supplier_Address: '',
          supplierType_ID: 0,
          supplierType: {
            supplierType_ID: 0,
            supplierType_Name: '',
          }
        },
      },
    ],
  };

  Equipment: Equipment = {
    equipment_ID: 0,
    equipment_Name: '',
    equipment_Description: '',
    equipment_Quantity_On_Hand: 0,
    equipment_Low_Level_Warning: 0,
    equipmentSupplier: [
      {
        equipmentSupplier_ID: 0,
        equipment_ID: 0,
        supplier_ID: 0,
        supplier: {
          supplier_ID: 0,
          supplier_Name: '',
          supplier_Phone_Number: '',
          supplier_Email_Address: '',
          supplier_Address: '',
          supplierType_ID: 0,
          supplierType: {
            supplierType_ID: 0,
            supplierType_Name: '',
          }
        },
      },
    ],
  };

  AddUpdateEquipmentSupplierRequest: EquipmentSupplier = {
    equipmentSupplier_ID: 0,
    equipment_ID: 0,
    supplier_ID: 0
  };

  ngOnInit(): void {
    this.GetAllEquipment();
  }

  GetAllEquipment(): void {
    this.equipmentService.getAllEquipments(this.searchTerm).subscribe({
      next: (equipment) => {
        this.equipments = equipment;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  OnSearch(): void {
    this.GetAllEquipment();
  }

  ClearSearchTerm(): void {
    this.searchTerm = '';
    this.OnSearch();
  }

  OpenAddModal(content:any){
    this.isAddMode = true;
    this.addUpdateEquipmentRequest = {
      equipment_ID: 0,
      equipment_Name: '',
      equipment_Description: '',
      equipment_Quantity_On_Hand: 0,
      equipment_Low_Level_Warning: 0
    };
    this.addUpdateSuppliers = [];
    this.GetAllSuppliers();
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  AddEquipment(success: any, failed:any) {
    this.Equipment = {
      equipment_ID: 0,
      equipment_Name: this.addUpdateEquipmentRequest.equipment_Name,
      equipment_Description: this.addUpdateEquipmentRequest.equipment_Description,
      equipment_Quantity_On_Hand: this.addUpdateEquipmentRequest.equipment_Quantity_On_Hand,
      equipment_Low_Level_Warning: this.addUpdateEquipmentRequest.equipment_Low_Level_Warning,
      suppliers: this.addUpdateSuppliers
    };
    console.log(this.Equipment); // Verify the content of this.Equipment
    this.equipmentService.AddEquipment(this.Equipment).subscribe({
      next: (equipment: Equipment) => {
        this.ngOnInit();
        const modalRef = this.modalService.open(success, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      },
      error: (response: any) => {
        console.log(response);
        const modalRef = this.modalService.open(failed, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      }
    });
  }

  LoadEquipment(id:number, content: any){
    this.GetAllSuppliers();
    this.isAddMode = false;
    if (!isNaN(id)) {
      this.equipmentService.loadEquipment(id)
      .subscribe({
        next: (response) => {
          this.addUpdateEquipmentRequest = response;
          const modalRef = this.modalService.open(content, {
            size: 'dialog-centered',
            backdrop: 'static'
          });
          this.loadSuppliersIntoArray();
        }
      })
    }
  }

  OpenUpdateModal(content:any){
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  UpdateEquipment(success: any, failed:any) {
    this.addUpdateEquipmentRequest = {
      equipment_ID: this.addUpdateEquipmentRequest.equipment_ID,
      equipment_Name: this.addUpdateEquipmentRequest.equipment_Name,
      equipment_Description: this.addUpdateEquipmentRequest.equipment_Description,
      equipment_Quantity_On_Hand: this.addUpdateEquipmentRequest.equipment_Quantity_On_Hand,
      equipment_Low_Level_Warning: this.addUpdateEquipmentRequest.equipment_Low_Level_Warning,
      suppliers: this.addUpdateSuppliers
    };
    this.equipmentService.updateEquipment(this.addUpdateEquipmentRequest).subscribe({
      next: (equipment: Equipment) => {
        this.ngOnInit();
        const modalRef = this.modalService.open(success, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      },
      error: (response: any) => {
        console.log(response);
        const modalRef = this.modalService.open(failed, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      }
    });
  }

  OpenAddUpdateConfirmDetailsModal(content: any) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.Equipment = this.addUpdateEquipmentRequest;
    // const selectedEquipmentType = this.equipmentSupplier.find(type => type.equipmentType_ID === Number(this.equipment.equipmentType_ID));
    // this.output = selectedEquipmentType ? selectedEquipmentType.equipmentType_Name : 'Cannot Find Equipment Type';
  }

  OpenDeleteModal(content: any, equipment: Equipment) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.Equipment = equipment;
  }

  DeleteEquipment(equipmentID: number, success: any, EquipmentAssociationError: any, failed: any) {
    this.equipmentService.deleteEquipment(equipmentID).subscribe({
      next: (response) => {
        this.equipments = this.equipments.filter(equipments => equipments.equipment_ID !== equipmentID);
        const modalRef = this.modalService.open(success, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      },
      error: (response) => {
        if (response && response.status === 400) {
          this.modalService.open(EquipmentAssociationError, {
            size: 'dialog-centered',
            backdrop: 'static'
          });
        } else {
          this.modalService.open(failed, {
            size: 'dialog-centered',
            backdrop: 'static'
          });
        }
      }
    });
  }

  LoadEquipmentSupplier(id:number): void {
    this.equipmentService.LoadEquipmentSupplier(id).subscribe({
      next: (equipmentSuppliers) => {
        this.AddUpdateEquipmentSupplierRequest = equipmentSuppliers;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  GetAllSuppliers(): void {
    this.supplierService.getAllSuppliers(this.searchTerm).subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  LoadSupplier(id: number, content: any) {
    this.isAddMode = false;
    if (!isNaN(id)) {
      this.equipmentService.loadEquipment(id).subscribe({
        next: (response) => {
          this.addUpdateEquipmentRequest = response;
          this.equipmentName = this.addUpdateEquipmentRequest.equipment_Name;
          this.loadSuppliersIntoArray();
          const modalRef = this.modalService.open(content, {
            size: 'lg',
            centered: true,
            backdrop: 'static'
          });
        }
      });
    }
  }

  loadSuppliersIntoArray() {
    this.addUpdateSuppliers = this.addUpdateEquipmentRequest.equipmentSupplier
      ?.map(supplierItem => supplierItem.supplier)
      .filter(supplier => supplier !== undefined) as Supplier[];
      this.isSupplierListEmpty = this.addUpdateSuppliers.length === 0;
  }  
  

  OpenEquipmentSupplierDeleteModal(content: any, id:number) {
    this.LoadEquipmentSupplier(id);
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.Equipment = this.addUpdateEquipmentRequest;
  }

  ConfirmEquipmentSupplierDelete(equipmentID: number, success: any, LastSupplierError: any, failed: any) {
    this.DeleteEquipmentSupplier(equipmentID).subscribe({
      next: () => {
        this.modalService.open(success, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      },
      error: (response) => {
        if (response && response.status === 400) {
          this.modalService.open(LastSupplierError, {
            size: 'dialog-centered',
            backdrop: 'static'
          });
        } else {
          this.modalService.open(failed, {
            size: 'dialog-centered',
            backdrop: 'static'
          });
        }
      }
    });
  }

  DeleteEquipmentSupplier(equipmentSupplierID: number): Observable<any> {
    return this.equipmentService.deleteEquipmentSupplier(equipmentSupplierID).pipe(
      tap({
        next: (response) => {
          this.equipmentSupplier = this.equipmentSupplier.filter(equipmentSupplier => equipmentSupplier.equipmentSupplier_ID !== equipmentSupplierID);
          this.addUpdateEquipmentRequest.equipmentSupplier = this.addUpdateEquipmentRequest.equipmentSupplier?.filter(
            (supplier) => supplier.equipmentSupplier_ID !== equipmentSupplierID
          );
        },
        error: (response) => {
          console.log(response);
        }
      })
    );
  }

  addSupplierToArray() {
    if (this.selectedSupplier) {
      const supplierToAdd = this.suppliers.find(supplier => supplier.supplier_ID === Number(this.selectedSupplier));
      if (supplierToAdd) {
        this.addUpdateSuppliers.push(supplierToAdd);
        this.selectedSupplier = null;
        this.isSupplierListEmpty = this.addUpdateSuppliers.length === 0;
      }
    }
  }

  deleteSupplierFromArray(supplier: Supplier) {
    const index = this.addUpdateSuppliers.findIndex(s => s.supplier_ID === supplier.supplier_ID);
    if (index !== -1) {
      this.addUpdateSuppliers.splice(index, 1);
    }
    this.isSupplierListEmpty = this.addUpdateSuppliers.length === 0;
  }
}
