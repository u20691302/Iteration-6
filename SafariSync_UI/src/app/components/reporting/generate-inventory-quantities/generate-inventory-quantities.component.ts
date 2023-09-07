import { AfterViewInit, Component, OnInit, TemplateRef } from '@angular/core';
import { Stock } from 'src/app/models/stock/stock.model';
import { StockService } from 'src/app/services/stock/stock.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { StockSupplier } from 'src/app/models/stock/stockSupplier.model';
import { Observable, tap } from 'rxjs';
import { Supplier } from 'src/app/models/supplier/supplier.model';
import { SupplierService } from 'src/app/services/supplier/supplier.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl  } from '@angular/platform-browser';
import jsPDF, * as jspdf from 'jspdf';
import 'jspdf-autotable';

import { UserService } from 'src/app/services/user/user.service';
import { UserStoreService } from 'src/app/services/user/user-store.service';
import { EquipmentService } from 'src/app/services/equipment/equipment.service';
import { Equipment } from 'src/app/models/equipment/equipment.model';
import { EquipmentSupplier } from 'src/app/models/equipment/equipmentSupplier.model';
import { Report } from 'src/app/models/report/report.model';
import { ReportsService } from 'src/app/services/reports/reports.service';

@Component({
  selector: 'app-generate-inventory-quantities',
  templateUrl: './generate-inventory-quantities.component.html',
  styleUrls: ['./generate-inventory-quantities.component.scss']
})

export class GenerateInventoryQuantitiesComponent {

  constructor(private reportService: ReportsService,private equipmentService: EquipmentService, private sanitizer: DomSanitizer, private stockService: StockService, private supplierService: SupplierService, private modalService: NgbModal, private userService: UserService, private userStore: UserStoreService) { }

  stocks: Stock[] = [];
  stockName = "";
  stockSupplier: StockSupplier[] = [];
  suppliers: Supplier[] = [];
  addUpdateSuppliers: Supplier[] = [];
  selectedSupplier: number | null = null;
  isSupplierListEmpty: boolean = true;
  searchTerm: string = '';
  isAddMode: boolean = true;
  output: string = '';
  
  totalquan: number = 0;
  totalquan1: number = 0;
  totalquan2: number = 0;

  name: string = '';
  surname: string = '';
  fullName: string = '';
  retrievedUserID: number = 0;

  generatedPdf: any;
  pdfSrc: SafeResourceUrl = '';

  downloadReport: jsPDF = new jsPDF('portrait', 'px', 'a4');

