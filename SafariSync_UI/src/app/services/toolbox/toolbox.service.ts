import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, tap, mergeMap, of } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Toolbox } from 'src/app/models/toolbox/toolbox.model';
import { ToolboxEquipment } from 'src/app/models/toolbox/toolboxEquipment.model';
import { ToolboxStock } from 'src/app/models/toolbox/toolboxStock.model';


@Injectable({
  providedIn: 'root'
})
export class ToolboxService {

  baseApiUrl: string = environment.baseApiUrl

  constructor(private http: HttpClient) { }

  AddToolbox(addToolboxRequest: Toolbox): Observable<Toolbox> {
    return this.http.post<Toolbox>(this.baseApiUrl + '/api/Toolbox/AddToolbox/',addToolboxRequest);
  }

  getAllToolbox(term: string): Observable<Toolbox[]> {
    return this.http.get<Toolbox[]>(`${this.baseApiUrl}/api/Toolbox/ReadAllToolboxAsync`).pipe(
      map(toolboxs => {
        if (term === null) {
          return toolboxs;
        }
        
        const filteredToolboxs = toolboxs.filter((toolbox: Toolbox) =>
          toolbox.toolbox_Name.toLowerCase().includes(term.toLowerCase()) ||
          toolbox.toolbox_Description.toLowerCase().includes(term.toLowerCase())
        );
        
        return filteredToolboxs;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }
   
  loadToolbox(toolboxID: number): Observable<Toolbox> {
    return this.http.get<Toolbox>(this.baseApiUrl + '/api/Toolbox/ReadOneToolboxAsync/' + toolboxID)
  }

  updateToolbox(updateToolboxRequest: Toolbox): Observable<Toolbox> {
    return this.http.put<Toolbox>(this.baseApiUrl + '/api/Toolbox/UpdateToolboxAsync/', updateToolboxRequest);
  }

  deleteToolbox(toolboxID: number): Observable<Toolbox> {
    return this.http.delete<Toolbox>(this.baseApiUrl + '/api/Toolbox/DeleteToolbox/' + toolboxID);
  }




  loadToolboxEquipment(toolboxStockID: number): Observable<ToolboxEquipment> {
    return this.http.get<ToolboxEquipment>(this.baseApiUrl + '/api/Toolbox/ReadOneToolboxEquipmentAsync/' + toolboxStockID)
  }

  loadToolboxStock(toolboxStockID: number): Observable<ToolboxStock> {
    console.log(toolboxStockID)
    return this.http.get<ToolboxStock>(this.baseApiUrl + '/api/Toolbox/ReadOneToolboxStockAsync/' + toolboxStockID)
  }

  deleteToolboxEquipment(toolboxEquipmentID: number): Observable<ToolboxEquipment> {
    return this.http.delete<ToolboxEquipment>(this.baseApiUrl + '/api/Toolbox/DeleteToolboxEquipment/' + toolboxEquipmentID);
  }

  deleteToolboxStock(toolboxStockID: number): Observable<ToolboxStock> {
    console.log(toolboxStockID)
    return this.http.delete<ToolboxStock>(this.baseApiUrl + '/api/Toolbox/DeleteToolboxStock/' + toolboxStockID);
  }

  AddToolboxEquipment(addUpdateToolboxEquipmentRequest: ToolboxEquipment): Observable<ToolboxEquipment> {
    return this.http.post<ToolboxEquipment>(this.baseApiUrl + '/api/Toolbox/AddToolboxEquipment/', addUpdateToolboxEquipmentRequest);
  }

  AddToolboxStock(addUpdateToolboxStockRequest: ToolboxStock): Observable<ToolboxStock> {
    return this.http.post<ToolboxStock>(this.baseApiUrl + '/api/Toolbox/AddToolboxStock/', addUpdateToolboxStockRequest);
  }
}
