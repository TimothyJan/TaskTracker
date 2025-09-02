import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role } from '../../models/role.model';
import { Subject } from 'rxjs';

import { SnackbarService } from '../../services/snackbar-service';
import { RoleService } from '../../services/role-service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-select-role',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './select-role.html',
  styleUrl: './select-role.css',
  standalone: true
})
export class SelectRole implements OnInit, OnChanges, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _roleService = inject(RoleService);
  private unsubscribe$ = new Subject<void>();

  @Input() departmentId: number | null = null;
  @Input() roleId: number | null = null;
  @Output() roleChanged = new EventEmitter<number>();

  isLoading: boolean = false;
  roles: Role[] = [];
  selectedRoleId: number | null = null;

  constructor() {}

  ngOnInit(): void {
    this.getRoles();
    this.setSelectedRole();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['departmentId'] && !changes['departmentId'].firstChange) {
      this.getRoles();
    }
    if (changes['roleId']) {
      this.setSelectedRole();
    }
  }

  /** Load roles based on current departmentId */
  getRoles(): void {
    if (this.departmentId !== null) {
      this.isLoading = true;
      this.roles = this._roleService.getRolesFromDepartmentId(this.departmentId);
      this.isLoading = false;
      this.selectedRoleId = null; // Reset selection when department changes
    } else {
      this.roles = [];
      this.selectedRoleId = null;
    }
  }

  /** Set the selected role based on input roleId */
  setSelectedRole(): void {
    if (this.roleId !== null && this.roles.some(role => role.id === this.roleId)) {
      this.selectedRoleId = this.roleId;
    } else {
      this.selectedRoleId = null;
    }
  }

  /** On role change, emit value */
  onRoleChange(event: MatSelectChange): void {
    const roleId = Number(event.value);
    this.selectedRoleId = roleId;
    this.roleChanged.emit(roleId);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
