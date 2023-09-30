import { Component, OnInit } from '@angular/core';
import { Toolbox } from 'src/app/models/toolbox/toolbox.model';
import { ToolboxService } from 'src/app/services/toolbox/toolbox.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, tap } from 'rxjs';
import { ToolboxEquipment } from 'src/app/models/toolbox/toolboxEquipment.model';
import { Equipment } from 'src/app/models/equipment/equipment.model';
import { ToolboxStock } from 'src/app/models/toolbox/toolboxStock.model';
import { EquipmentService } from 'src/app/services/equipment/equipment.service';
import { StockService } from 'src/app/services/stock/stock.service';
import { Stock } from 'src/app/models/stock/stock.model';


@Component({
  selector: 'app-view-toolbox',
  templateUrl: './view-toolbox.component.html',
  styleUrls: ['./view-toolbox.component.scss']
})

export class ViewToolboxComponent implements OnInit {

  constructor(private toolboxService: ToolboxService, private equipmentService: EquipmentService, private stockService: StockService,  private modalService: NgbModal) { }

  toolboxes: Toolbox[] = [];
  toolboxName = "";
  toolboxEquipment: ToolboxEquipment[] = [];
  toolboxStock: ToolboxStock[] = [];
  Equipment: Equipment[] = [];
  Stock: Stock[] = [];
  // filteredToolboxItems: ToolboxEquipment[] = [];
  // addUpdateEquipments: Equipment[] = [];
  searchTerm: string = '';
  // searchEquipmentTerm: string = '';
  isAddMode: boolean = true;
  selectedEquipment: number  = 0;
  equipmentQuantity: number = 0;
  selectedStock: number = 0;
  stockQuantity: number = 0;
  equipmentName: string = "";
  stockName: string = "";

  addUpdateToolboxRequest: Toolbox = {
    toolbox_ID: 0,
    toolbox_Name: '',
    toolbox_Description: '',
    toolboxEquipment: [
      {
        toolboxEquipment_ID: 0,
        toolbox_ID: 0,
        equipment_ID: 0,
        quantity: 0,
        equipment: {
          equipment_ID: 0,
          equipment_Name: '',
          equipment_Description: '',
          equipment_Quantity_On_Hand: 0,
          equipment_Low_Level_Warning: 0
        },
      },
    ],
    toolboxStock: [
      {
        toolboxStock_ID: 0,
        toolbox_ID: 0,
        stock_ID: 0,
        quantity: 0,
        stock: {
          stock_ID: 0,
          stock_Name: '',
          stock_Description: '',
          stock_Quantity_On_Hand: 0,
          stock_Low_Level_Warning: 0
        },
      },
    ]
  };

  Toolbox: Toolbox = {
    toolbox_ID: 0,
    toolbox_Name: '',
    toolbox_Description: '',
    toolboxEquipment: [
      {
        toolboxEquipment_ID: 0,
        toolbox_ID: 0,
        equipment_ID: 0,
        quantity: 0,
        equipment: {
          equipment_ID: 0,
          equipment_Name: '',
          equipment_Description: '',
          equipment_Quantity_On_Hand: 0,
          equipment_Low_Level_Warning: 0
        },
      },
    ],
    toolboxStock: [
      {
        toolboxStock_ID: 0,
        toolbox_ID: 0,
        stock_ID: 0,
        quantity: 0,
        stock: {
          stock_ID: 0,
          stock_Name: '',
          stock_Description: '',
          stock_Quantity_On_Hand: 0,
          stock_Low_Level_Warning: 0
        },
      },
    ]
  };

  AddUpdateToolboxEquipmentRequest: ToolboxEquipment = {
    toolboxEquipment_ID: 0,
    toolbox_ID: 0,
    equipment_ID: 0,
    quantity: 0,
    equipment: {
      equipment_ID: 0,
      equipment_Name: '',
      equipment_Description: '',
      equipment_Quantity_On_Hand: 0,
      equipment_Low_Level_Warning: 0
    },
  };

