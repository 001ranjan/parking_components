import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private isClosed = new BehaviorSubject<boolean>(
    localStorage.getItem('sidebarClosed') === 'true'
  );

  // Observable to listen for changes
  isSidebarClosed$ = this.isClosed.asObservable();

  // Get the current value
  getSidebarState(): boolean {
    return this.isClosed.value;
  }

  // Toggle and update localStorage
  toggleSidebar(): void {
    const newState = !this.isClosed.value;
    this.isClosed.next(newState);
    localStorage.setItem('sidebarClosed', String(newState));
  }

  // Explicit setter if needed
  setSidebarState(closed: boolean): void {
    this.isClosed.next(closed);
    localStorage.setItem('sidebarClosed', String(closed));
  }
}
