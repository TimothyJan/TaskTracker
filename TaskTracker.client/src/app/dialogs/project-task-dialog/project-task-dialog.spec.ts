import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskDialog } from './project-task-dialog';

describe('ProjectTaskDialog', () => {
  let component: ProjectTaskDialog;
  let fixture: ComponentFixture<ProjectTaskDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectTaskDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectTaskDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
