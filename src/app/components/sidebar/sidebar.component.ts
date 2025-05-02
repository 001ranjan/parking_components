import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  IconComponent,
 
} from 'sistem';

@Component({
  selector: 'ui-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isSidebarClosed = false;
  subMenusState: boolean[] = [false, false];
  
  toggleSidebar(): void {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
  
  toggleSubMenu(index: number): void {
    this.subMenusState[index] = !this.subMenusState[index];
  }
}
