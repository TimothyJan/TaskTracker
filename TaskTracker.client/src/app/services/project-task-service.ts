import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ProjectTaskModel } from '../models/project-task.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectTaskService {
  private apiUrl = `${environment.apiUrl}/api/ProjectTask`;
  private projectTasksChangedSource = new Subject<void>();  // Emit events when project task is updated
  projectTasksChanged$ = this.projectTasksChangedSource.asObservable();

  /** Emit events for project tasks update */
  notifyProjectTasksChanged(): void {
    this.projectTasksChangedSource.next();
  }

  constructor(private http: HttpClient) { }

  /** Get Projects */
  getProjectTasks(): Observable<ApiResponse<ProjectTaskModel[]>> {
    return this.http.get<ApiResponse<ProjectTaskModel[]>>(this.apiUrl);
  }

  /** Get Projects based on id */
  getProjectTaskById(id: number): Observable<ApiResponse<ProjectTaskModel>> {
    return this.http.get<ApiResponse<ProjectTaskModel>>(`${this.apiUrl}/${id}`);
  }

  /** Post new ProjectTask */
  createProjectTask(projectTask: ProjectTaskModel): Observable<ApiResponse<ProjectTaskModel>> {
    return this.http.post<ApiResponse<ProjectTaskModel>>(this.apiUrl, projectTask);
  }

  /** Update existing ProjectTask based on id */
  updateProjectTask(projectTask: ProjectTaskModel): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${projectTask.id}`, projectTask);
  }

  /** Delete ProjectTask based on id */
  deleteProjectTask(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  /** Get list of Project Task Ids based on ProjectId */
  getListOfProjectTaskIdsByProjectId(projectId: number): Observable<ApiResponse<number[]>> {
    return this.http.get<ApiResponse<number[]>>(`${this.apiUrl}/project/${projectId}/ids`);
  }

  // Get tasks by project Id
  getTasksByProjectId(projectId: number): Observable<ApiResponse<ProjectTaskModel[]>> {
    return this.http.get<ApiResponse<ProjectTaskModel[]>>(`${this.apiUrl}/project/${projectId}/tasks`);
  }
}
