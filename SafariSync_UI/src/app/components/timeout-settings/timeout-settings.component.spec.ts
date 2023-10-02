import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeoutSettingsComponent } from './timeout-settings.component';

describe('TimeoutSettingsComponent', () => {
  let component: TimeoutSettingsComponent;
  let fixture: ComponentFixture<TimeoutSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeoutSettingsComponent]
    });
    fixture = TestBed.createComponent(TimeoutSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
