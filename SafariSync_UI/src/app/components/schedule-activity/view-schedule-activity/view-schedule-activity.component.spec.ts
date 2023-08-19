import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewScheduleActivityComponent } from './view-schedule-activity.component';

describe('ViewScheduleActivityComponent', () => {
  let component: ViewScheduleActivityComponent;
  let fixture: ComponentFixture<ViewScheduleActivityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewScheduleActivityComponent]
    });
    fixture = TestBed.createComponent(ViewScheduleActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
