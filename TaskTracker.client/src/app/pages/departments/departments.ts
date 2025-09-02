import { Component } from '@angular/core';
import { DepartmentList } from './department-list/department-list';
import { DepartmentDialog } from '../../dialogs/department-dialog/department-dialog';

import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-departments',
  imports: [
    DepartmentList,
    MatCardModule,
    MatGridListModule,
    MatButtonModule
  ],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
  standalone: true
})
export class Departments {

  constructor(
    private dialog: MatDialog
  ) {}

  /** Open Department Create dialog */
  onOpenDepartmentDialog(): void {
    this.dialog.open(DepartmentDialog, {
      width: '500px',
      data: { },
    });
  }

}
