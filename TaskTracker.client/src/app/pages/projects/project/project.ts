import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectModel } from '../../../models/project.model';
import { ProjectTask } from '../project-task/project-task';
import { ProjectDialog } from '../../../dialogs/project-dialog/project-dialog';
import { ProjectTaskDialog } from '../../../dialogs/project-task-dialog/project-task-dialog';
import { Subject, takeUntil } from 'rxjs';

import { SnackbarService } from '../../../services/snackbar-service';
import { ProjectService } from '../../../services/project-service';
import { ProjectTaskService } from '../../../services/project-task-service';

import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from "@angular/material/grid-list";
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-project',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    ProjectTask,
    MatProgressSpinnerModule
  ],
  templateUrl: './project.html',
  styleUrl: './project.css',
  standalone: true
})
export class Project implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _projectService = inject(ProjectService);
  private _projectTaskService = inject(ProjectTaskService);
  private unsubscribe$ = new Subject<void>();

  @Input() projectId: number = 0;

  isLoading: boolean = false;
  project : ProjectModel = new ProjectModel(0, "", "", "Not Started", new Date(), new Date());
  listOfProjectTaskIds: number[] = [];

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProjectById();
    this.getListOfProjectTaskIdsByProjectId();
  }

  /** Get Project by Id */
  getProjectById(): void {
    this.isLoading = true;
    this.project = this._projectService.getProjectById(this.projectId);
    this.isLoading = false;

    // Add this subscription for project changes
    this._projectService.projectsChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getProjectById(); // Refresh the project data
      });
  }

  /** Get list of ProjectTaskIds by ProjectId */
  getListOfProjectTaskIdsByProjectId(): void {
    this.isLoading = true;
    this.listOfProjectTaskIds = this._projectTaskService.getListOfProjectTaskIdsByProjectIds(this.projectId);
    this.isLoading = false;

    // Subscribe to changes in the task list
    this._projectTaskService.projectTasksChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getListOfProjectTaskIdsByProjectId(); // Refresh the list
      });
  }

  /** Opens Project Edit Dialog */
  async openProjectEditDialog() {
    this.dialog.open(ProjectDialog, {
      width: '600px',
      data: { projectId: this.project.id }
    });
  }

  /** Opens Project Task Create Dialog */
  async openProjectTaskCreateDialog() {
    this.dialog.open(ProjectTaskDialog, {
      width: '600px',
      data: { projectId: this.projectId }
    })
  }

  onDelete(): void {
    const confirmDelete = confirm('Are you sure you want to delete this project?');
    if (confirmDelete) {
      this.isLoading = true;
      this._projectService.deleteProject(this.project.id);
      this._snackbarService.success("Department deleted.");
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
