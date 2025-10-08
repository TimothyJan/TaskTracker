import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Role } from '../models/role.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/api/Role`;
  private rolesChangedSource = new Subject<void>();  // Emit events when role is updated
  rolesChanged$ = this.rolesChangedSource.asObservable();

  /** Emit events for roles update */
  notifyRolesChanged(): void {
    this.rolesChangedSource.next();
  }

  constructor(private http: HttpClient) { }

  /** Get Roles */
  getRoles(): Observable<ApiResponse<Role[]>> {
    return this.http.get<ApiResponse<Role[]>>(this.apiUrl);
  }

  /** Get Roles based on id */
  getRoleById(id: number): Observable<ApiResponse<Role>> {
    return this.http.get<ApiResponse<Role>>(`${this.apiUrl}/${id}`);
  }

  /** Post new Role */
  createRole(role: Role): Observable<ApiResponse<Role>> {
    return this.http.post<ApiResponse<Role>>(this.apiUrl, role);
  }

  /** Update existing Role based on id */
  updateRole(role: Role): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${role.id}`, role);
  }

  /** Delete Role based on id */
  deleteRole(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  /** Get Roles based on Department Id */
  getRolesFromDepartmentId(departmentId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/Role/department/${departmentId}`);
  }
}