  addUpdateStockRequest: Stock = {
    stock_ID: 0,
    stock_Name: '',
    stock_Description: '',
    stock_Quantity_On_Hand: 0,
    stock_Low_Level_Warning: 0,
    stockSupplier: [
      {
        stockSupplier_ID: 0,
        stock_ID: 0,
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

  Stock: Stock = {
    stock_ID: 0,
    stock_Name: '',
    stock_Description: '',
    stock_Quantity_On_Hand: 0,
    stock_Low_Level_Warning: 0,
    stockSupplier: [
      {
        stockSupplier_ID: 0,
        stock_ID: 0,
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

  AddUpdateStockSupplierRequest: StockSupplier = {
    stockSupplier_ID: 0,
    stock_ID: 0,
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
    this.GetAllStock();
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

  GetAllStock(): void {
    this.stockService.getAllStocksReport(this.searchTerm).subscribe({
      next: (stock) => {
        this.stocks = stock;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  OnSearch(): void {
    this.GetAllStock();
  }

  ClearSearchTerm(): void {
    this.searchTerm = '';
    this.OnSearch();
  }

  LoadStock(id:number, content: any){
    this.GetAllSuppliers();
    this.isAddMode = false;
    if (!isNaN(id)) {
      this.stockService.loadStock(id)
      .subscribe({
        next: (response) => {
          this.addUpdateStockRequest = response;
          const modalRef = this.modalService.open(content, {
            size: 'dialog-centered',
            backdrop: 'static'
          });
          this.loadSuppliersIntoArray();
        }
      })
    }
  }

  LoadStockSupplier(id:number): void {
    this.stockService.LoadStockSupplier(id).subscribe({
      next: (stockSuppliers) => {
        this.AddUpdateStockSupplierRequest = stockSuppliers;
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
      this.stockService.loadStock(id).subscribe({
        next: (response) => {
          this.addUpdateStockRequest = response;
          this.stockName = this.addUpdateStockRequest.stock_Name;
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
    this.addUpdateSuppliers = this.addUpdateStockRequest.stockSupplier
      ?.map(supplierItem => supplierItem.supplier)
      .filter(supplier => supplier !== undefined) as Supplier[];
      this.isSupplierListEmpty = this.addUpdateSuppliers.length === 0;
  }  
  
  generatePDF() {
    const doc = new (jspdf as any).jsPDF('portrait', 'px', 'a4');
  
    const fullnamee = "Generated By: " + this.fullName;
    const date = "Date Generated: " + new Date();
    const title = "Report Name: " + "Inventory Report";

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
  
    let startY = 80;
    addHeader(doc, true);
  
    // Generate stock table
    startY = this.generateStockTable(doc, startY);
  
    // Generate equipment table
    startY = this.generateEquipmentTable(doc, startY);
  
    // Calculate and add the total sum of quantities to the last row of both tables
    const totalQuantityStock = this.equipments.reduce((total, equipment) => total + equipment.equipment_Quantity_On_Hand, 0);
    const totalQuantityEquipment = this.equipments.reduce((total, equipment) => total + equipment.equipment_Quantity_On_Hand, 0);
  
    // Create a summary row and add it to the end of the tables
    const summaryRow = ['', 'Total', this.totalquan.toString()];
    doc.autoTable({
      startY: startY + 10,
      body: [summaryRow],
      head: [['', '', 'Total Quantity']],
      tableWidth: 'wrap',
      headStyles: { fillColor: '#869EC3' } // Adjust this value as needed
    });
  
    addFooter(doc);
  
    this.generatedPdf = new Blob([doc.output('blob')], { type: 'application/pdf' });
  
    const blobUrl = URL.createObjectURL(this.generatedPdf);
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  
    this.downloadReport = doc;
  }

  generateStockTable(doc: any, startY: number) {
    const tableData = [];
    const header = ['Stock ID', 'Stock Name', 'Quantity'];

    // Push header row
    tableData.push(header);

    // Iterate through equipments and add stock rows
    for (const stock of this.stocks) {
      const stockRow = [
        stock.stock_ID.toString(),
        stock.stock_Name,
        stock.stock_Quantity_On_Hand.toString()
      ];
      tableData.push(stockRow);
      this.totalquan1 += stock.stock_Quantity_On_Hand; // Accumulate quantities
      
    }
    this.totalquan = this.totalquan1;

    // Add total row
    const totalRow = ['', 'Total', this.totalquan1.toString()];
    tableData.push(totalRow);

    doc.autoTable({
      head: [header],
      body: tableData.slice(1),
      startY: startY,
      headStyles: { fillColor: '#869EC3' }
    });

    // Update startY for the next table
    return doc.autoTable.previous.finalY + 20;
  }

  generateEquipmentTable(doc: any, startY: number) {
    const tableData = [];
    const header = ['Equipment ID', 'Equipment Name', 'Quantity'];

    // Push header row
    tableData.push(header);

    // Iterate through equipments and add equipment rows
    for (const equipment of this.equipments) {
      const equipmentRow = [
        equipment.equipment_ID.toString(),
        equipment.equipment_Name,
        equipment.equipment_Quantity_On_Hand.toString()
      ];
      tableData.push(equipmentRow);

      this.totalquan2 += equipment.equipment_Quantity_On_Hand;
    }
    this.totalquan += this.totalquan2;

    // Add total row
    const totalRow = ['', 'Total', this.totalquan2.toString()];
    tableData.push(totalRow);

    doc.autoTable({
      head: [header],
      body: tableData.slice(1),
      startY: startY,
      headStyles: { fillColor: '#869EC3' }
    });

    // Update startY for the next table
    return doc.autoTable.previous.finalY + 20;
  }



  OpenPDFModal(content: any) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  async SaveReport() {
    const blobUrl = URL.createObjectURL(this.generatedPdf);

    // Convert the blob URL to base64
    const pdfBlob = await fetch(blobUrl).then(response => response.blob());
    const pdfBlobBuffer = await pdfBlob.arrayBuffer();
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBlobBuffer)));

    this.saveReportRequest = {
      report_ID: 0,
      report_Title: 'Inventory Report',
      createdAt: new Date(),
      user_ID: this.retrievedUserID,
      pdfUrl: pdfBase64 // Add the serialized PDF data here
    };

    this.reportService.SaveReport(this.saveReportRequest)
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

  downloadPDF() {
    this.downloadReport.save('Inventory Report' + ' ' + new Date());
  }



/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

equipments: Equipment[] = [];
  equipmentName = "";
  equipmentSupplier: EquipmentSupplier[] = [];
  suppliersEquip: Supplier[] = [];
  addUpdateSuppliersEquip: Supplier[] = [];
  selectedSupplierEquip: number | null = null;
  isSupplierListEmptyEquip: boolean = true;
  searchTermEquip: string = '';
  isAddModeEquip: boolean = true;
  outputEquip: string = '';


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


  GetAllEquipment(): void {
    this.equipmentService.getAllEquipmentsReport(this.searchTermEquip).subscribe({
      next: (equipment) => {
        this.equipments = equipment;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  OnSearchEquip(): void {
    this.GetAllEquipment();
  }

  ClearSearchTermEquip(): void {
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

  GetAllSuppliersEquip(): void {
    this.supplierService.getAllSuppliers(this.searchTerm).subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  LoadSupplierEquip(id: number, content: any) {
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

  loadSuppliersIntoArrayEquip() {
    this.addUpdateSuppliers = this.addUpdateEquipmentRequest.equipmentSupplier
      ?.map(supplierItem => supplierItem.supplier)
      .filter(supplier => supplier !== undefined) as Supplier[];
      this.isSupplierListEmpty = this.addUpdateSuppliers.length === 0;
  }  


  calculateTotalQuantity(items: any[]): number {
    return items.reduce((total, item) => total + item.stock_Quantity_On_Hand, 0);
  }

  calculateTotalQuantityEquip(items: any[]): number {
    return items.reduce((total, item) => total + item.equipment_Quantity_On_Hand, 0);
  }

}