import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Department } from '../../../models/department.model';
import { DepartmentDialog } from '../../../dialogs/department-dialog/department-dialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse } from '../../../models/apiResponse.model';

import { SnackbarService } from '../../../services/snackbar-service';
import { DepartmentService } from '../../../services/department-service';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule}  from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-department-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './department-list.html',
  styleUrl: './department-list.css',
  standalone: true
})
export class DepartmentList implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _departmentService = inject(DepartmentService);
  private _cdr = inject(ChangeDetectorRef);
  private unsubscribe$ = new Subject<void>();
  isLoading: boolean = false;
  departments: Department[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getDepartments();

    this._departmentService.departmentsChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        setTimeout(() => this.getDepartments());
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
          this._snackbarService.error(response.error?.message || 'Failed to load departments.');
        });
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    });
  }

  /** Open Department Edit dialog */
  onOpenEditDialog(departmentId: number): void {
    const dialogRef = this.dialog.open(DepartmentDialog, {
      width: '500px',
      data: { departmentId:departmentId }
    });

    // Subscribe to dialog close to handle updates
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Use setTimeout to avoid change detection issues
        setTimeout(() => {
          this._departmentService.notifyDepartmentsChanged();
        });
      }
    });
  }

  /** Delete Department */
  onDelete(departmentId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this department?');
    if (confirmDelete) {
      this.isLoading = true;
      this._departmentService.deleteDepartment(departmentId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response: ApiResponse) => {
            if (response.success) {
              setTimeout(() => {
                this._snackbarService.success("Department deleted.");
              });
              setTimeout(() => {
                this._departmentService.notifyDepartmentsChanged();
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
              this._snackbarService.error(response.error?.message || 'Failed to delete department.');
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