  AddUpdateToolboxStockRequest: ToolboxStock = {
    toolboxStock_ID: 0,
    toolbox_ID: 0,
    stock_ID: 0,
    quantity: 0,
    stock: {
      stock_ID: 0,
      stock_Name: '',
      stock_Description: '',
      stock_Quantity_On_Hand: 0,
      stock_Low_Level_Warning: 0
    },
  };

  ngOnInit(): void {
    this.GetAllToolbox();
  }

  GetAllToolbox(): void {
    this.toolboxService.getAllToolbox(this.searchTerm).subscribe({
      next: (toolboxes) => {
        this.toolboxes = toolboxes;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  OnSearch(): void {
    this.GetAllToolbox();
  }

  ClearSearchTerm(): void {
    this.searchTerm = '';
    this.OnSearch();
  }

  OpenAddModal(content:any){
    this.isAddMode = true;
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  AddToolbox(success: any, failed:any) {
    
    this.toolboxService.AddToolbox(this.Toolbox).subscribe({
      next: (toolbox: Toolbox) => {
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

  LoadToolbox(id:number){
    this.isAddMode = false;
    if (!isNaN(id)) {
      this.toolboxService.loadToolbox(id)
      .subscribe({
        next: (response) => {
          this.addUpdateToolboxRequest = response;
        }
      })
    }
  }

  OpenUpdateModal(id:number, content: any){
    this.LoadToolbox(id);
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  UpdateToolbox(success: any, failed:any) {
    this.toolboxService.updateToolbox(this.addUpdateToolboxRequest).subscribe({
      next: (toolbox: Toolbox) => {
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
    this.Toolbox = this.addUpdateToolboxRequest;
  }

  OpenDeleteModal(content: any, toolbox: Toolbox) {
    const modalRef = this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
    this.Toolbox = toolbox;
  }

  DeleteToolbox(toolboxID: number, success: any, ToolboxAssociationError:any, failed: any) {
    this.toolboxService.deleteToolbox(toolboxID).subscribe({
      next: (response) => {
        this.toolboxes = this.toolboxes.filter(toolboxes => toolboxes.toolbox_ID !== toolboxID);
        const modalRef = this.modalService.open(success, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      },
      error: (response) => {
        if (response && response.status === 400) {
          this.modalService.open(ToolboxAssociationError, {
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

  OpenToolboxItemsModal(id:number, content: any) {
    this.LoadToolboxItems(id);
    const modalRef = this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
      centered: true
    });
  }

  LoadToolboxItems(id:number): void {
    this.GetAllEquipment();
    this.GetAllStock();
    this.toolboxService.loadToolbox(id).subscribe({
      next: (toolbox) => {
        
        this.Toolbox = toolbox;
        
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  GetAllEquipment(): void {
    var filler = "";
    this.equipmentService.getAllEquipments(filler).subscribe({
      next: (equipment) => {
        this.Equipment = equipment;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  GetAllStock(): void {
    var filler = "";
    this.stockService.getAllStocks(filler).subscribe({
      next: (stock) => {
        this.Stock = stock;
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  OpenDeleteToolboxEquipmentModal(content: any, id: number) {
    this.toolboxService.loadToolboxEquipment(id).subscribe({
      next: (toolboxEquipment) => {
        this.AddUpdateToolboxEquipmentRequest = toolboxEquipment;
        const modalRef = this.modalService.open(content, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  deleteToolboxEquipment(toolboxEquipmentID: number, success: any, AssociationError: any, failedError: any) {
    return this.toolboxService.deleteToolboxEquipment(toolboxEquipmentID).subscribe({
        next: (response) => {
          this.LoadToolboxItems(this.Toolbox.toolbox_ID);
          this.modalService.open(success, {
            size: 'dialog-centered',
            backdrop: 'static'
          });
        },
        error: (response) => {
          if (response && response.status === 400) {
            this.modalService.open(AssociationError, {
              size: 'dialog-centered',
              backdrop: 'static'
            });
          } else {
            this.modalService.open(failedError, {
              size: 'dialog-centered',
              backdrop: 'static'
            });
          }
        }
      })
  }

  OpenDeleteToolboxStockModal(content: any, id: number) {
    this.toolboxService.loadToolboxStock(id).subscribe({
      next: (toolboxStock) => {
        
        this.AddUpdateToolboxStockRequest = toolboxStock;
        const modalRef = this.modalService.open(content, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  deleteToolboxStock(toolboxStockID: number, success: any, AssociationError: any, failedError: any) {
    return this.toolboxService.deleteToolboxStock(toolboxStockID).subscribe({
      next: (response) => {
        this.LoadToolboxItems(this.Toolbox.toolbox_ID);
        this.modalService.open(success, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      },
      error: (response) => {
        if (response && response.status === 400) {
          this.modalService.open(AssociationError, {
            size: 'dialog-centered',
            backdrop: 'static'
          });
        } else {
          this.modalService.open(failedError, {
            size: 'dialog-centered',
            backdrop: 'static'
          });
        }
      }
    })
  }

  openAddItemConfirmationModal(content: any){

    this.equipmentName = this.Equipment.find(equipment => equipment.equipment_ID === Number(this.selectedEquipment))?.equipment_Name||"";
    this.stockName = this.Stock.find(stock => stock.stock_ID === Number(this.selectedStock))?.stock_Name||"";
    this.modalService.open(content, {
      size: 'dialog-centered',
      backdrop: 'static'
    });
  }

  AddToolboxEquipment(success: any, failed: any, quantityError: any) {

    const id = this.Toolbox.toolbox_ID;

    if (this.Toolbox.toolboxEquipment.some(e => e.equipment_ID === Number(this.selectedEquipment))) {
      this.AddUpdateToolboxEquipmentRequest = {
        toolboxEquipment_ID: 0,
        toolbox_ID: this.Toolbox.toolbox_ID,
        equipment_ID: this.selectedEquipment,
        quantity: this.equipmentQuantity + (this.Toolbox.toolboxEquipment.find(equipment => equipment.equipment_ID === Number(this.selectedEquipment))?.quantity||0),
        equipment: {
          equipment_ID: 0,
          equipment_Name: this.Equipment.find(equipment => equipment.equipment_ID === Number(this.selectedEquipment))?.equipment_Name || '',
          equipment_Description: '',
          equipment_Quantity_On_Hand: 0,
          equipment_Low_Level_Warning: 0
        },
      };

      if (this.AddUpdateToolboxEquipmentRequest.quantity > (this.Equipment.find(equipment => equipment.equipment_ID === Number(this.selectedEquipment))?.equipment_Quantity_On_Hand || 0)){
        this.selectedEquipment = 0;
        this.equipmentQuantity = 0;
        this.modalService.open(quantityError, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      }
      else {
        this.toolboxService.AddToolboxEquipment(this.AddUpdateToolboxEquipmentRequest).subscribe({
          next: (toolboxEquipment: ToolboxEquipment) => {

            this.toolboxService.deleteToolboxEquipment(this.Toolbox.toolboxEquipment.find(equipment => equipment.equipment_ID === Number(this.selectedEquipment))?.toolboxEquipment_ID || 0).subscribe({
              next: (response) => {
                this.LoadToolboxItems(this.Toolbox.toolbox_ID);
              },
            })

            this.LoadToolboxItems(id);
            this.selectedEquipment = 0;
            this.equipmentQuantity = 0;
    
            this.modalService.open(success, {
              size: 'dialog-centered',
              backdrop: 'static'
            });
          },
          error: (response: any) => {
            this.modalService.open(failed, {
              size: 'dialog-centered',
              backdrop: 'static'
            });
          }
        });
      } 
    }
    else {
      this.AddUpdateToolboxEquipmentRequest = {
        toolboxEquipment_ID: 0,
        toolbox_ID: this.Toolbox.toolbox_ID,
        equipment_ID: this.selectedEquipment,
        quantity: this.equipmentQuantity,
        equipment: {
          equipment_ID: 0,
          equipment_Name: this.Equipment.find(equipment => equipment.equipment_ID === Number(this.selectedEquipment))?.equipment_Name || '',
          equipment_Description: '',
          equipment_Quantity_On_Hand: 0,
          equipment_Low_Level_Warning: 0
        },
      };

      if (this.AddUpdateToolboxEquipmentRequest.quantity > (this.Equipment.find(equipment => equipment.equipment_ID === Number(this.selectedEquipment))?.equipment_Quantity_On_Hand || 0)){
        this.selectedEquipment = 0;
        this.equipmentQuantity = 0;
        this.modalService.open(quantityError, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      }
      else {
        this.toolboxService.AddToolboxEquipment(this.AddUpdateToolboxEquipmentRequest).subscribe({
          next: (toolboxEquipment: ToolboxEquipment) => {
            this.LoadToolboxItems(id);
            this.selectedEquipment = 0;
            this.equipmentQuantity = 0;
    
            this.modalService.open(success, {
              size: 'dialog-centered',
              backdrop: 'static'
            });
          },
          error: (response: any) => {
            this.modalService.open(failed, {
              size: 'dialog-centered',
              backdrop: 'static'
            });
          }
        });
      } 
    }
  }

  AddToolboxStock(success: any, failed: any) {

    const id = this.Toolbox.toolbox_ID;

    if (this.Toolbox.toolboxStock.some(e => e.stock_ID === Number(this.selectedStock))) {
    
      this.AddUpdateToolboxStockRequest = {
        toolboxStock_ID: 0,
        toolbox_ID: this.Toolbox.toolbox_ID,
        stock_ID: this.selectedStock,
        quantity: this.stockQuantity + (this.Toolbox.toolboxStock.find(stock => stock.stock_ID === Number(this.selectedStock))?.quantity||0),
        stock: {
          stock_ID: 0,
          stock_Name: this.Stock.find(stock => stock.stock_ID === Number(this.selectedStock))?.stock_Name || '',
          stock_Description: '',
          stock_Quantity_On_Hand: 0,
          stock_Low_Level_Warning: 0
        },
      };

      this.toolboxService.deleteToolboxStock(this.Toolbox.toolboxStock.find(stock => stock.stock_ID === Number(this.selectedStock))?.toolboxStock_ID || 0).subscribe({
        next: (response) => {
          this.LoadToolboxItems(this.Toolbox.toolbox_ID);
        },
      })
    }
    else {
      this.AddUpdateToolboxStockRequest = {
        toolboxStock_ID: 0,
        toolbox_ID: this.Toolbox.toolbox_ID,
        stock_ID: this.selectedStock,
        quantity: this.stockQuantity,
        stock: {
          stock_ID: 0,
          stock_Name: this.Stock.find(stock => stock.stock_ID === this.selectedStock)?.stock_Name || '',
          stock_Description: '',
          stock_Quantity_On_Hand: 0,
          stock_Low_Level_Warning: 0
        },
      };
    }
   
    this.toolboxService.AddToolboxStock(this.AddUpdateToolboxStockRequest).subscribe({
      next: (toolboxStock: ToolboxStock) => {
        this.LoadToolboxItems(id);
        this.selectedStock = 0;
        this.stockQuantity = 0;
        this.modalService.open(success, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
        
      },
      error: (response: any) => {
        this.modalService.open(failed, {
          size: 'dialog-centered',
          backdrop: 'static'
        });
      }
    });
  }
}

