import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateUserReportComponent } from './generate-user-report.component';

describe('GenerateUserReportComponent', () => {
  let component: GenerateUserReportComponent;
  let fixture: ComponentFixture<GenerateUserReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateUserReportComponent]
    });
    fixture = TestBed.createComponent(GenerateUserReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
