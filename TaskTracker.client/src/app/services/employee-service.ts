import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Employee } from '../models/employee.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/api/Employee`;
  private employeesChangedSource = new Subject<void>();  // Emit events when employee is updated
  employeesChanged$ = this.employeesChangedSource.asObservable();

  /** Emit events for employees update */
  notifyEmployeesChanged(): void {
    this.employeesChangedSource.next();
  }

  constructor(private http: HttpClient) { }

  /** Get Employees */
  getEmployees(): Observable<ApiResponse<Employee[]>> {
    return this.http.get<ApiResponse<Employee[]>>(this.apiUrl);
  }

  /** Get Employees based on id */
  getEmployeeById(id: number): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/${id}`);
  }

  /** Post new Employee */
  createEmployee(employee: Employee): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(this.apiUrl, employee);
  }

  /** Update existing Employee based on id */
  updateEmployee(employee: Employee): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${employee.id}`, employee);
  }

  /** Delete Employee based on id */
  deleteEmployee(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }
}
