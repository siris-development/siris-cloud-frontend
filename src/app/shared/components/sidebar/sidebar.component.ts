import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from '../../../dashboard/dashboard.routes';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  
  public menuItems = dashboardRoutes
    .map( route => route.children ?? [])
    .flat()
    .filter( route => route && route.path)
    .filter( route => !route.path?.includes(':'))

    constructor() {
      console.log(this.menuItems);
    }
} 