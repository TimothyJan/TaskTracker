import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ProjectTaskModel } from '../models/project-task.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectTaskService {

  private projectTasksChangedSource = new Subject<void>();  // Emit events when department is updated
  projectTasksChanged$ = this.projectTasksChangedSource.asObservable();

  id: number = 5;

  private projectTasks: ProjectTaskModel[] = [
    new ProjectTaskModel(1, 1, 'Task 1', 'Task for Project Alpha', 'Completed', new Date('2025-06-01'), new Date('2025-10-01'), [0,1]),
    new ProjectTaskModel(2, 1, 'Task 2', 'Another Task for Project Alpha', 'Active', new Date('2025-07-01'), new Date('2026-05-30'), [3]),
    new ProjectTaskModel(3, 2, 'Task 3', 'Task for Project Beta', 'Not Started', new Date('2026-01-01'), new Date('2026-06-30'), [1,2]),
    new ProjectTaskModel(4, 2, 'Task 4', 'Another Task for Project Beta', 'Not Started', new Date('2025-12-01'), new Date('2026-6-30'), []),
    new ProjectTaskModel(5, 3, 'Task 5', 'Old Task', 'Completed', new Date('2024-01-01'), new Date('2024-12-31'), [0])
  ];

  constructor() {}

  // Get all project tasks
  getProjectTasks(): ProjectTaskModel[] {
    return this.projectTasks;
  }

  getListOfProjectTaskIdsByProjectIds(projectId: number): number[] {
    let listOfProjectTaskIdsByProjectIds: number[] = [];
    for (var projectTask of this.projectTasks) {
      if(projectTask.projectId === projectId) {
        listOfProjectTaskIdsByProjectIds.push(projectTask.id);
      }
    }
    return listOfProjectTaskIdsByProjectIds;
  }

  // Get tasks by project Id
  getTasksByProjectId(projectId: number): ProjectTaskModel[] {
    return this.projectTasks.filter((task) => task.projectId === projectId);
  }

  // Get a project task by Id
  getProjectTaskById(taskId: number): ProjectTaskModel {
    return this.projectTasks.find((task) => task.id === taskId)!;
  }

  // Add a new project task
  createProjectTask(newProjectTask: ProjectTaskModel): void {
    newProjectTask.id = this.id++;
    this.projectTasks.push(newProjectTask);
    this.projectTasksChangedSource.next();
  }

  // Update an existing project task
  updateProjectTask(updatedTask: ProjectTaskModel): void {
    const index = this.projectTasks.findIndex((task) => task.id === updatedTask.id);
    if (index !== -1) {
      this.projectTasks[index] = updatedTask;
      this.projectTasksChangedSource.next();
    }
  }

  // Delete a project task
  deleteProjectTask(id: number): void {
    const index = this.projectTasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.projectTasks.splice(index, 1);
      this.projectTasksChangedSource.next(); // Notify subscribers that the task list has changed
    }
  }

  /** Emit events for projectTasks update */
  notifyProjectTasksChanged(): void {
    this.projectTasksChangedSource.next();
  }
}
