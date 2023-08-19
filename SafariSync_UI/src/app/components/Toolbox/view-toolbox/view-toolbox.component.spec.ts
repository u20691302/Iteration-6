import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewToolboxComponent } from './view-toolbox.component';

describe('ViewToolboxComponent', () => {
  let component: ViewToolboxComponent;
  let fixture: ComponentFixture<ViewToolboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewToolboxComponent]
    });
    fixture = TestBed.createComponent(ViewToolboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
