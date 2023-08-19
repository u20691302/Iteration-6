import { Component, OnInit } from '@angular/core';
import { Stock } from 'src/app/models/stock/stock.model';
import { StockService } from 'src/app/services/stock/stock.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { StockSupplier } from 'src/app/models/stock/stockSupplier.model';
import { Observable, tap } from 'rxjs';
import { Supplier } from 'src/app/models/supplier/supplier.model';
import { SupplierService } from 'src/app/services/supplier/supplier.service';

@Component({
  selector: 'app-view-stock',
  templateUrl: './view-stock.component.html',
  styleUrls: ['./view-stock.component.scss']
})

export class ViewStockComponent implements OnInit {

  constructor(private stockService: StockService, private supplierService: SupplierService, private modalService: NgbModal) { }

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

  ngOnInit(): void {
    this.GetAllStock();
  }

  GetAllStock(): void {
    this.stockService.getAllStocks(this.searchTerm).subscribe({
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

  OpenAddModal(content:any){
    this.isAddMode = true;
    this.addUpdateStockRequest = {
      stock_ID: 0,
      stock_Name: '',
      stock_Description: '',
      stock_Quantity_On_Hand: 0,
      stock_Low_Level_Warning: 0
    };
    this.addUpdateSuppliers = [];
    this.GetAllSuppliers();
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  AddStock(success: any, failed:any) {
    this.Stock = {
      stock_ID: 0,
      stock_Name: this.addUpdateStockRequest.stock_Name,
      stock_Description: this.addUpdateStockRequest.stock_Description,
      stock_Quantity_On_Hand: this.addUpdateStockRequest.stock_Quantity_On_Hand,
      stock_Low_Level_Warning: this.addUpdateStockRequest.stock_Low_Level_Warning,
      suppliers: this.addUpdateSuppliers
    };
    console.log(this.Stock); // Verify the content of this.Stock
    this.stockService.AddStock(this.Stock).subscribe({
      next: (stock: Stock) => {
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

  OpenUpdateModal(content:any){
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  UpdateStock(success: any, failed:any) {
    this.addUpdateStockRequest = {
      stock_ID: this.addUpdateStockRequest.stock_ID,
      stock_Name: this.addUpdateStockRequest.stock_Name,
      stock_Description: this.addUpdateStockRequest.stock_Description,
      stock_Quantity_On_Hand: this.addUpdateStockRequest.stock_Quantity_On_Hand,
      stock_Low_Level_Warning: this.addUpdateStockRequest.stock_Low_Level_Warning,
      suppliers: this.addUpdateSuppliers
    };
    this.stockService.updateStock(this.addUpdateStockRequest).subscribe({
      next: (stock: Stock) => {
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
    this.Stock = this.addUpdateStockRequest;
    // const selectedStockType = this.stockSupplier.find(type => type.stockType_ID === Number(this.stock.stockType_ID));
    // this.output = selectedStockType ? selectedStockType.stockType_Name : 'Cannot Find Stock Type';
  }

  OpenDeleteModal(content: any, stock: Stock) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.Stock = stock;
  }

  DeleteStock(stockID: number, success: any, StockAssociationError: any, failed: any) {
    this.stockService.deleteStock(stockID).subscribe({
      next: (response) => {
        this.stocks = this.stocks.filter(stocks => stocks.stock_ID !== stockID);
        const modalRef = this.modalService.open(success, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      },
      error: (response) => {
        if (response && response.status === 400) {
          this.modalService.open(StockAssociationError, {
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
  

  OpenStockSupplierDeleteModal(content: any, id:number) {
    this.LoadStockSupplier(id);
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.Stock = this.addUpdateStockRequest;
  }

  ConfirmStockSupplierDelete(stockID: number, success: any, LastSupplierError: any, failed: any) {
    this.DeleteStockSupplier(stockID).subscribe({
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

  DeleteStockSupplier(stockSupplierID: number): Observable<any> {
    return this.stockService.deleteStockSupplier(stockSupplierID).pipe(
      tap({
        next: (response) => {
          this.stockSupplier = this.stockSupplier.filter(stockSupplier => stockSupplier.stockSupplier_ID !== stockSupplierID);
          this.addUpdateStockRequest.stockSupplier = this.addUpdateStockRequest.stockSupplier?.filter(
            (supplier) => supplier.stockSupplier_ID !== stockSupplierID
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
