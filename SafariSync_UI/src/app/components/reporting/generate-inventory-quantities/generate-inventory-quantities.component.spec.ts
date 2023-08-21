import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateInventoryQuantitiesComponent } from './generate-inventory-quantities.component';

describe('GenerateInventoryQuantitiesComponent', () => {
  let component: GenerateInventoryQuantitiesComponent;
  let fixture: ComponentFixture<GenerateInventoryQuantitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateInventoryQuantitiesComponent]
    });
    fixture = TestBed.createComponent(GenerateInventoryQuantitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
