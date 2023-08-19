import { Component, OnInit } from '@angular/core';
import { Contractor } from 'src/app/models/contractor/contractor.model';
import { ContractorService } from 'src/app/services/contractor/contractor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ContractorType } from 'src/app/models/contractor/contractorType.model';

@Component({
  selector: 'app-view-contractor',
  templateUrl: './view-contractor.component.html',
  styleUrls: ['./view-contractor.component.scss']
})
export class ViewContractorComponent implements OnInit {

  constructor(private contractorService: ContractorService, private modalService: NgbModal) { }

  contractors: Contractor[] = [];
  contractorTypes: ContractorType[] = [];
  searchTerm: string = '';
  isAddMode: boolean = true;
  output: string = '';

  addUpdateContractorRequest: Contractor = {
    contractor_ID: 0,
    contractor_Name: '',
    contractor_Phone_Number: '',
    contractor_Email_Address: '',
    contractor_Address: '',
    contractorType_ID: 0
  };

  contractor: Contractor = {
    contractor_ID: 0,
    contractor_Name: '',
    contractor_Phone_Number: '',
    contractor_Email_Address: '',
    contractor_Address: '',
    contractorType_ID: 0
  };

  contractorType: ContractorType = {
    contractorType_ID: 0,
    contractorType_Name: ''
  };

  ngOnInit(): void {
    this.GetAllContractors();
    this.GetAllContractorTypes();
  }

  GetAllContractors(): void {
    this.contractorService.getAllContractors(this.searchTerm).subscribe({
      next: (contractors) => {
        this.contractors = contractors;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  GetAllContractorTypes(): void {
    this.contractorService.getAllContractorTypes().subscribe({
      next: (contractorTypes) => {
        this.contractorTypes = contractorTypes;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  OnSearch(): void {
    this.GetAllContractors();
  }

  ClearSearchTerm(): void {
    this.searchTerm = '';
    this.OnSearch();
  }
  
  OpenAddModal(content:any){
    this.isAddMode = true;
    this.addUpdateContractorRequest = {
      contractor_ID: 0,
      contractor_Name: '',
      contractor_Phone_Number: '',
      contractor_Email_Address: '',
      contractor_Address: '',
      contractorType_ID: 0
    };
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  AddContractor(success:any, failed: any) {
    console.log(this.addUpdateContractorRequest)
    this.contractorService.AddContractor(this.addUpdateContractorRequest).subscribe({
      next: (addUpdateContractorRequest: Contractor) => {
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

  LoadContractor(id:number, content: any){
    this.isAddMode = false;
    if (!isNaN(id)) {
      this.contractorService.loadContractor(id)
      .subscribe({
        next: (response) => {
          this.addUpdateContractorRequest = response;
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

  UpdateContractor(success:any, failed: any) {
    this.contractorService.updateContractor(this.addUpdateContractorRequest.contractor_ID, this.addUpdateContractorRequest).subscribe({
      next: (response) => {
        this. GetAllContractors();
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
    this.contractor = this.addUpdateContractorRequest;
    const selectedContractorType = this.contractorTypes.find(type => type.contractorType_ID === Number(this.contractor.contractorType_ID));
    this.output = selectedContractorType ? selectedContractorType.contractorType_Name : 'Cannot Find Contractor Type';
  }

  OpenDeleteModal(content: any, contractor: Contractor) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.contractor = contractor;
  }

  DeleteContractor(contractorID: number, success: any, failed: any, associationError: any) {
    this.contractorService.deleteContractor(contractorID).subscribe({
      next: (response) => {
        this.contractors = this.contractors.filter(contractor => contractor.contractor_ID !== contractorID);
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
