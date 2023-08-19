import { Component, OnInit } from '@angular/core';
import { Supplier } from 'src/app/models/supplier/supplier.model';
import { SupplierService } from 'src/app/services/supplier/supplier.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { SupplierType } from 'src/app/models/supplier/supplierType.model';

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.component.html',
  styleUrls: ['./view-supplier.component.scss']
})
export class ViewSupplierComponent implements OnInit {

  constructor(private supplierService: SupplierService, private modalService: NgbModal) { }

  suppliers: Supplier[] = [];
  supplierTypes: SupplierType[] = [];
  searchTerm: string = '';
  isAddMode: boolean = true;
  output: string = '';

  addUpdateSupplierRequest: Supplier = {
    supplier_ID: 0,
    supplier_Name: '',
    supplier_Phone_Number: '',
    supplier_Email_Address: '',
    supplier_Address: '',
    supplierType_ID: 0
  };

  supplier: Supplier = {
    supplier_ID: 0,
    supplier_Name: '',
    supplier_Phone_Number: '',
    supplier_Email_Address: '',
    supplier_Address: '',
    supplierType_ID: 0
  };

  supplierType: SupplierType = {
    supplierType_ID: 0,
    supplierType_Name: ''
  };

  ngOnInit(): void {
    this.GetAllSuppliers();
    this.GetAllSupplierTypes();
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

  GetAllSupplierTypes(): void {
    this.supplierService.getAllSupplierTypes().subscribe({
      next: (supplierTypes) => {
        this.supplierTypes = supplierTypes;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  OnSearch(): void {
    this.GetAllSuppliers();
  }

  ClearSearchTerm(): void {
    this.searchTerm = '';
    this.OnSearch();
  }
  
  OpenAddModal(content:any){
    this.isAddMode = true;
    this.addUpdateSupplierRequest = {
      supplier_ID: 0,
      supplier_Name: '',
      supplier_Phone_Number: '',
      supplier_Email_Address: '',
      supplier_Address: '',
      supplierType_ID: 0
    };
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  AddSupplier(success:any, failed: any) {
    console.log(this.addUpdateSupplierRequest)
    this.supplierService.AddSupplier(this.addUpdateSupplierRequest).subscribe({
      next: (addUpdateSupplierRequest: Supplier) => {
        this. ngOnInit();
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

  LoadSupplier(id:number, content: any){
    this.isAddMode = false;
    if (!isNaN(id)) {
      this.supplierService.loadSupplier(id)
      .subscribe({
        next: (response) => {
          this.addUpdateSupplierRequest = response;
          const modalRef = this.modalService.open(content, {
            size: 'dialog-centered',
            backdrop: 'static'
          });
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

  UpdateSupplier(success:any, failed: any) {
    this.supplierService.updateSupplier(this.addUpdateSupplierRequest.supplier_ID, this.addUpdateSupplierRequest).subscribe({
      next: (response) => {
        this. GetAllSuppliers();
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
    this.supplier = this.addUpdateSupplierRequest;
    const selectedSupplierType = this.supplierTypes.find(type => type.supplierType_ID === Number(this.supplier.supplierType_ID));
    this.output = selectedSupplierType ? selectedSupplierType.supplierType_Name : 'Cannot Find Supplier Type';
  }

  OpenDeleteModal(content: any, supplier: Supplier) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.supplier = supplier;
  }

  DeleteSupplier(supplierID: number, success: any, failed: any, associationError: any) {
    this.supplierService.deleteSupplier(supplierID).subscribe({
      next: (response) => {
        this.suppliers = this.suppliers.filter(supplier => supplier.supplier_ID !== supplierID);
        const modalRef = this.modalService.open(success, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      },
      error: (response) => {
        if (response && response.status === 500) {
          this.modalService.open(associationError, {
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
}
