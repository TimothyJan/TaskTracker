import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private rolesChangedSource = new Subject<void>();  // Emit events when role is updated
  rolesChanged$ = this.rolesChangedSource.asObservable();

  roleId: number = 10;

  roles: Role[] = [
    new Role(0, "ACCOUNTANT", 0),
    new Role(1, "FINANCIAL ANALYST", 0),
    new Role(2, "FINANCE MANAGER", 0),
    new Role(3, "HR ASSISTANT", 1),
    new Role(4, "HR SPECIALIST", 1),
    new Role(5, "HR DIRECTOR", 1),
    new Role(6, "SOFTWARE ENGINEER", 2),
    new Role(7, "FRONT-END DEVELOPER", 2),
    new Role(8, "BACK-END DEVELOPER", 2),
    new Role(9, "FULL-STACK DEVELOPER", 2),
  ];

  constructor() { }

  /** Get Roles */
  getRoles(): Role[] {
    return this.roles;
  }

  /** Get Roles based on DepartmenIdd */
  getRolesFromDepartmentId(departmentId: number): Role[] {
    return this.roles.filter(role => role.departmentId === departmentId);
  }

  /** Get Role based on id */
  getRoleById(id: number): Role | undefined {
    for(let i=0; i<this.roles.length; i++) {
      if(this.roles[i].id == id) {
        return this.roles[i];
      }
    }
    return undefined;
  }

  /** Post new Role */
  createRole(role: Role): void {
    let newRole = new Role(this.roleId++, role.name_.toUpperCase(), role.departmentId);
    this.roles.push(newRole);
  }

  /** Update existing Role based on id */
  updateRole(role: Role): void {
    let updatedRole = new Role(role.id, role.name_.toUpperCase(), role.departmentId);
    for(let i=0; i<this.roles.length; i++) {
      if(this.roles[i].id == role.id) {
        this.roles[i] = updatedRole;
      }
    }
  }

  /** Delete Role based on id */
  deleteRole(id: number): void {
    for(let i=0; i<this.roles.length; i++) {
      if(this.roles[i].id == id) {
        this.roles.splice(i, 1);
      }
    }
  }

  /** Emit events for roles update */
  notifyRolesChanged(): void {
    this.rolesChangedSource.next();
  }

  /** Checks for duplicate department name_s */
  checkDuplicates(role: Role, excludeRoleId?: number): boolean {
    const upperName = role.name_.toUpperCase();
    return this.roles.some(existingRole =>
      existingRole.name_.toUpperCase() === upperName &&
      existingRole.departmentId === role.departmentId &&
      existingRole.id !== excludeRoleId
    );
  }
}
