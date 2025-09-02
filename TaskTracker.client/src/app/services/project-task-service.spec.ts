import { TestBed } from '@angular/core/testing';

import { ProjectTaskService } from './project-task-service';

describe('ProjectTaskService', () => {
  let service: ProjectTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
