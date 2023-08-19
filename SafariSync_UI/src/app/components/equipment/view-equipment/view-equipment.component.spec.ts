import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEquipmentComponent } from './view-equipment.component';

describe('ViewEquipmentComponent', () => {
  let component: ViewEquipmentComponent;
  let fixture: ComponentFixture<ViewEquipmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEquipmentComponent]
    });
    fixture = TestBed.createComponent(ViewEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
