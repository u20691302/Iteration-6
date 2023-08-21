import { Component, OnInit } from '@angular/core';
import { Equipment } from 'src/app/models/equipment/equipment.model';
import { EquipmentService } from 'src/app/services/equipment/equipment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { EquipmentSupplier } from 'src/app/models/equipment/equipmentSupplier.model';
import { Observable, tap } from 'rxjs';
import { Supplier } from 'src/app/models/supplier/supplier.model';
import { SupplierService } from 'src/app/services/supplier/supplier.service';
import jsPDF, * as jspdf from 'jspdf';
import { Report } from 'src/app/models/report/report.model';
import 'jspdf-autotable';
import {UserOptions} from "jspdf-autotable"
import { UserService } from 'src/app/services/user/user.service';
import { UserStoreService } from 'src/app/services/user/user-store.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl  } from '@angular/platform-browser';
import { ReportsService } from 'src/app/services/reports/reports.service';


interface jsPDFWithPlugin extends jspdf.jsPDF {
  autotable: (options: UserOptions) => jspdf.jsPDF;
}


@Component({
  selector: 'app-generate-equipment-report',
  templateUrl: './generate-equipment-report.component.html',
  styleUrls: ['./generate-equipment-report.component.scss']
})
export class GenerateEquipmentReportComponent implements OnInit{

  constructor(private reportsService: ReportsService, private sanitizer: DomSanitizer, private equipmentService: EquipmentService, private supplierService: SupplierService, private modalService: NgbModal, private userStore:UserStoreService, private userService: UserService) { }

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
  name: string = '';
  surname: string = '';
  fullName: string = '';

  generatedPdf: any;
  pdfSrc: SafeResourceUrl = '';

  downloadReport: jsPDF = new jsPDF('portrait', 'px', 'a4');
  retrievedUserID: number = 0;


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

  saveReportRequest: Report = {
    report_ID: 0,
    report_Title: '',
    createdAt: new Date(),
    user_ID: 0,
    pdfUrl: ''
  };

  ngOnInit(): void {
    this.GetAllEquipment();
    
    this.userStore.getUserIdFromStore().subscribe(val => {
      let idFromToken = this.userService.getUserIdFromToken();
      this.retrievedUserID = val || idFromToken;
    });

    this.userStore.getFullNameFromStore().subscribe(val => {
      let fullNameFromToken = this.userService.getFullNameFromToekn();
      this.name = val || fullNameFromToken;
    });

    this.userStore.getSurnameFromStore().subscribe(val => {
      let fullNameFromToken = this.userService.getSurnameFromToken();
      this.surname = val || fullNameFromToken;
    });

    this.fullName = this.name + ' ' + this.surname;
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
  

  generatePDF() {
    const doc = new (jspdf as any).jsPDF('portrait', 'px', 'a4');

    const fullnamee = "Generated By: " + this.fullName;
    const date = "Date Generated: " + new Date(); 
    const title = "Report Name: " + "Equipment Report"; 

  
    function addHeader(doc: any, isFirstPage: boolean) {
      const headerText = 'SafariSync';
      const headerHeight = 30;
      const headerColor = '#001844';
  
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(12);
        doc.setTextColor(255);
        doc.setFillColor(headerColor);
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), headerHeight, 'F');
  
        // Calculate the width of the text
        const textWidth = doc.getStringUnitWidth(headerText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  
        // Calculate the x position to center the text
        const xPosition = (doc.internal.pageSize.getWidth() - textWidth) / 2;
  
        doc.text(headerText, xPosition, headerHeight / 2);
  
        // Add titles only on the first page
        if (isFirstPage) {
          const titles = [title, fullnamee, date];
          const titleFontSize = 12;
          const titleSpacing = 1; // Adjust the spacing between titles
          const titleStartY = headerHeight + 20; // Adjust the initial Y position
  
          doc.setFontSize(titleFontSize);
          doc.setTextColor(0); // Set title text color to black
  
          // Add different titles underneath each other
          for (let j = 0; j < titles.length; j++) {
            const title = titles[j];
            const titleY = titleStartY + j * (titleFontSize + titleSpacing);
            const titleXPosition = 10; // Adjust this value as needed
            doc.text(title, titleXPosition, titleY);
          }
        }
      }
    }

