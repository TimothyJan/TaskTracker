import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { SelectDept } from '../../components/select-dept/select-dept';
import { SelectRole } from '../../components/select-role/select-role';
import { Employee } from '../../models/employee.model';

import { SnackbarService } from '../../services/snackbar-service';
import { EmployeeService } from '../../services/employee-service';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-employee-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    SelectDept,
    SelectRole,
    MatProgressSpinnerModule,
  ],
  templateUrl: './employee-dialog.html',
  styleUrl: './employee-dialog.css',
  standalone: true
})
export class EmployeeDialog implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _employeeService = inject(EmployeeService);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  form: FormGroup = new FormGroup({
    id: new FormControl(0, [Validators.pattern(/^\d+$/)]),
    name_: new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
    salary: new FormControl(0, [
      Validators.required,
      Validators.min(0.01), // Changed from 0 to 0.01 to require at least 1 cent
      Validators.pattern(/^\d+(\.\d{1,2})?$/) // Fixed pattern for dollar amounts
    ]),
    departmentId: new FormControl(-1, [Validators.required, Validators.pattern(/^\d+$/)]),
    roleId: new FormControl(-1, [Validators.required, Validators.pattern(/^\d+$/)])
  });

  constructor(
    private dialogRef: MatDialogRef<EmployeeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeId?: number },
  ) {}

  ngOnInit(): void {
    if(this.data.employeeId !== undefined) {
      this.setEmployeeFormValues();
    }
  }

  setEmployeeFormValues(): void {
    this.isLoading = true;
    const employee = this._employeeService.getEmployeeById(this.data.employeeId!);
    if (employee) {
      this.form.patchValue({
        id: employee.id,
        name_: employee.name_,
        salary: employee.salary,
        departmentId: employee.departmentId,
        roleId: employee.roleId
      });
    }
    this.isLoading = false;
  }

  get errorControlsName() {
    const control = this.form.get('name_');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Name is required';
      if (control.errors['minlength']) return 'Name must be at least 1 characters';
      if (control.errors['maxlength']) return 'Name must be ≤ 100 characters';
    }
    return null;
  }

  get errorControlsSalary() {
    const control = this.form.get('salary'); // Fixed typo: was 'falary'
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Salary is required';
      if (control.errors['min']) return 'Salary must be at least $0.01';
      if (control.errors['pattern']) return 'Invalid format. Use: 0.00 or 100.50';
    }
    return null;
  }

  /** Handle department select changes */
  handleDepartmentChange(departmentId: number): void {
    this.form.controls["departmentId"].setValue(departmentId);
  }

  /** Handle role select changes */
  handleRoleChange(roleId: number): void {
    this.form.controls["roleId"].setValue(roleId);
  }

  /** Handle salary input changes */
  onSalaryInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove any non-digit characters except decimal point
    value = value.replace(/[^\d.]/g, '');

    // Handle decimal places
    const parts = value.split('.');
    if (parts.length > 1) {
      value = parts[0] + '.' + parts[1].slice(0, 2);
    }

    // Update form value
    this.form.controls["salary"].setValue(value);
  }

  /** Cancel and close dialog */
  cancel(): void {
    this.dialogRef.close(null);
  }

  /** Confirm save */
  confirm(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      if(this.data.employeeId === undefined) {
        this.createEmployee();
      } else {
        this.updateEmployee();
      }
    } else {
      this._snackbarService.error("Please fix the validation errors.");
    }
  }

  createEmployee(): void {
    this.isLoading = true;
    const formValue = this.form.getRawValue();
    const newEmployee: Employee = {
      id: formValue.id,
      name_: formValue.name_.trim(),
      salary: parseFloat(parseFloat(formValue.salary).toFixed(2)),
      departmentId: formValue.departmentId,
      roleId: formValue.roleId
    };

    this._employeeService.addEmployee(newEmployee);
    this._employeeService.notifyEmployeesChanged();
    this._snackbarService.success("Employee created.");
    this.dialogRef.close(this.data.employeeId);
    this.isLoading = false;
  }

  updateEmployee(): void {
    this.isLoading = true;
    const formValue = this.form.getRawValue();
    const updatedEmployee: Employee = {
      id: formValue.id,
      name_: formValue.name_.trim(),
      salary: parseFloat(parseFloat(formValue.salary).toFixed(2)),
      departmentId: formValue.departmentId,
      roleId: formValue.roleId
    };

    this._employeeService.updateEmployee(updatedEmployee);
    this._employeeService.notifyEmployeesChanged();
    this._snackbarService.success("Employee saved.");
    this.dialogRef.close(this.data.employeeId);
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
