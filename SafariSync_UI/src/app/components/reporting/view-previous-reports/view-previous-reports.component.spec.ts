import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPreviousReportsComponent } from './view-previous-reports.component';

describe('ViewPreviousReportsComponent', () => {
  let component: ViewPreviousReportsComponent;
  let fixture: ComponentFixture<ViewPreviousReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPreviousReportsComponent]
    });
    fixture = TestBed.createComponent(ViewPreviousReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
