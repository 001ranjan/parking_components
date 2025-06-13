import { Component } from '@angular/core';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  isSidebarClosed = false;
  subMenusState: Record<number, boolean> = {};
  onSidebarToggled(closed: boolean) {
    this.isSidebarClosed = closed;
  }
  toggleSidebar(): void {
    this.isSidebarClosed = !this.isSidebarClosed;
    if (this.isSidebarClosed) {
      this.closeAllSubMenus();
    }
  }
  closeAllSubMenus(): void {
    this.subMenusState = {};
  }

}
