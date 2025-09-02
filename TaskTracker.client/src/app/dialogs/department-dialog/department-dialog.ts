import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { Department } from '../../models/department.model';

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
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  form: FormGroup = new FormGroup({
    id: new FormControl(0, [Validators.pattern(/^\d+$/)]),
    name_: new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(100)])
  });

  constructor(
    private dialogRef: MatDialogRef<DepartmentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: number },
  ) { }

  ngOnInit() {
    if(this.data.id !== undefined) {
      this.setDepartmentFormValues();
    }
  }

  /** Set form using getDepartmentById */
  setDepartmentFormValues(): void {
    this.isLoading = true;
    const dept = this._departmentService.getDepartmentById(this.data.id!);
    this.form.patchValue({
      id: dept?.id,
      name_: dept?.name_
    })
    this.isLoading = false;
  }

  get errorControls() {
    const control = this.form.get('name_');
    if (control?.errors && control.touched) { // Add touched check
      if (control.errors['required']) return 'Department name_ is required';
      if (control.errors['minlength']) return 'Department name_ must be at least 1 characters'; // Fixed message
      if (control.errors['maxlength']) return 'Department name_ must be ≤ 100 characters';
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
    if(this.data.id === undefined) {
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
        id: formValue.id,
        name_: formValue.name_.trim()
      }
      if (!this._departmentService.checkDuplicates(newDepartment.name_)) {
        this._departmentService.createDepartment(newDepartment);
        this._departmentService.notifyDepartmentsChanged();
        this._snackbarService.success("Department created.");
        this.dialogRef.close(this.data.id);
        this.isLoading = false;
      } else {
        this._snackbarService.error("Department already exists.");
        this.isLoading = false;
      }
    } else {
      this._snackbarService.warning("Department failed to be created.");
    }
  }

  updateDepartment(): void {
    if(this.form.valid) {
      this.isLoading = true;
      const formValue = this.form.getRawValue();
      const updatedDepartment: Department = {
        id: formValue.id,
        name_: formValue.name_.trim()
      }
      if (!this._departmentService.checkDuplicates(updatedDepartment.name_)) {
        this._departmentService.updateDepartment(updatedDepartment);
        this._departmentService.notifyDepartmentsChanged();
        this._snackbarService.success("Department saved.");
        this.dialogRef.close(this.data.id);
        this.isLoading = false;
      } else {
        this._snackbarService.error("Department already exists.");
        this.isLoading = false;
      }
    } else {
      this._snackbarService.error("Invalid department values");
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
