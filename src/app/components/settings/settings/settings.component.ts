import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { SettingSidebarComponent } from '../../setting-sidebar/setting-sidebar.component';
import { AvatarComponent, ButtonsComponent } from 'sistem';



@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SidebarComponent, SettingSidebarComponent, AvatarComponent, ButtonsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  isSidebarClosed = false;

  onSidebarToggled(closed: boolean) {
    this.isSidebarClosed = closed;
  }
}
