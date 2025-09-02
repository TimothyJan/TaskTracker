import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Role } from '../../../models/role.model';
import { Department } from '../../../models/department.model';
import { TruncatePipe } from '../../../pipes/truncate-pipe';
import { Subject, takeUntil } from 'rxjs';
import { RoleDialog } from '../../../dialogs/role-dialog/role-dialog';

import { SnackbarService } from '../../../services/snackbar-service';
import { DepartmentService } from '../../../services/department-service';
import { RoleService } from '../../../services/role-service';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-role-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonToggleModule,
    TruncatePipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './role-list.html',
  styleUrl: './role-list.css',
  standalone: true
})
export class RoleList  implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _departmentService = inject(DepartmentService);
  private _roleService = inject(RoleService);
  private unsubscribe$ = new Subject<void>();
  isLoading: boolean = false;
  roles: Role[] = [];
  departments: Department[] = [];
  sortedRoles: Role[] = [];

  // Set default sort to department
  sortBy: 'role' | 'department' | 'none' = 'department';

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getRoles();
    this.getDepartments();

    // Sort immediately after component initialization
    this.sortRoles();

    this._roleService.rolesChanged$.subscribe(() => {
      this.getRoles();
      this.sortRoles();
    });
  }

  /** Get all roles */
  getRoles(): void {
    this.isLoading = true;
    this.roles = this._roleService.getRoles();
    this.isLoading = false;

    // Subscribe to the role notifications
    this._roleService.rolesChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getRoles(); // Reload roles with updates
      });
  }

  /** Get all departments */
  getDepartments(): void {
    this.isLoading = true;
    this.departments = this._departmentService.getDepartments();
    this.isLoading = false;

    // Subscribe to the department notifications
    this._departmentService.departmentsChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getDepartments(); // Reload departments with updates
      });
  }

  /** Sort roles based on current sortBy value */
  sortRoles(): void {
    if (this.sortBy === 'none') {
      this.sortedRoles = [...this.roles];
      return;
    }

    this.sortedRoles = [...this.roles].sort((a, b) => {
      if (this.sortBy === 'role') {
        return a.name_.localeCompare(b.name_);
      } else {
        const aDept = this.getDepartmentName(a.departmentId) || '';
        const bDept = this.getDepartmentName(b.departmentId) || '';
        return aDept.localeCompare(bDept);
      }
    });
  }

  /** Toggle sorting */
  toggleSort(sortType: 'role' | 'department'): void {
    if (this.sortBy === sortType) {
      this.sortBy = 'none'; // Toggle off if already sorted by this type
    } else {
      this.sortBy = sortType; // Set new sort type
    }
    this.sortRoles();
  }

  /** Get Department name_ from DepartmentId */
  getDepartmentName(departmentId: number): string | undefined {
    const department = this.departments.find(dep => dep.id === departmentId);
    return department ? department.name_ : undefined;
  }

  /** Open Role Edit dialog */
  onOpenEditDialog(roleId: number): void {
    this.dialog.open(RoleDialog, {
      width: '500px',
      data: { roleId: roleId }
    });
  }

  /** Delete Role */
  onDelete(roleId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this role?');
    if (confirmDelete) {
      this.isLoading = true;
      this._roleService.deleteRole(roleId);
      this.getRoles();
      this._snackbarService.success("Role deleted.");
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
