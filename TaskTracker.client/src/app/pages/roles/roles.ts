import { Component } from '@angular/core';
import { RoleList } from './role-list/role-list';
import { RoleDialog } from '../../dialogs/role-dialog/role-dialog';

import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-roles',
  imports: [
    RoleList,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
  ],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
  standalone: true
})
export class Roles {

  constructor(
    private dialog: MatDialog
  ) {}

  onOpenRoleDialog(): void {
    this.dialog.open(RoleDialog, {
      width: '500px',
      data: { }
    });
  }

}
