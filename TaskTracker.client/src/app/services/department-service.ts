import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Department } from '../models/department.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = `${environment.apiUrl}/api/Department`;
  private departmentsChangedSource = new Subject<void>();  // Emit events when department is updated
  departmentsChanged$ = this.departmentsChangedSource.asObservable();

  /** Emit events for departments update */
  notifyDepartmentsChanged(): void {
    this.departmentsChangedSource.next();
  }

  constructor(private http: HttpClient) { }

  /** Get Departments */
  getDepartments(): Observable<ApiResponse<Department[]>> {
    return this.http.get<ApiResponse<Department[]>>(this.apiUrl);
  }

  /** Get Departments based on id */
  getDepartmentById(id: number): Observable<ApiResponse<Department>> {
    return this.http.get<ApiResponse<Department>>(`${this.apiUrl}/${id}`);
  }

  /** Post new Department */
  createDepartment(department: Department): Observable<ApiResponse<Department>> {
    return this.http.post<ApiResponse<Department>>(this.apiUrl, department);
  }

  /** Update existing Department based on id */
  updateDepartment(department: Department): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${department.id}`, department);
  }

  /** Delete Department based on id */
  deleteDepartment(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  /** Helper method to sort departments alphabetically */
  private sortDepartments(departments: Department[]): Department[] {
    return [...departments].sort((a, b) =>
      a.name_.localeCompare(b.name_)
    );
  }
}
