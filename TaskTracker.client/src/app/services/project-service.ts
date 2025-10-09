import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ProjectModel } from '../models/project.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/api/Project`;
  private projectsChangedSource = new Subject<void>();  // Emit events when project is updated
  projectsChanged$ = this.projectsChangedSource.asObservable();

  /** Emit events for projects update */
  notifyProjectsChanged(): void {
    this.projectsChangedSource.next();
  }

  constructor(private http: HttpClient) { }

  /** Get Projects */
  getProjects(): Observable<ApiResponse<ProjectModel[]>> {
    return this.http.get<ApiResponse<ProjectModel[]>>(this.apiUrl);
  }

  /** Get Projects based on id */
  getProjectById(id: number): Observable<ApiResponse<ProjectModel>> {
    return this.http.get<ApiResponse<ProjectModel>>(`${this.apiUrl}/${id}`);
  }

  /** Post new Project */
  createProject(project: ProjectModel): Observable<ApiResponse<ProjectModel>> {
    return this.http.post<ApiResponse<ProjectModel>>(this.apiUrl, project);
  }

  /** Update existing Project based on id */
  updateProject(project: ProjectModel): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${project.id}`, project);
  }

  /** Delete Project based on id */
  deleteProject(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  getProjectIds(): Observable<ApiResponse<Number[]>> {
    return this.http.get<ApiResponse<Number[]>>(`${this.apiUrl}/ids`);
  }
}
