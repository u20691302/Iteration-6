import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePerformanceComponent } from './generate-performance.component';

describe('GeneratePerformanceComponent', () => {
  let component: GeneratePerformanceComponent;
  let fixture: ComponentFixture<GeneratePerformanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneratePerformanceComponent]
    });
    fixture = TestBed.createComponent(GeneratePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
