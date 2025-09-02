import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { SelectDept } from '../../components/select-dept/select-dept';
import { Role } from '../../models/role.model';

import { SnackbarService } from '../../services/snackbar-service';
import { RoleService } from '../../services/role-service';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-role-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    SelectDept,
    MatProgressSpinnerModule
  ],
  templateUrl: './role-dialog.html',
  styleUrl: './role-dialog.css',
  standalone: true
})
export class RoleDialog implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _roleService = inject(RoleService);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  form: FormGroup = new FormGroup({
    id: new FormControl(0, [Validators.pattern(/^\d+$/)]),
    name_: new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
    departmentId: new FormControl(-1, [Validators.required, Validators.pattern(/^\d+$/)])
  });

  constructor(
    private dialogRef: MatDialogRef<RoleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { roleId?: number },
  ) {}

  ngOnInit(): void {
    if(this.data.roleId !== undefined) {
      this.setRoleFormValues();
    }
  }

  setRoleFormValues(): void {
    this.isLoading = true;
    const role = this._roleService.getRoleById(this.data.roleId!);
    this.form.patchValue({
      id: role?.id,
      name_: role?.name_,
      departmentId: role?.departmentId
    })
    this.isLoading = false;
  }

  get errorControls() {
    const control = this.form.get("name_");
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['minlength']) return 'Must be at least 1 characters';
      if (control.errors['maxlength']) return 'Must be ≤ 100 characters';
    }
    return null;
  }

  /** Handle department select changes */
  handleDepartmentChange(departmentId: number): void {
    this.form.controls["departmentId"].setValue(departmentId);
  }

  /** Cancel and close dialog */
  cancel(): void {
    this.dialogRef.close(null);
  }

  /** Confirm save */
  confirm(): void {
    this.form.markAllAsTouched();

    if(this.data.roleId === undefined) {
      this.createRole();
    } else {
      this.updateRole();
    }
  }

  createRole(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const formValue = this.form.getRawValue();
      const newRole: Role = {
        id: formValue.id,
        name_: formValue.name_.trim(),
        departmentId: formValue.departmentId
      }
      if(!this._roleService.checkDuplicates(newRole)) {
        this._roleService.createRole(newRole);
        this._roleService.notifyRolesChanged();
        this._snackbarService.success("Role created.");
        this.dialogRef.close(this.data.roleId);
      }
      else {
        this._snackbarService.error("Role already exists.");
      }
      this.isLoading = false;
    }
    else {
      this._snackbarService.error("Role failed to be created.");
      this.isLoading = false;
    }
  }

  updateRole(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const formValue = this.form.getRawValue();
      const updatedRole: Role = {
        id: formValue.id,
        name_: formValue.name_.trim(),
        departmentId: formValue.departmentId
      }
      if(!this._roleService.checkDuplicates(updatedRole, updatedRole.id)) {
        this._roleService.updateRole(updatedRole);
        this._roleService.notifyRolesChanged();
        this._snackbarService.success("Role saved.");
        this.dialogRef.close(this.data.roleId);
      }
      else {
        this._snackbarService.error("Role already exists.");
      }
      this.isLoading = false;
    } else {
      this._snackbarService.error("Invalid role values");
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
