import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { DatePicker } from '../../components/date-picker/date-picker';
import { SelectStatus } from '../../components/select-status/select-status';
import { ProjectModel } from '../../models/project.model';

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
      this.getProject();
    }
  }

  /** Get Project */
  getProject(): void {
    this.isLoading = true;
    const project = this._projectService.getProjectById(this.data.projectId!);
    if (!project) {
      console.log("Project not found.");
      this.dialogRef.close(null);
      return;
    }
    this.isLoading = false;

    this.form.patchValue({
      id: project.id,
      name_: project.name_,
      description_: project.description_,
      status_: project.status_,
      startDate: project.startDate,
      dueDate: project.dueDate
    });
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
    this._projectService.createProject(newProject);
    this._projectService.notifyProjectsChanged();
    this._snackbarService.success("Project created.");
    this.isLoading = false;
  }

  updateProject(): void {
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
    this._projectService.updateProject(updatedProject);
    this._projectService.notifyProjectsChanged();
    this._snackbarService.success("Project saved.");
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
