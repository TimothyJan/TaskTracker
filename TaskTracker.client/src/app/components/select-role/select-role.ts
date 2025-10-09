import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role } from '../../models/role.model';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse } from '../../models/apiResponse.model';

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
  private _cdr = inject(ChangeDetectorRef);
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

    // Subscribe to the role notifications
    this._roleService.rolesChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        setTimeout(() => this.getRoles());
      });
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
      this._roleService.getRolesFromDepartmentId(this.departmentId)
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
    } else {
      this.roles = [];
      this.selectedRoleId = null;
    }
  }

  /** Set the selected role based on input roleId */
  setSelectedRole(): void {
    if (this.roleId !== null) {
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
