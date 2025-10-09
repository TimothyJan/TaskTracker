import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectModel } from '../../../models/project.model';
import { ProjectTask } from '../project-task/project-task';
import { ProjectDialog } from '../../../dialogs/project-dialog/project-dialog';
import { ProjectTaskDialog } from '../../../dialogs/project-task-dialog/project-task-dialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse } from '../../../models/apiResponse.model';

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
  private _cdr = inject(ChangeDetectorRef);
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

    // Subscribe to the employee notifications
    this._projectService.projectsChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        setTimeout(() => this.getProjectById());
      });
    // Subscribe to the projectTask notifications
    this._projectTaskService.projectTasksChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        setTimeout(() => this.getListOfProjectTaskIdsByProjectId());
      });
  }

  /** Get Project by Id */
  getProjectById(): void {
    this.isLoading = true;
    this._projectService.getProjectById(this.projectId)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: ApiResponse<ProjectModel>) => {
        if (response.success) {
          this.project = response.data || new ProjectModel(0, "", "", "Not Started", new Date(), new Date());
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
          this._snackbarService.error(response.error?.message || 'Failed to load project.');
        });
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    });
  }

  /** Get list of ProjectTaskIds by ProjectId */
  getListOfProjectTaskIdsByProjectId(): void {
    this.isLoading = true;
    this._projectTaskService.getListOfProjectTaskIdsByProjectId(this.projectId)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: ApiResponse<number[]>) => {
        if (response.success) {
          this.listOfProjectTaskIds = response.data || [];
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
          this._snackbarService.error(response.error?.message || 'Failed to load list of project task ids.');
        });
        this.isLoading = false;
        this._cdr.detectChanges();
      }
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
      this._projectService.deleteProject(this.projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: ApiResponse<Number[]>) => {
          if (response.success) {
            setTimeout(() => {
              this._snackbarService.success("Project deleted.");
            });
            setTimeout(() => {
              this._projectService.notifyProjectsChanged();
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
            this._snackbarService.error(response.error?.message || 'Failed to delete project.');
          });
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
