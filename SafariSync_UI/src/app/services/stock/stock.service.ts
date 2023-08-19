import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Stock } from 'src/app/models/stock/stock.model';
import { StockSupplier } from 'src/app/models/stock/stockSupplier.model';
import { Supplier } from 'src/app/models/supplier/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }

  AddStock(addStockRequest: Stock): Observable<Stock> {
    return this.http.post<Stock>(this.baseApiUrl + '/api/Stock/AddStock/',addStockRequest);
  }

  AddStockSupplier(addStockSupplierRequest: StockSupplier): Observable<StockSupplier> {
    return this.http.post<StockSupplier>(this.baseApiUrl + '/api/Stock/AddStock/', addStockSupplierRequest);
  }

  getAllStocks(term: string): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.baseApiUrl}/api/Stock/ReadAllStockAsync`).pipe(
      map(stocks => {
        if (term === null) {
          return stocks;
        }
        
        const filteredStocks = stocks.filter((stock: Stock) =>
          stock.stock_Name.toLowerCase().includes(term.toLowerCase()) ||
          stock.stock_Description.toLowerCase().includes(term.toLowerCase()) ||
          stock.stock_Quantity_On_Hand.toString().toLowerCase().includes(term.toLowerCase()) ||
          stock.stock_Low_Level_Warning.toString().toLowerCase().includes(term.toLowerCase()) ||
          stock.stockSupplier?.some(
            (supplier: StockSupplier) => supplier.supplier?.supplier_Name.toLowerCase().includes(term.toLowerCase())
          )
        );
        
        return filteredStocks;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  LoadStockSupplier(stockSupplierId: number): Observable<StockSupplier> {
    return this.http.get<StockSupplier>(this.baseApiUrl + '/api/Stock/ReadOneStockSupplierAsync/' + stockSupplierId)
  }
      
  loadStock(stockID: number): Observable<Stock> {
    return this.http.get<Stock>(this.baseApiUrl + '/api/Stock/ReadOneStockAsync/' + stockID)
  }

  updateStock(updateStockRequest: Stock): Observable<Stock> {
    return this.http.put<Stock>(this.baseApiUrl + '/api/Stock/UpdateStockAsync/', updateStockRequest);
  }

  deleteStock(stockID: number): Observable<Stock> {
    return this.http.delete<Stock>(this.baseApiUrl + '/api/Stock/DeleteStock/' + stockID);
  }

  deleteStockSupplier(stockSupplierID: number): Observable<StockSupplier> {
    return this.http.delete<StockSupplier>(this.baseApiUrl + '/api/Stock/DeleteStockSupplier/' + stockSupplierID);
  }
}
