import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateDynamicStockReportComponent } from './generate-dynamic-stock-report.component';

describe('GenerateStockReportComponent', () => {
  let component: GenerateDynamicStockReportComponent;
  let fixture: ComponentFixture<GenerateDynamicStockReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateDynamicStockReportComponent]
    });
    fixture = TestBed.createComponent(GenerateDynamicStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
