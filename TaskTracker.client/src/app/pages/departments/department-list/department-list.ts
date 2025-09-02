import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Department } from '../../../models/department.model';
import { DepartmentDialog } from '../../../dialogs/department-dialog/department-dialog';
import { Subject, takeUntil } from 'rxjs';

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
  private unsubscribe$ = new Subject<void>();
  isLoading: boolean = false;
  departments: Department[] = [];

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getDepartments();
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

  /** Open Department Edit dialog */
  onOpenEditDialog(departmentId: number): void {
    this.dialog.open(DepartmentDialog, {
      width: '500px',
      data: { departmentId }
    });
  }

  /** Delete Department */
  onDelete(departmentId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this department?');
    if (confirmDelete) {
      this.isLoading = true;
      this._departmentService.deleteDepartment(departmentId);
      this.getDepartments();
      this._snackbarService.success("Department deleted.");
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
