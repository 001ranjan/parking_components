import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  IconComponent,

} from 'sistem';

@Component({
  selector: 'ui-settingSidebar',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    RouterModule,
  ],
  templateUrl: './setting-sidebar.component.html',
  styleUrl: './setting-sidebar.component.css'
})
export class SettingSidebarComponent {
  isSidebarClosed = false;
  @Output() sidebarToggled = new EventEmitter<boolean>();
  subMenusState: boolean[] = [false, false];
  parkingId: string = 'f5b0fc9f-ddde-4c3a-a25f-9ef679660db7';

  toggleSidebar(): void {
    this.isSidebarClosed = !this.isSidebarClosed;
    this.sidebarToggled.emit(this.isSidebarClosed);
  }

  toggleSubMenu(index: number): void {
    this.subMenusState[index] = !this.subMenusState[index];
  }
}

