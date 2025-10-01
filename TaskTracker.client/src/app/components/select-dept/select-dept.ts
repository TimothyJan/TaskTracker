import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Department } from '../../models/department.model';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse } from '../../models/apiResponse.model';

import { DepartmentService } from '../../services/department-service';
import { SnackbarService } from '../../services/snackbar-service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-select-dept',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './select-dept.html',
  styleUrl: './select-dept.css',
  standalone: true
})
export class SelectDept implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _departmentService = inject(DepartmentService);
  private unsubscribe$ = new Subject<void>();

  @Input() departmentId: number | null = null;
  @Output() departmentChanged = new EventEmitter<number>();

  isLoading: boolean = false;
  departments: Department[] = [];
  selectedDepartmentId: number | null = null;

  constructor() {}

  ngOnInit(): void {
    this.getDepartments();
    // Set initial value if provided
    if (this.departmentId !== null) {
      this.selectedDepartmentId = this.departmentId;
    }
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
          this._snackbarService.error(response.message);
        }
        this.isLoading = false;
      },
      error: (response) => {
        this._snackbarService.error(response.error.message);
        this.isLoading = false;
      }
    })
  }

  /** On department change, emit value */
  onDepartmentChange(event: MatSelectChange) {
    const departmentId = Number(event.value);
    this.selectedDepartmentId = departmentId;
    this.departmentChanged.emit(departmentId);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
