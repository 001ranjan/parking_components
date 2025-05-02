import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  SideNavigationComponent,
  CheckboxComponent,
  BreadcrumbsComponent,
  NotificationComponent,
  SearchComponent,
  ButtonsComponent,
  DropdownComponent,
  VehicalComponent,
  CalendarComponent,
  DoubleCalendarComponent,
  ModalComponent,
  SnackbarComponent,
} from 'sistem';

interface SessionData {
  vehicleNo: string;
  booking: string;
  timeIn: string;
  timeOut: string;
  advance: string;
  totalTime: string;
  collection: string;
  refund: string;
  total: string;
  mode: string;
  reference: string;
  vehicleType: string;
  vehicleIcon: string;
  status: string;
  operator: string;
  selected?: boolean;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SideNavigationComponent,
    RouterLink,
    RouterModule,
    VehicalComponent,
    CheckboxComponent,
    BreadcrumbsComponent,
    NotificationComponent,
    SearchComponent,
    ButtonsComponent,
    DropdownComponent,
    CalendarComponent,
    DoubleCalendarComponent,
    ModalComponent,
    SnackbarComponent,
  ],
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
})
export class SessionComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}
  selectedRange: { startDate: Date | null; endDate: Date | null } | null = null;
  topTag: { label: string; url: string }[] = [];
  bottomtag: { label: string; url: string }[] = [];
  sessionTypes = ['type', 'Car', 'Bike', 'Cycle', 'Truck'];
  operatorList = ['operator', 'operator 1', 'operator 2', 'operator 3'];
  statusList = ['Status', 'in vehicle', 'out vehicle', 'booking'];
  selectedType = this.sessionTypes[0];
  selectedOperator = this.operatorList[0];
  selectedStatus = this.statusList[0];
  filteredSessions: SessionData[] = [];
  paginatedSessions: SessionData[] = [];
  totalSessions: number = 0;
  currentPage: number = 1;
  readonly rowsPerPage: number = 25;
  totalPages: number = 1;
  isChecked: boolean = false;
  checkedRows: Set<number> = new Set();
  tempPage: number | null = this.currentPage;
  errorMessage: string | null = null;
  sortField: string | null = null;
  sortOrder: 'asc' | 'desc' = 'asc';

  ngOnInit() {
    this.initializeData();
  }

  initializeData() {
    this.filteredSessions = [...this.sessions];
    this.totalSessions = this.sessions.length;
    this.totalPages = Math.ceil(this.totalSessions / this.rowsPerPage);
    this.currentPage = 1;
    this.updatePaginatedSessions();
    this.updateTags();
  }

  menuItems = [
    { route: '/session', label: 'Session', icon: 'bell' },
    {
      route: '/radio-button',
      label: 'Radio btn',
      icon: '../../../assets/images/icons/dark.svg',
    },
    {
      route: '/checkbox',
      label: 'Checkbox',
      icon: '../../../assets/images/icons/dark.svg',
    },
    {
      route: '/toggle',
      label: 'Toggle',
      icon: '../../../assets/images/icons/dark.svg',
    },
    {
      route: '/text',
      label: 'Text',
      icon: '../../../assets/images/icons/dark.svg',
    },
    {
      route: '/otp',
      label: 'OTP',
      icon: '../../../assets/images/icons/dark.svg',
    },
    {
      route: '/calendar',
      label: 'Calendar',
      icon: '../../../assets/images/icons/dark.svg',
    },
    {
      route: '/number',
      label: 'Number',
      icon: '../../../assets/images/icons/dark.svg',
    },
    {
      route: '/search',
      label: 'Search',
      icon: '../../../assets/images/icons/dark.svg',
    },
    {
      route: '/sidebar',
      label: 'Sidebar',
      icon: '../../../assets/images/icons/dark.svg',
    },
  ];

  sessions: SessionData[] = Array.from({ length: 60 }, (_, index) => {
    const vehicleTypes: ('bike' | 'car' | 'cycle')[] = ['bike', 'car', 'cycle'];
    const vehicleIcons: { bike: string; car: string; cycle: string } = {
      bike: '../../../../assets/images/icons/bike.svg',
      car: '../../../../assets/images/icons/car.svg',
      cycle: '../../../../assets/images/icons/cycle.svg',
    };

    const randomVehicleType =
      vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];

    // Generate random start and end dates
    const baseDate = new Date();
    const startDate = new Date(baseDate);
    startDate.setDate(baseDate.getDate() - Math.floor(Math.random() * 30)); // up to 30 days in the past
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 5)); // up to 5 days after startDate

    return {
      vehicleNo: `uk07${String(3000 + index).padStart(4, '0')}`,
      booking: Math.random() > 0.5 ? 'yes' : 'no',
      timeIn: `${Math.floor(9 + (index % 12))}:${Math.floor(Math.random() * 60)
        .toString()
        .padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      timeOut: `${Math.floor(10 + ((index + 1) % 12))}:${Math.floor(
        Math.random() * 60
      )
        .toString()
        .padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      advance: `${Math.floor(Math.random() * 100)}`,
      totalTime: `${Math.floor(15 + Math.random() * 45)} mins`,
      collection: `${Math.floor(100 + Math.random() * 400)}`,
      refund: `${Math.floor(Math.random() * 50)}`,
      total: `${Math.floor(80 + Math.random() * 420)}`,
      mode: Math.random() > 0.5 ? 'cash' : 'card',
      reference: `Ref ${index + 1}`,
      vehicleType: randomVehicleType,
      vehicleIcon: vehicleIcons[randomVehicleType],
      status: Math.random() > 0.5 ? 'in vehicle' : 'out vehicle',
      operator: `operator ${Math.floor(1 + Math.random() * 5)}`,
      startDate: startDate.toISOString().split('T')[0], // format as YYYY-MM-DD
      endDate: endDate.toISOString().split('T')[0], // format as YYYY-MM-DD
    };
  });

  paginat() {
    this.totalPages = Math.ceil(this.sessions.length / this.rowsPerPage);
    this.totalSessions = this.sessions.length;
    this.filteredSessions = [...this.sessions];
    this.updateTags();
    this.updatePaginatedSessions();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.paginatedSessions = this.sessions.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.totalSessions / this.rowsPerPage);
  }

  updatePaginatedSessions() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.paginatedSessions = this.filteredSessions.slice(startIndex, endIndex);
    console.log('Showing items:', this.paginatedSessions.length, 'from', startIndex, 'to', endIndex);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedSessions();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedSessions();
    }
  }

  onTypeSelectionChange(selectedType: any) {
    this.selectedType = selectedType;
  }

  onOperatorSelectionChange(selectedOperator: any) {
    this.selectedOperator = selectedOperator;
  }

  onStatusSelectionChange(selectedStatus: any) {
    this.selectedStatus = selectedStatus;
  }

  onDateRangeSelected(range: { startDate: Date | null; endDate: Date | null }) {
    this.selectedRange = range;
    console.log('Selected Date Range:', this.selectedRange);
  }

  applyFilter() {
    this.filterSessions();
  }

  filterSessions() {
    // Start with all sessions
    this.filteredSessions = [...this.sessions];

    const isTypeFiltered =
      this.selectedType && this.selectedType !== this.sessionTypes[0];
    const isOperatorFiltered =
      this.selectedOperator && this.selectedOperator !== this.operatorList[0];
    const isStatusFiltered =
      this.selectedStatus && this.selectedStatus !== this.statusList[0];
    const isDateRangeFiltered =
      this.selectedRange &&
      this.selectedRange.startDate &&
      this.selectedRange.endDate;

    if (isTypeFiltered) {
      this.filteredSessions = this.filteredSessions.filter((session) => {
        return (
          session.vehicleType.toLowerCase() === this.selectedType.toLowerCase()
        );
      });
    }

    if (isOperatorFiltered) {
      this.filteredSessions = this.filteredSessions.filter((session) => {
        return (
          session.operator.toLowerCase() === this.selectedOperator.toLowerCase()
        );
      });
    }

    if (isStatusFiltered) {
      this.filteredSessions = this.filteredSessions.filter((session) => {
        return (
          session.status.toLowerCase() === this.selectedStatus.toLowerCase()
        );
      });
    }

    // Filter by date range
    if (isDateRangeFiltered && this.selectedRange) {
      const { startDate, endDate } = this.selectedRange;
      this.filteredSessions = this.filteredSessions.filter((session) => {
        const sessionDate = new Date(session.startDate);
        return sessionDate >= startDate! && sessionDate <= endDate!;
      });
    }

    // Update total sessions and pages based on the filtered result
    this.totalSessions = this.filteredSessions.length;
    this.totalPages = Math.ceil(this.totalSessions / this.rowsPerPage);
    
    // Reset to first page when filtering
    this.currentPage = 1;
    
    // Apply pagination to filtered results
    this.updatePaginatedSessions();
    this.updateTags();
  }

  clearFilters() {
    this.filteredSessions = [...this.sessions];
    this.totalSessions = this.sessions.length;
    this.totalPages = Math.ceil(this.totalSessions / this.rowsPerPage);
    this.currentPage = 1;
    this.updatePaginatedSessions();
    this.updateTags();
  }

  updateTags() {
    this.topTag = [
      { label: `${this.totalSessions} items`, url: '/' },
      { label: 'Sorted by CREATED AT', url: '/' },
    ];
    this.bottomtag = [
      { label: `Total: ${this.totalSessions} items`, url: '/' },
    ];
  }

  // Method to handle "Select All" checkbox change
  selectAll(event: any): void {
    const checked = event?.target?.checked;

    if (checked) {
      // Add all indices for the current page to checkedRows
      this.paginatedSessions.forEach((_, i) => {
        const globalIndex = (this.currentPage - 1) * this.rowsPerPage + i;
        this.checkedRows.add(globalIndex);
      });
    } else {
      // Remove all indices for the current page from checkedRows
      this.paginatedSessions.forEach((_, i) => {
        const globalIndex = (this.currentPage - 1) * this.rowsPerPage + i;
        this.checkedRows.delete(globalIndex);
      });
    }
  }

  // Check if a specific row is checked
  isRowChecked(index: number): boolean {
    const globalIndex = (this.currentPage - 1) * this.rowsPerPage + index;
    return this.checkedRows.has(globalIndex);
  }

  // Method to handle individual checkbox change
  onCheckboxChange(event: any, index: number): void {
    const checked = event?.target?.checked;
    const globalIndex = (this.currentPage - 1) * this.rowsPerPage + index;

    if (checked) {
      this.checkedRows.add(globalIndex);
    } else {
      this.checkedRows.delete(globalIndex);
    }
  }

  // Check if all rows on the current page are checked
  areAllRowsChecked(): boolean {
    return this.paginatedSessions.every((_, i) =>
      this.checkedRows.has((this.currentPage - 1) * this.rowsPerPage + i)
    );
  }

  onEnterPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.tempPage = this.tempPage
        ? Math.max(1, Math.min(this.tempPage, this.totalPages))
        : 1;
      this.goToPage(this.tempPage);
    }
  }

  goToPage(page: number) {
    if (isNaN(page) || page < 1) {
      this.currentPage = 1;
    } else if (page > this.totalPages) {
      this.currentPage = this.totalPages;
    } else {
      this.currentPage = page;
    }
    this.updatePaginatedSessions();
  }

  // data shorting
  sortSessions(field: keyof SessionData) {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.paginatedSessions.sort((a, b) => {
      const valueA = a[field] ?? '';
      const valueB = b[field] ?? '';

      if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getSortIcon(field: keyof SessionData): string {
    if (this.sortField === field) {
      return this.sortOrder === 'asc' ? '↑' : '↓';
    }
    return '';
  }

  @ViewChild(ModalComponent) modal!: ModalComponent;

  openTemplateOne(modalContentOne: any) {
    this.modal.openModal(modalContentOne);
  }
  formData = {
    fname: '',
    lname: '',
  };

  onFormSubmit() {
    if (this.formData.fname && this.formData.lname) {
      console.log('Form Submitted:', this.formData);
    } else {
      console.error('Form is incomplete.');
    }
  }
}
