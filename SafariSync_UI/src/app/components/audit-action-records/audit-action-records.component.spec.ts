import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditActionRecordsComponent } from './audit-action-records.component';

describe('AuditActionRecordsComponent', () => {
  let component: AuditActionRecordsComponent;
  let fixture: ComponentFixture<AuditActionRecordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuditActionRecordsComponent]
    });
    fixture = TestBed.createComponent(AuditActionRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
