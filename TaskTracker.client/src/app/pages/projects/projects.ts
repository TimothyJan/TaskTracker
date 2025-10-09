import { Component, inject, OnDestroy, OnInit, computed, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from './project/project';
import { ProjectDialog } from '../../dialogs/project-dialog/project-dialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse } from '../../models/apiResponse.model';
import { ProjectModel } from '../../models/project.model'; // Import ProjectModel

import { SnackbarService } from '../../services/snackbar-service';
import { ProjectService } from '../../services/project-service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from "@angular/material/menu";
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Projects' },
  { value: 'Active', label: 'Active' },
  { value: 'Not Started', label: 'Not Started' },
  { value: 'Completed', label: 'Completed' }
] as const;

@Component({
  selector: 'app-projects',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    Project,
    MatTabsModule
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
  standalone: true
})
export class Projects implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _projectService = inject(ProjectService);
  private _cdr = inject(ChangeDetectorRef);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;

  // Store both IDs and full projects
  projectIds = signal<number[]>([]);
  allProjects = signal<ProjectModel[]>([]);

  selectedStatus = signal<string>('all');

  // Computed signal for filtered project IDs
  filteredProjectIds = computed(() => {
    const status = this.selectedStatus();
    const projects = this.allProjects();

    if (status === 'all') {
      return this.projectIds();
    }

    // Filter projects by status and return their IDs
    return projects
      .filter(project => project.status_ === status)
      .map(project => project.id);
  });

  statusOptions = STATUS_OPTIONS;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProjects(); // Load full projects for filtering

    // Subscribe to changes in projects
    this._projectService.projectsChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.loadProjects();
      });
  }

  /** Load all projects (for filtering) and their IDs */
  loadProjects(): void {
    this.isLoading = true;

    this._projectService.getProjects()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: ApiResponse<ProjectModel[]>) => {
          if (response.success && response.data) {
            this.allProjects.set(response.data);
            this.projectIds.set(response.data.map(p => p.id));
          } else {
            setTimeout(() => {
              this._snackbarService.error(response.message || 'Failed to load projects');
            });
          }
          this.isLoading = false;
          this._cdr.detectChanges();
        },
        error: (error) => {
          setTimeout(() => {
            this._snackbarService.error(error.error?.message || 'Failed to load projects');
          });
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      });
  }

  onStatusChange(status: string): void {
    this.selectedStatus.set(status);
  }

  onTabChange(event: any): void {
    const selectedIndex = event.index;
    if (selectedIndex >= 0 && selectedIndex < this.statusOptions.length) {
      this.onStatusChange(this.statusOptions[selectedIndex].value);
    }
  }

  /** Open Project Create Dialog */
  openProjectCreateDialog(): void {
    this.dialog.open(ProjectDialog, {
      width: '500px',
      data: { }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
