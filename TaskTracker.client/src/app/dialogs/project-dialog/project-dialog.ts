import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DatePicker } from '../../components/date-picker/date-picker';
import { SelectStatus } from '../../components/select-status/select-status';
import { ProjectModel } from '../../models/project.model';
import { ApiResponse } from '../../models/apiResponse.model';

import { SnackbarService } from '../../services/snackbar-service';
import { ProjectService } from '../../services/project-service';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-project-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    DatePicker,
    SelectStatus,
    MatProgressSpinnerModule
  ],
  templateUrl: './project-dialog.html',
  styleUrl: './project-dialog.css',
  standalone: true
})
export class ProjectDialog implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _projectService = inject(ProjectService);
  private _cdr = inject(ChangeDetectorRef);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  form: FormGroup = new FormGroup({
    id: new FormControl(0, [Validators.pattern(/^\d+$/)]),
    name_: new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
    description_: new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
    status_: new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    startDate: new FormControl(null),
    dueDate: new FormControl(null),
  });

  constructor(
    private dialogRef: MatDialogRef<ProjectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId?: number },
  ) {}

  ngOnInit(): void {
    // Edit Project, else create project
    if(this.data.projectId !== undefined) {
      this.setProjectFormValues();
    }

    // Subscribe to the employee notifications
    this._projectService.projectsChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        setTimeout(() => this.setProjectFormValues());
      });
  }

  /** Get Project */
  setProjectFormValues(): void {
    this.isLoading = true;
    if (this.data.projectId) {
      this._projectService.getProjectById(this.data.projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: ApiResponse<ProjectModel>) => {
          if (response.success) {
            const project = response.data || new ProjectModel(0, "", "", "Not Started", new Date(), new Date());
            this.form.patchValue({
              id: project.id,
              name_: project.name_,
              description_: project.description_,
              status_: project.status_,
              startDate: project.startDate,
              dueDate: project.dueDate
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
            this._snackbarService.error(response.error?.message || 'Failed to load employees');
          });
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      });
    }
  }

  get errorControlsProjectName() {
    const control = this.form.get('name_');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Project Name is required';
      if (control.errors['minlength']) return 'Project Name must be at least 2 characters';
      if (control.errors['maxlength']) return 'Project Name must be ≤ 100 characters';
    }
    return null;
  }

  get errorControlsDescription() {
    const control = this.form.get('description_');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Description is required';
      if (control.errors['minlength']) return 'Description must be at least 2 characters';
      if (control.errors['maxlength']) return 'Description must be ≤ 100 characters';
    }
    return null;
  }

  /** Handle status_ input changes */
  handleStatusChange(status_: string): void {
    this.form.patchValue({ status_ });
  }

  /** Handles startDate change */
  handleStartDateSelection(selectedDate: Date): void {
    this.form.patchValue({ startDate: selectedDate });
  }

  /** Handles endDate change */
  handleDueDateSelection(selectedDate: Date): void {
    this.form.patchValue({ dueDate: selectedDate });
  }

  /** Cancel and close dialog */
  cancel(): void {
    this.dialogRef.close(null);
  }

  /** Confirm create or update project */
  confirm(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      if (this.data.projectId === undefined) {
        this.createProject();
      } else {
        this.updateProject();
      }
      this.dialogRef.close(null);
    } else {
      this._snackbarService.error("Please fill all required fields correctly.");
    }
  }

  createProject(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const formValue = this.form.getRawValue();
      const newProject: ProjectModel = {
        id: formValue.id,
        name_: formValue.name_.trim(),
        description_: formValue.description_.trim(),
        status_: formValue.status_,
        startDate: formValue.startDate,
        dueDate: formValue.dueDate
      }
      this._projectService.createProject(newProject)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: ApiResponse<ProjectModel>) => {
          if (response.success) {
            setTimeout(() => {
              this._projectService.notifyProjectsChanged();
            });
            setTimeout(() => {
              this._snackbarService.success(response.message || "Project created successfully.");
            });
            this.dialogRef.close(this.data.projectId);
          } else {
            setTimeout(() => {
              this._snackbarService.error(response.message || "Failed to create project.");
            });
          }
          this.isLoading = false;
          this._cdr.detectChanges();
        },
        error: (response) => {
          setTimeout(() => {
            this._snackbarService.error(response.error?.message || 'Failed to create project.');
          });
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      });
      this.dialogRef.close(this.data.projectId);
    } else {
      this._snackbarService.error("Failed to create project.");
      this.isLoading = false;
    }
  }

  updateProject(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const formValue = this.form.getRawValue();
      const updatedProject: ProjectModel = {
        id: formValue.id,
        name_: formValue.name_.trim(),
        description_: formValue.description_.trim(),
        status_: formValue.status_,
        startDate: formValue.startDate,
        dueDate: formValue.dueDate
      }
      this._projectService.updateProject(updatedProject)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: ApiResponse) => {
          if (response.success) {
            setTimeout(() => {
              this._projectService.notifyProjectsChanged();
            });
            setTimeout(() => {
              this._snackbarService.success(response.message);
            });
          } else {
            setTimeout(() => {
              this._snackbarService.error(response.message  || "Failed to update project.");
            });
          }
          this.isLoading = false;
          this._cdr.detectChanges();
        },
        error: (response) => {
          setTimeout(() => {
            this._snackbarService.error(response.error?.message || 'Failed to update project.');
          });
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      });
      this.dialogRef.close(this.data.projectId);
    } else {
      this._snackbarService.error("Failed to update project.");
      this.isLoading = false;
    }

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
