import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFarmworkerComponent } from './register-farmworker.component';

describe('RegisterFarmworkerComponent', () => {
  let component: RegisterFarmworkerComponent;
  let fixture: ComponentFixture<RegisterFarmworkerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterFarmworkerComponent]
    });
    fixture = TestBed.createComponent(RegisterFarmworkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
