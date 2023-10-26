import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  private totalRequests = 0;

  constructor(
    private loadingService: LoaderService
  ) {}

  // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //   console.log('caught')
  //   this.totalRequests++;
  //   this.loadingService.setLoading(true);
  //   return next.handle(request).pipe(
  //     finalize(() => {
  //       this.totalRequests--;
  //       if (this.totalRequests == 0) {
  //         this.loadingService.setLoading(false);
  //       }
  //     })
  //   );
  // }

  // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //   const startTime = performance.now();
  //   this.totalRequests++;
  //   this.loadingService.setLoading(false);
  
  //   return next.handle(request).pipe(
  //     finalize(() => {
  //       this.totalRequests--;
  //       const endTime = performance.now();
  //       const elapsedTime = endTime - startTime;
  
  //       if (elapsedTime > 500) {
  //         this.loadingService.setLoading(true);
  //       }
  
  //       if (this.totalRequests == 0) {
  //         this.loadingService.setLoading(false);
  //       }
  //     })
  //   );
  // }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.totalRequests++;
    let timer: any;
  
    const startTime = performance.now();
  
    // Start the loader after 500ms
    timer = setTimeout(() => {
      this.loadingService.setLoading(true);
    }, 100);
  
    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
  
        // If the request completed before 500ms, cancel the loader
        if (elapsedTime < 500) {
          clearTimeout(timer);
          this.loadingService.setLoading(false);
        }
  
        if (this.totalRequests == 0) {
          this.loadingService.setLoading(false);
        }
      })
    );
  }
  
  
}
