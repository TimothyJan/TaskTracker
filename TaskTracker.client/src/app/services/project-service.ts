import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ProjectModel } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectsChangedSource = new Subject<void>();  // Emit events when department is updated
  projectsChanged$ = this.projectsChangedSource.asObservable();

  projectId: number = 3;
  // "Not Started" | "Active" | "Completed"
  private projects: ProjectModel[] = [
    new ProjectModel(1, 'Project Alpha', 'First project', 'Active', new Date('2024-06-01'), new Date('2026-05-30')),
    new ProjectModel(2, 'Project Beta', 'Second project', 'Not Started', new Date('2025-11-13'), new Date('2026-1-13')),
    new ProjectModel(3, 'Project Charlie', 'Second project', 'Completed', new Date('2025-01-01'), new Date('2025-05-31')),
  ];

  constructor() {}

  // Get all projects
  getProjects(): ProjectModel[] {
    return this.projects;
  }

  /** Get list of all projectIds */
  getListOfProjectIds(): number[] {
    let listOfProjectIds: number[] = [];
    this.projects.forEach((project) => {
      listOfProjectIds.push(project.id);
    });
    return listOfProjectIds;
  }

  // Get a project by Id
  getProjectById(projectId: number): ProjectModel {
    return this.projects.find((project) => project.id === projectId)!;
  }

  // Add a new project
  createProject(newProject: ProjectModel): void {
    newProject.id = this.projectId++;
    this.projects.push(newProject);
    this.projectsChangedSource.next();
  }

  // Update an existing project
  updateProject(updatedProject: ProjectModel): void {
    const index = this.projects.findIndex((project) => project.id === updatedProject.id);
    if (index !== -1) {
      this.projects[index] = updatedProject;
      this.projectsChangedSource.next();
    }
  }

  // Delete a project
  deleteProject(projectId: number): void {
    const index = this.projects.findIndex(project => project.id === projectId);
    if (index !== -1) {
      this.projects.splice(index, 1);
      this.projectsChangedSource.next(); // Notify subscribers that the project list has changed
    }
  }

  /** Emit events for projects update */
  notifyProjectsChanged(): void {
    this.projectsChangedSource.next();
  }
}
