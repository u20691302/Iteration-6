import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarstuffComponent } from './navbarstuff.component';

describe('NavbarstuffComponent', () => {
  let component: NavbarstuffComponent;
  let fixture: ComponentFixture<NavbarstuffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarstuffComponent]
    });
    fixture = TestBed.createComponent(NavbarstuffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
