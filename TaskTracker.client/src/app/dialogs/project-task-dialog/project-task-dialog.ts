import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DatePicker } from '../../components/date-picker/date-picker';
import { SelectStatus } from '../../components/select-status/select-status';
import { ProjectTaskModel } from '../../models/project-task.model';
import { ApiResponse } from '../../models/apiResponse.model';

import { SnackbarService } from '../../services/snackbar-service';
import { ProjectTaskService } from '../../services/project-task-service';

import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-project-task-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    SelectStatus,
    DatePicker,
    MatProgressSpinnerModule
  ],
  templateUrl: './project-task-dialog.html',
  styleUrl: './project-task-dialog.css',
  standalone: true
})
export class ProjectTaskDialog implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _projectTaskService = inject(ProjectTaskService);
  private _cdr = inject(ChangeDetectorRef);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  form: FormGroup = new FormGroup({
    id: new FormControl(0, [Validators.required, Validators.pattern(/^\d+$/)]),
    projectId: new FormControl(0, [Validators.required, Validators.pattern(/^\d+$/)]),
    name: new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
    description: new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
    status: new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    startDate: new FormControl(""),
    dueDate: new FormControl(""),
    assignedEmployeeIds: new FormControl([]),
  });

  constructor(
    private dialogRef: MatDialogRef<ProjectTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number, projectTaskId?: number },
  ) {}

  ngOnInit() {
    if (this.data.projectTaskId !== undefined) {
      this.setProjectTaskFormValues();
    }
    else {
      this.assignProjectId();
    }
  }

  /** Assigns projectId to form */
  assignProjectId(): void {
    this.form.controls["projectId"].setValue(this.data.projectId);
  }

  /** Set form using getProjectTaskById */
  setProjectTaskFormValues(): void {
    this.isLoading = true;
    if (this.data.projectTaskId) {
      this._projectTaskService.getProjectTaskById(this.data.projectTaskId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: ApiResponse<ProjectTaskModel>) => {
          if (response.success) {
            const projectTask = response.data || new ProjectTaskModel(0, 0, "", "", "Not Started", new Date(), new Date(), []);
            this.form.patchValue({
              id: projectTask.id,
              projectId: this.data.projectId,
              name: projectTask.name,
              description: projectTask.description,
              status: projectTask.status,
              startDate: projectTask.startDate,
              dueDate: projectTask.dueDate,
              assignedEmployeeIds: projectTask.assignedEmployeeIds,
            })
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

  get errorControlsName() {
    const control = this.form.get('name_');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Name is required';
      if (control.errors['minlength']) return 'Name must be at least 2 characters';
      if (control.errors['maxlength']) return 'Name must be ≤ 100 characters';
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

  /** Handles status_ change from status_ selector component and assigns status_ to form */
  handleStatusChange(status: string): void {
    this.form.patchValue({ status: status });
  }

  /** Handles startDate change from date-selector component and assigns date value to form */
  handleStartDateSelection(selectedDate: Date): void {
    this.form.patchValue({ startDate: selectedDate });
  }

  /** Handles dueDate change from date-selector component and assigns date value to form */
  handleDueDateSelection(selectedDate: Date): void {
    this.form.patchValue({ dueDate: selectedDate });
  }

  /** Cancel and close modal */
  cancel() {
    this.dialogRef.close(null);
  }

  /** Confirm save and close modal */
  confirm() {
    this.form.markAllAsTouched();
    if(this.form.valid) {
      if (this.data.projectTaskId === undefined) {
        this.createProjectTask();
      } else {
        this.updateProjectTask();
      }
      this.dialogRef.close(null);
    } else {
      this._snackbarService.error("Please fill all required fields correctly.");
    }
  }

  createProjectTask(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const formValue = this.form.getRawValue();
      const newProjectTask: ProjectTaskModel = {
        id: formValue.id,
        projectId: this.data.projectId,
        name: formValue.name.trim(),
        description: formValue.description.trim(),
        status: formValue.status,
        startDate: formValue.startDate,
        dueDate: formValue.dueDate,
        assignedEmployeeIds: formValue.assignedEmployeeIds
      };
      this._projectTaskService.createProjectTask(newProjectTask)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: ApiResponse<ProjectTaskModel>) => {
          if (response.success) {
            setTimeout(() => {
              this._projectTaskService.notifyProjectTasksChanged();
            });
            setTimeout(() => {
              this._snackbarService.success(response.message || "Project Task created successfully.");
            });
            this.dialogRef.close(this.data.projectId);
          } else {
            setTimeout(() => {
              this._snackbarService.error(response.message || "Failed to create project task.");
            });
          }
          this.isLoading = false;
          this._cdr.detectChanges();
        },
        error: (response) => {
          setTimeout(() => {
            this._snackbarService.error(response.error?.message || 'Failed to create project task.');
          });
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      });
      this.dialogRef.close(this.data.projectTaskId);
    } else {
      this._snackbarService.error("Failed to create project task.");
      this.isLoading = false;
    }
  }

  updateProjectTask(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const formValue = this.form.getRawValue();
      const updatedProjectTask: ProjectTaskModel = {
        id: formValue.id,
        projectId: this.data.projectId,
        name: formValue.name.trim(),
        description: formValue.description.trim(),
        status: formValue.status,
        startDate: formValue.startDate,
        dueDate: formValue.dueDate,
        assignedEmployeeIds: formValue.assignedEmployeeIds
      };
      this._projectTaskService.updateProjectTask(updatedProjectTask)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: ApiResponse) => {
          if (response.success) {
            setTimeout(() => {
              this._projectTaskService.notifyProjectTasksChanged();
            });
            setTimeout(() => {
              this._snackbarService.success(response.message);
            });
          } else {
            setTimeout(() => {
              this._snackbarService.error(response.message  || "Failed to update project task.");
            });
          }
          this.isLoading = false;
          this._cdr.detectChanges();
        },
        error: (response) => {
          setTimeout(() => {
            this._snackbarService.error(response.error?.message || 'Failed to update project task.');
          });
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      });
      this.dialogRef.close(this.data.projectId);
    } else {
      this._snackbarService.error("Failed to update project task.");
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
