import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent, TooltipDirective } from 'sistem';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'ui-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    RouterModule,
    TooltipDirective
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isSidebarClosed = false;

  @Output() sidebarToggled = new EventEmitter<boolean>();
  subMenusState: boolean[] = [false, false];
  parkingId: string = 'f5b0fc9f-ddde-4c3a-a25f-9ef679660db7';

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.isSidebarClosed = this.sidebarService.getSidebarState();
    this.sidebarService.isSidebarClosed$.subscribe(value => {
      this.isSidebarClosed = value;
    });
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar(); // ✅ Use shared service to toggle state
    this.sidebarToggled.emit(this.sidebarService.getSidebarState()); // Notify parent
  }

  toggleSubMenu(index: number): void {
    this.subMenusState[index] = !this.subMenusState[index];
  }
}
