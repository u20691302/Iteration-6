import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendRegisterLinkComponent } from './send-register-link.component';

describe('SendRegisterLinkComponent', () => {
  let component: SendRegisterLinkComponent;
  let fixture: ComponentFixture<SendRegisterLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendRegisterLinkComponent]
    });
    fixture = TestBed.createComponent(SendRegisterLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