    function addFooter(doc: any) {
      const footerHeight = 30;
      const footerColor = '#FF0000'; // Red color
    
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(footerColor);
        doc.rect(0, doc.internal.pageSize.getHeight() - footerHeight, doc.internal.pageSize.getWidth(), footerHeight, 'F');
        doc.setFontSize(12);
        doc.setTextColor(255);
        doc.text("EPI-USE", 10, doc.internal.pageSize.getHeight() - footerHeight / 2);
    
        // Add the image to the bottom right of the footer
        const imageWidth = 50; // Adjust the width of the image as needed
        const imageHeight = 20; // Adjust the height of the image as needed
        const imageX = doc.internal.pageSize.getWidth() - imageWidth - 10; // Adjust the X position
        const imageY = doc.internal.pageSize.getHeight() - footerHeight + (footerHeight - imageHeight) / 2;
        doc.addImage('/assets/EPI-USE/EPI-USE Logo.jpg', 'jpg', imageX, imageY, imageWidth, imageHeight);
      }
    }
    
  
    let startY = 80; // Initialize the startY position (including space after header)
    addHeader(doc, true); // Pass true for the first page
  
    // Start with the first stock item
    if (this.equipments.length > 0) {
      const firstStock = this.equipments[0];
  
      // Add stock table
      this.addStockTable(doc, firstStock, startY);
      startY = doc.autoTable.previous.finalY + 0; // Update startY with spacing
  
      // Add supplier table
      this.addSupplierTable(doc, firstStock, startY);
      startY = doc.autoTable.previous.finalY + 50; // Update startY with spacing
    }
  
    // Iterate through stocks and generate tables, starting from the second stock
    for (let i = 1; i < this.equipments.length; i++) {
      const stock = this.equipments[i];
  
      // Add stock table
      this.addStockTable(doc, stock, startY);
      startY = doc.autoTable.previous.finalY + 0; // Update startY with spacing
  
      // Add supplier table
      this.addSupplierTable(doc, stock, startY);
      startY = doc.autoTable.previous.finalY + 50; // Update startY with spacing
    }
  
    addFooter(doc);

    this.generatedPdf = new Blob([doc.output('blob')], { type: 'application/pdf' });

    const blobUrl = URL.createObjectURL(this.generatedPdf);
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);

    this.downloadReport = doc;
    this.SaveReport();
  }

  // Add stock table
  // Modify the addStockTable function
addStockTable(doc: any, equipment: Equipment, startY: number) {
  const tableData = [];
  const header = ['Stock ID', 'Stock Name', 'Description', 'Quantity', 'Low Level Warning'];

  // Push header row
  tableData.push(header);

  // Add stock row
  const stockRow = [
    equipment.equipment_ID.toString(),
    equipment.equipment_Name,
    equipment.equipment_Description,
    equipment.equipment_Quantity_On_Hand.toString(),
    equipment.equipment_Low_Level_Warning.toString()
  ];
  tableData.push(stockRow);

  // Create a table using autotable function
  doc.autoTable({
    head: [header],
    body: [stockRow],
    startY: startY + 20, // Add 20 pixels to the startY position
    headStyles: { fillColor: '#FF0000' }// Set the header color

  });
}

// Modify the addSupplierTable function
addSupplierTable(doc: any, equipment: Equipment, startY: number) {
  if (equipment.equipmentSupplier && equipment.equipmentSupplier.length > 0) {
    const tableData: any[] = []; // Explicitly define the type here
    const header = ['Supplier Name', 'Phone Number', 'Email Address'];

    let isFirstSupplierTable = true; // Flag to track the first supplier table

    // Iterate through suppliers and populate table data
    equipment.equipmentSupplier.forEach(supplierItem => {
      if (isFirstSupplierTable) {
        tableData.push(header);
        isFirstSupplierTable = false;
      }

      const supplierRow = [
        supplierItem.supplier?.supplier_Name,
        supplierItem.supplier?.supplier_Phone_Number,
        supplierItem.supplier?.supplier_Email_Address
      ];
      tableData.push(supplierRow);
    });

    // Create a table using autotable function
    doc.autoTable({
      head: [header], // Include the header here only once
      body: tableData.slice(1), // Exclude the duplicated header from data
      startY: startY + 20,// Add 20 pixels to the startY position
      headStyles: { fillColor: '#869EC3' }// Set the header color
    });
  }
}

OpenPDFModal(content:any){
  const modalRef = this.modalService.open(content, {
    size: 'dialog-centered',
    backdrop: 'static'
  });
}

downloadPDF(){
  this.downloadReport.save('Equipment Report' + ' ' + new Date())
}

SaveReport() {
  // Convert the jsPDF object to a URL
  const blobUrl = URL.createObjectURL(this.generatedPdf);

  this.saveReportRequest = {
    report_ID: 0,
    report_Title: 'Equipment Report',
    createdAt: new Date(),
    user_ID: this.retrievedUserID,
    pdfUrl: blobUrl
  };

  this.reportsService.SaveReport(this.saveReportRequest)
    .subscribe(
      (response) => {
        console.log('Report saved successfully:', response);
        // Handle success, you can show a success message or perform other actions
      },
      (error) => {
        console.error('Error saving report:', error);
        // Handle error, you can show an error message or perform other actions
      }
    );
}

  



}
