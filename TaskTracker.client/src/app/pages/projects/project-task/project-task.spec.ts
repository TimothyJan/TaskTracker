import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTask } from './project-task';

describe('ProjectTask', () => {
  let component: ProjectTask;
  let fixture: ComponentFixture<ProjectTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectTask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectTask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
