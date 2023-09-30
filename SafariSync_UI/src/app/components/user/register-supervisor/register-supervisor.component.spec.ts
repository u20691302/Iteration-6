import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSupervisorComponent } from './register-supervisor.component';

describe('RegisterUserComponent', () => {
  let component: RegisterSupervisorComponent;
  let fixture: ComponentFixture<RegisterSupervisorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterSupervisorComponent]
    });
    fixture = TestBed.createComponent(RegisterSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
