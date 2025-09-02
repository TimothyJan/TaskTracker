import { AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavItem } from '../../models/nav-item.model';

import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidenavService } from '../../services/side-nav-service';

@Component({
  selector: 'app-sidenav',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
  standalone: true
})
export class Sidenav implements AfterViewInit, OnDestroy {
  @ViewChild('sidenav') matSidenav!: MatSidenav;
  private subscription: Subscription;
  currentYear = new Date().getFullYear();

  navItems: NavItem[] = [
    new NavItem("/home", "home", "Home"),
    new NavItem("/projects", "settings", "Projects"),
    new NavItem("/employees", "settings", "Employees"),
    new NavItem("/roles", "settings", "Roles"),
    new NavItem("/departments", "dashboard", "Departments"),
  ];

  constructor(
    public sidenavService: SidenavService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.subscription = this.sidenavService.isOpen$.subscribe(open => {
      if (this.matSidenav) {
        open ? this.matSidenav.open() : this.matSidenav.close();
      }
    });
  }

  ngAfterViewInit() {
    if (this.sidenavService.currentState) {
      setTimeout(() => this.matSidenav.open());
    } else {
      setTimeout(() => this.matSidenav.close());
    }
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  closeSidenav() {
    this.sidenavService.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
