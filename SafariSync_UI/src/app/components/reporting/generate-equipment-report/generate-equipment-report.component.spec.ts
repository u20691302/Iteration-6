import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateEquipmentReportComponent } from './generate-equipment-report.component';

describe('GenerateEquipmentReportComponent', () => {
  let component: GenerateEquipmentReportComponent;
  let fixture: ComponentFixture<GenerateEquipmentReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateEquipmentReportComponent]
    });
    fixture = TestBed.createComponent(GenerateEquipmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
