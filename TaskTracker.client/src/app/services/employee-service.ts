import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeesChangedSource = new Subject<void>(); //Emit events when employee is updated
  employeesChanged$ = this.employeesChangedSource.asObservable();

  employeeId:number = 4;

  employees: Employee[] = [
    new Employee(0, "ALICE JOHNSON", 60000, 0, 0),
    new Employee(1, "BOB SMITH", 70000, 0, 1),
    new Employee(2, "CATHERINE GREEN", 65000, 1, 4),
    new Employee(3, "DAVID BROWN", 90000, 2, 6),
  ];

  constructor() { }

  /** Get Employees */
  getEmployees(): Employee[] {
    return this.employees;
  }

  /** Get Employee based on id */
  getEmployeeById(id: number): Employee | undefined {
    for(let i=0; i<this.employees.length; i++) {
      if(this.employees[i].id == id) {
        return this.employees[i];
      }
    }
    return undefined;
  }

  /** Post new Employee */
  addEmployee(employee: Employee): void {
    let newEmployee = new Employee(this.employeeId++, employee.name_.toUpperCase(), employee.salary, employee.departmentId, employee.roleId);
    this.employees.push(newEmployee);
  }

  /** Update existing Employee based on id */
  updateEmployee(employee: Employee): void {
    let updatedEmployee = new Employee(this.employeeId++, employee.name_.toUpperCase(), employee.salary, employee.departmentId, employee.roleId);
    for(let i=0; i<this.employees.length; i++) {
      if(this.employees[i].id == employee.id) {
        this.employees[i] = updatedEmployee;
      }
    }
  }

  /** Delete Employee based on id */
  deleteEmployee(id: number): void {
    for(let i=0; i<this.employees.length; i++) {
      if(this.employees[i].id == id) {
        this.employees.splice(i, 1);
      }
    }
  }

  /** Emit events for employees update */
  notifyEmployeesChanged(): void {
    this.employeesChangedSource.next();
  }
}
