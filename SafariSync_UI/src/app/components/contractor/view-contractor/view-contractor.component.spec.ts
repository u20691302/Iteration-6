import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContractorComponent } from './view-contractor.component';

describe('ViewContractorComponent', () => {
  let component: ViewContractorComponent;
  let fixture: ComponentFixture<ViewContractorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewContractorComponent]
    });
    fixture = TestBed.createComponent(ViewContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
