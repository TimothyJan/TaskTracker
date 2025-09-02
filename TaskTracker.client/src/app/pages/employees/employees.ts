import { Component } from '@angular/core';
import { EmployeeList } from './employee-list/employee-list';
import { EmployeeDialog } from '../../dialogs/employee-dialog/employee-dialog';

import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-employees',
  imports: [
    EmployeeList,
    MatCardModule,
    MatGridListModule,
    MatButtonModule
  ],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
  standalone: true
})
export class Employees {

  constructor(
    private dialog: MatDialog
  ) {}

  onOpenEmployeeDialog(): void {
    this.dialog.open(EmployeeDialog, {
      width: '600px',
      data: { }
    });
  }

}
