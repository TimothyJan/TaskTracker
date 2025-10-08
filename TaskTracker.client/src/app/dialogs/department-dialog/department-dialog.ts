import { Component, inject, Inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Department } from '../../models/department.model';
import { ApiResponse } from '../../models/apiResponse.model';

import { SnackbarService } from '../../services/snackbar-service';
import { DepartmentService } from '../../services/department-service';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-department-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './department-dialog.html',
  styleUrl: './department-dialog.css',
  standalone: true
})
export class DepartmentDialog implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _departmentService = inject(DepartmentService);
  private _cdr = inject(ChangeDetectorRef);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  form: FormGroup = new FormGroup({
    id: new FormControl(0, [Validators.pattern(/^\d+$/)]),
    name_: new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(100)])
  });

  constructor(
    private dialogRef: MatDialogRef<DepartmentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { departmentId?: number },
  ) { }

  ngOnInit() {
    if(this.data.departmentId !== undefined) {
      this.setDepartmentFormValues();
    }
  }

  /** Set form using getDepartmentById */
  setDepartmentFormValues(): void {
    this.isLoading = true;
    this._departmentService.getDepartmentById(this.data.departmentId!)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: ApiResponse<Department>) => {
        if (response.success) {
          const dept = response.data;
          this.form.patchValue({
            id: dept?.id,
            name_: dept?.name_
          })
        } else {
          this._snackbarService.error(response.message);
        }
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (response) => {
        setTimeout(() => {
          this._snackbarService.error(response.error?.message || 'Failed to load department.');
        });
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    })
  }

  get errorControls() {
    const control = this.form.get('name_');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Department name is required.';
      if (control.errors['minlength']) return 'Department name must be at least 1 character.';
      if (control.errors['maxlength']) return 'Department name must be ≤ 100 characters.';
    }
    return null;
  }

  /** Cancel and close dialog */
  cancel(): void {
    this.dialogRef.close(null);
  }

  /** Confirm create or update and close dialog*/
  confirm(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this._snackbarService.warning("Please fix validation errors.");
      return;
    }

    if(this.data.departmentId === undefined) {
      this.createDepartment();
    } else {
      this.updateDepartment();
    }
  }

  createDepartment() {
    if (this.form.valid) {
      this.isLoading = true;
      const formValue = this.form.getRawValue();
      const newDepartment: Department = {
        id: 0, // Let the API generate the ID
        name_: formValue.name_.trim()
      }

      this._departmentService.createDepartment(newDepartment)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: ApiResponse<Department>) => {
          if (response.success) {
            setTimeout(() => {
              this._departmentService.notifyDepartmentsChanged();
            });
            setTimeout(() => {
              this._snackbarService.success(response.message || "Department created successfully.");
            });
            this.dialogRef.close(true);
          } else {
            setTimeout(() => {
              this._snackbarService.error(response.message || "Failed to create department.");
            });
          }
          this.isLoading = false;
          this._cdr.detectChanges();
        },
        error: (response) => {
          setTimeout(() => {
            this._snackbarService.error(response.error?.message || 'Failed to create department.');
          });
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      });
    } else {
      this._snackbarService.error("Role failed to be created.");
      this.isLoading = false;
    }
  }

  updateDepartment(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const formValue = this.form.getRawValue();
      const updatedDepartment: Department = {
        id: formValue.id,
        name_: formValue.name_.trim()
      }

      this._departmentService.updateDepartment(updatedDepartment)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: ApiResponse<Department>) => {
          if (response.success) {
            setTimeout(() => {
              this._departmentService.notifyDepartmentsChanged();
            });
            setTimeout(() => {
              this._snackbarService.success(response.message || "Department updated successfully.");
            });
            this.dialogRef.close(true);
          } else {
            setTimeout(() => {
              this._snackbarService.error(response.message || "Failed to update department.");
            });
          }
          this.isLoading = false;
          this._cdr.detectChanges();
        },
        error: (response) => {
          setTimeout(() => {
            this._snackbarService.error(response.error?.message || 'Failed to update department.');
          });
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      });
      this.dialogRef.close(this.data.departmentId)
    } else {
      this._snackbarService.error("Failed to update department.");
      this.isLoading = false;
    }

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
