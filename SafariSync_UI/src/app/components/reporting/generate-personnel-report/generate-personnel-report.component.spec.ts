import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePersonnelReportComponent } from './generate-personnel-report.component';

describe('GeneratePersonnelReportComponent', () => {
  let component: GeneratePersonnelReportComponent;
  let fixture: ComponentFixture<GeneratePersonnelReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneratePersonnelReportComponent]
    });
    fixture = TestBed.createComponent(GeneratePersonnelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
