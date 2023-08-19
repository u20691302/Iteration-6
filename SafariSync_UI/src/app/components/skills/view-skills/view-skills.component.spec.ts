import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSkillsComponent } from './view-skills.component';

describe('ViewSkillsComponent', () => {
  let component: ViewSkillsComponent;
  let fixture: ComponentFixture<ViewSkillsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSkillsComponent]
    });
    fixture = TestBed.createComponent(ViewSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
