import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Employee } from '../../../models/employee.model';
import { EmployeeDialog } from '../../../dialogs/employee-dialog/employee-dialog';
import { Department } from '../../../models/department.model';
import { Role } from '../../../models/role.model';
import { TruncatePipe } from '../../../pipes/truncate-pipe';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse } from '../../../models/apiResponse.model';

import { SnackbarService } from '../../../services/snackbar-service';
import { EmployeeService } from '../../../services/employee-service';
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
  selector: 'app-employee-list',
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
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
  standalone: true
})
export class EmployeeList  implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _employeeService = inject(EmployeeService);
  private _departmentService = inject(DepartmentService);
  private _roleService = inject(RoleService);
  private _cdr = inject(ChangeDetectorRef);
  private unsubscribe$ = new Subject<void>();
  isLoading: boolean = false;
  departments: Department[] = [];
  roles: Role[] = [];
  employees: Employee[] = [];
  sortedEmployees: Employee[] = [];
  sortBy: 'employee' | 'role' | 'department' | 'none' = 'none';

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getEmployees();
    this.getRoles();
    this.getDepartments();
    // Subscribe to the employee notifications
    this._employeeService.employeesChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        setTimeout(() => this.getEmployees());
      });
    // Subscribe to the role notifications
    this._roleService.rolesChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        setTimeout(() => this.getRoles());
      });
    // Subscribe to the department notifications
    this._departmentService.departmentsChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        setTimeout(() => this.getDepartments());
      });
  }

  /** Get all employees */
  getEmployees(): void {
    this.isLoading = true;
    this._employeeService.getEmployees()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: ApiResponse<Employee[]>) => {
        if (response.success) {
          this.employees = response.data || [];
          this.sortedEmployees = [...this.employees];
          this.sortEmployees();
        } else {
          setTimeout(() => {
            this._snackbarService.error(response.message);
          });
        }
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (response) => {
        setTimeout(() => {
          this._snackbarService.error(response.error?.message || 'Failed to load employees');
        });
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    });
  }

  /** Get all departments */
  getDepartments(): void {
    this.isLoading = true;
    this._departmentService.getDepartments()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: ApiResponse<Department[]>) => {
        if (response.success) {
          this.departments = response.data || [];
        } else {
          setTimeout(() => {
            this._snackbarService.error(response.message);
          });
        }
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (response) => {
        setTimeout(() => {
          this._snackbarService.error(response.error?.message || 'Failed to load roles');
        });
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    });
  }

  /** Get all roles */
  getRoles(): void {
    this.isLoading = true;
    this._roleService.getRoles()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: ApiResponse<Role[]>) => {
        if (response.success) {
          this.roles = response.data || [];
        } else {
          setTimeout(() => {
            this._snackbarService.error(response.message);
          });
        }
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (response) => {
        setTimeout(() => {
          this._snackbarService.error(response.error?.message || 'Failed to load roles');
        });
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    });
  }

  /** Sort employees based on current sortBy value */
  sortEmployees(): void {
    if (this.sortBy === 'none') {
      this.sortedEmployees = [...this.employees];
      return;
    }

    this.sortedEmployees = [...this.employees].sort((a, b) => {
      switch (this.sortBy) {
        case 'employee':
          return a.name_.localeCompare(b.name_);
        case 'role':
          const aRole = this.getRoleName(a.roleId) || '';
          const bRole = this.getRoleName(b.roleId) || '';
          return aRole.localeCompare(bRole);
        case 'department':
          const aDept = this.getDepartmentName(a.departmentId) || '';
          const bDept = this.getDepartmentName(b.departmentId) || '';
          return aDept.localeCompare(bDept);
        default:
          return 0;
      }
    });
  }

  /** Toggle sorting */
  toggleSort(sortType: 'employee' | 'role' | 'department'): void {
    if (this.sortBy === sortType) {
      this.sortBy = 'none'; // Toggle off if already sorted by this type
    } else {
      this.sortBy = sortType; // Set new sort type
    }
    this.sortEmployees();
  }

  /** Get Department name_ from DepartmentId */
  getDepartmentName(departmentId: number): string | undefined {
    const department = this.departments.find(dep => dep.id === departmentId);
    return department ? department.name_ : undefined;
  }

  /** Get Role name_ from RoleId */
  getRoleName(roleId: number): string | undefined {
    const role = this.roles.find(role => role.id === roleId);
    return role ? role.name_ : undefined;
  }

  /** Open Employee Edit dialog */
  onOpenEditDialog(employeeId: number): void {
    this.dialog.open(EmployeeDialog, {
      width: '600px',
      data: { employeeId }
    });
  }

  /** Delete Employee */
  onDelete(employeeId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this employee?');
    if (confirmDelete) {
      this.isLoading = true;
      this._employeeService.deleteEmployee(employeeId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: ApiResponse) => {
          if (response.success) {
            setTimeout(() => {
              this._snackbarService.success("Employee deleted.");
            });
            setTimeout(() => {
              this._employeeService.notifyEmployeesChanged();
            });
          } else {
            setTimeout(() => {
              this._snackbarService.error(response.message);
            });
          }
          this.isLoading = false;
          this._cdr.detectChanges();
        },
        error: (response) => {
          setTimeout(() => {
            this._snackbarService.error(response.error?.message || 'Failed to delete employee.');
          });
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
