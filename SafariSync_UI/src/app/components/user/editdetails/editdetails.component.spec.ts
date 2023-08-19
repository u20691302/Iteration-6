import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditdetailsComponent } from './editdetails.component';

describe('EditdetailsComponent', () => {
  let component: EditdetailsComponent;
  let fixture: ComponentFixture<EditdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditdetailsComponent]
    });
    fixture = TestBed.createComponent(EditdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
