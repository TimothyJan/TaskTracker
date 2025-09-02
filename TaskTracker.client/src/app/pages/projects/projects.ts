import { Component, inject, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from './project/project';
import { ProjectDialog } from '../../dialogs/project-dialog/project-dialog';
import { Subject, takeUntil } from 'rxjs';

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
export class Projects  implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _projectService = inject(ProjectService);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;

  // Use signals for better reactivity
  selectedStatus = signal<string>('all');
  allProjects = signal<number[]>([]);

  // Reference the constant
  statusOptions = STATUS_OPTIONS;

  // Computed signal for filtered projects - optimized version
  filteredProjectIds = computed(() => {
    const status = this.selectedStatus();

    if (status === 'all') {
      return this.allProjects();
    }

    // Filter based on status
    return this._projectService.getProjects()
      .filter(project => project.status_ === status)
      .map(project => project.id);
  });

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProjects();

    // Subscribe to changes in projects
    this._projectService.projectsChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.loadProjects();
      });
  }

  /** Load all project IDs */
  loadProjects(): void {
    this.isLoading = true;
    const projects = this._projectService.getProjects().map(project => project.id);
    this.allProjects.set(projects);
    this.isLoading = false;
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
