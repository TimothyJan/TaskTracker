import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectTaskModel } from '../../models/project-task.model';
import { AssignEmp } from '../../dialogs/assign-emp/assign-emp';
import { Employee } from '../../models/employee.model';
import { Role } from '../../models/role.model';
import { Department } from '../../models/department.model';
import { TruncatePipe } from '../../pipes/truncate-pipe';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse } from '../../models/apiResponse.model';

import { ProjectTaskService } from '../../services/project-task-service';
import { EmployeeService } from '../../services/employee-service';
import { RoleService } from '../../services/role-service';
import { DepartmentService } from '../../services/department-service';
import { SnackbarService } from '../../services/snackbar-service';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from "@angular/material/grid-list";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-assigned-emp',
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    TruncatePipe
  ],
  templateUrl: './assigned-emp.html',
  styleUrl: './assigned-emp.css',
  standalone: true
})
export class AssignedEmp implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _projectTaskService = inject(ProjectTaskService);
  private _employeeService = inject(EmployeeService);
  private _roleService = inject(RoleService);
  private _departmentService = inject(DepartmentService);
  private _cdr = inject(ChangeDetectorRef);
  private unsubscribe$ = new Subject<void>();

  @Input() projectTaskId: number = -1;

  isLoading: boolean = false;
  projectTask: ProjectTaskModel = new ProjectTaskModel(0, 0, "", "", "Not Started", new Date(), new Date(), []);
  assignedEmployeeList: Employee[] = [];

  // Make these local to each component instance
  private employees: Employee[] = [];
  private roles: Role[] = [];
  private departments: Department[] = [];

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if(this.projectTaskId != -1) {
      this.getProjectTaskById();
    }
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
    // Subscribe to the projectTask notifications
    this._projectTaskService.projectTasksChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        setTimeout(() => this.getProjectTaskById());
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
          // Create a new array for this component instance
          this.employees = [...(response.data || [])];
          this.getAssignedEmployees();
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

  /** Get all roles */
  getRoles(): void {
    this.isLoading = true;
    this._roleService.getRoles()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: ApiResponse<Role[]>) => {
        if (response.success) {
          // Create a new array for this component instance
          this.roles = [...(response.data || [])];
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

  /** Get all departments */
  getDepartments(): void {
    this.isLoading = true;
    this._departmentService.getDepartments()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: ApiResponse<Department[]>) => {
        if (response.success) {
          // Create a new array for this component instance
          this.departments = [...(response.data || [])];
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
          this._snackbarService.error(response.error?.message || 'Failed to load departments');
        });
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    });
  }

  /** Get Project Task by Id */
  getProjectTaskById(): void {
    this.isLoading = true;
    this._projectTaskService.getProjectTaskById(this.projectTaskId)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: ApiResponse<ProjectTaskModel>) => {
        if (response.success) {
          // Create a new instance for this component
          this.projectTask = new ProjectTaskModel(
            response.data?.id || 0,
            response.data?.projectId || 0,
            response.data?.name || "",
            response.data?.description || "",
            response.data?.status || "Not Started",
            response.data?.startDate,
            response.data?.dueDate,
            response.data?.assignedEmployeeIds ? [...response.data.assignedEmployeeIds] : []
          );
          this.getAssignedEmployees();
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
          this._snackbarService.error(response.error?.message || 'Failed to load project task');
        });
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    });
  }

  /** Get list of assigned employees from the projectTask */
  getAssignedEmployees(): void {
    this.assignedEmployeeList = [];

    // Check if there are assigned employee IDs and employees are loaded
    if (this.projectTask.assignedEmployeeIds &&
        this.projectTask.assignedEmployeeIds.length > 0 &&
        this.employees.length > 0) {

      // Filter employees to only include those with matching IDs
      this.assignedEmployeeList = this.employees.filter(employee =>
        this.projectTask.assignedEmployeeIds!.includes(employee.id)
      );
    }

    // Trigger change detection
    this._cdr.detectChanges();
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

  /** Opens Assign Employee Dialog */
  async openAssignEmployees() {
    this.dialog.open(AssignEmp, {
      width: '500px',
      data: { projectTaskId: this.projectTaskId }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
