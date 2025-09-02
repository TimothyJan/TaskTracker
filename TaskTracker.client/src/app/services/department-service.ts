import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Department } from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private departmentsChangedSource = new Subject<void>();  // Emit events when department is updated
  departmentsChanged$ = this.departmentsChangedSource.asObservable();

  departmentId: number = 3;

  departments: Department[] = [
    new Department(0, "FINANCE"),
    new Department(1, "HUMAN RESOURCES"),
    new Department(2, "INFORMATION TECHNOLOGY")
  ];

  constructor() { }

  /** Get Departments */
  getDepartments(): Department[] {
    return this.sortDepartments(this.departments);
  }

  /** Get Departments based on id */
  getDepartmentById(id: number): Department | undefined {
    for(let i=0; i<this.departments.length; i++) {
      if(this.departments[i].id == id) {
        return this.departments[i];
      }
    }
    return undefined;
  }

  /** Post new Department */
  createDepartment(department: Department): void {
    let newDepartment = new Department(this.departmentId++, department.name_.toUpperCase());
    this.departments.push(newDepartment);
    this.departments = this.sortDepartments(this.departments); // Sort after adding
    this.notifyDepartmentsChanged();
  }

  /** Update existing Department based on id */
  updateDepartment(department: Department): void {
    let updatedDepartment = new Department(this.departmentId, department.name_.toUpperCase());
    for(let i=0; i<this.departments.length; i++) {
      if(this.departments[i].id == department.id) {
        this.departments[i] = updatedDepartment;
      }
    }
  }

  /** Delete Department based on id */
  deleteDepartment(id: number): void {
    for(let i=0; i<this.departments.length; i++) {
      if(this.departments[i].id == id) {
        this.departments.splice(i, 1);
      }
    }
  }

  /** Emit events for departments update */
  notifyDepartmentsChanged(): void {
    this.departmentsChangedSource.next();
  }

  /** Checks for duplicate department name_s */
  checkDuplicates(name_: string): boolean {
    const upperName = name_.toUpperCase().trim();
    return this.departments.some(dept =>
      dept.name_.toUpperCase() === upperName
    );
  }

  /** Helper method to sort departments alphabetically */
  private sortDepartments(departments: Department[]): Department[] {
    return [...departments].sort((a, b) =>
      a.name_.localeCompare(b.name_)
    );
  }

}
