import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectorRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import {
  BreadcrumbsComponent,
  ButtonsComponent,
  CheckboxComponent,
  DoubleCalendarComponent,
  DropdownComponent,
  IconComponent,
  NotificationComponent,
  SearchComponent,
  VehicalComponent,
  AvatarComponent,
  ModalComponent,
  SnackbarComponent,
  TooltipDirective,
  TextFieldComponent,
  StagesComponent,
  RadioButtonComponent,
  ToastComponent,
  TagsComponent
} from 'sistem';
import { SidebarComponent } from "../components/sidebar/sidebar.component";

interface SessionData {
  id?: string;
  vehicleNo: string;
  booking: string;
  timeIn: string;
  timeOut: string;
  advance: string;
  pass: string;
  vehicleAmt: number;
  helmetAmt: number;
  totalAmt: number;
  helmet: string;
  totalTime: string;
  collection: string;
  refund: string;
  total: string;
  mode: string;
  remarks: string;
  reference: string;
  vehicleType: string;
  vehicleTypeId: string;
  vehicleIcon: string;
  status: string;
  operator: string;
  selected?: boolean;
  startDate: string;
  endDate: string;
  vehicleBgColor: string;
}

interface Vehicle {
  vehicleTypeId?: string;
  regNumber?: string;
}

interface VehicleResponse {
  vehicle?: Vehicle;
  vehicleTypes?: string;
  bookingTime?: string;
  vehicleInPass?: string;
  inTime?: string;
  remarks?: string;
  outTime?: string;
  advance?: string;
  hours?: string;
  total?: string;
  refund?: string;
  paymentMode?: string;
  refNumber?: string;
  status?: string;
  inBy?: {
    firstName?: string;
    lastName?: string;
  };
  helmets?: Array<{ total?: number }>;
  createdAt?: string;
  updatedAt?: string;
  vehicleAmt?: number;
}

interface ApiResponse {
  rows: VehicleResponse[];
  count: number;
  limit: string;
  page: number;
  offset: number;
}

interface ShareDateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface ShareRequest {
  subject: string;
  emails: string[];
  fromDate: string;
  toDate: string;
  parkingId: string;
  operators: Record<string, boolean>;
  sessions: SessionData[];
  attachments: string;
}

@Component({
  selector: 'app-passes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,
    BreadcrumbsComponent,
    ButtonsComponent,
    CheckboxComponent,
    DoubleCalendarComponent,
    DropdownComponent,
    IconComponent,
    NotificationComponent,
    SearchComponent,
    VehicalComponent,
    AvatarComponent,
    ModalComponent,
    SnackbarComponent,
    TooltipDirective,
    TextFieldComponent,
    StagesComponent,
    RadioButtonComponent,
    ToastComponent,
    SidebarComponent,
    TagsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './passes.component.html',
  styleUrls: ['./passes.component.css']
})

export class PassesComponent implements OnInit {
  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('modalShare') modalShare: any;
  @ViewChild('modalSuspend') modalSuspend!: any;

  subject: string = '';
  emails: string = '';
  baseUrl = environment.baseUrl;
  sessions: SessionData[] = [];
  filteredSessions: SessionData[] = [];
  paginatedSessions: SessionData[] = [];
  totalSessions: number = 0;

  isSidebarClosed = false;
  subMenusState: Record<number, boolean> = {};
  resetCalendarTrigger: boolean = false;
  // topTag: { label: string; url: string }[] = [];

  toggleSidebar(): void {
    this.isSidebarClosed = !this.isSidebarClosed;
    if (this.isSidebarClosed) {
      this.closeAllSubMenus();
    }
  }

  toggleSubMenu(index: number): void {
    if (this.subMenusState[index]) {
      this.subMenusState[index] = false;
    } else {
      this.closeAllSubMenus();
      this.subMenusState[index] = true;
    }

    // If any submenu is open, remove the 'close' class from the sidebar
    if (Object.values(this.subMenusState).includes(true)) {
      this.isSidebarClosed = false;
    }
  }

  closeAllSubMenus(): void {
    this.subMenusState = {};
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private title: Title,
    private userService: UserService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  selectedRange: { startDate: Date | null; endDate: Date | null } | null = null;
  topTag: { label: string; url: string }[] = [];
  bottomTag: { label: string; url: string }[] = [];
  sessionTypes = ['type', 'Car', 'Bike', 'Cycle', 'Truck'];
  operatorList = ['operator'];
  operatorMap: { [key: string]: string } = {}; // Map to store operator name to ID mapping
  statusList = ['Status', 'active', 'expired'];
  selectedType = this.sessionTypes[0];
  selectedOperator = this.operatorList[0];
  selectedStatus = this.statusList[0];
  currentPage: number = 1;
  rowsPerPage: number = 25;
  totalPages: number = 1;
  isChecked: boolean = false;
  checkedRows: Set<number> = new Set();
  tempPage: number | null = this.currentPage;
  errorMessage: string | null = null;
  sortField: string | null = null;
  sortOrder: 'asc' | 'desc' = 'asc';
  parking_id = '';
  selectedOption: string = '';
  dateOption: string = 'yesterday';

  // Attachment related properties
  attachmentList: string[] = ['All', 'Excel', 'PDF'];
  selectedAttachment: string = 'All';

  isSkeletonVisible: boolean = true;
  isToastInfo = false;
  toastMessage = '';
  toastType: 'info' | 'success' | 'warning' | 'error' = 'info';
  toastHeading = '';
  openDotActionIndex: number | null = null;
  selectedPass: any = null;

  paginatedPasses: any[] = [];
  totalPasses: number = 0;

  toggleDotAction(event: Event, index: number) {
    event.stopPropagation();
    if (this.openDotActionIndex === index) {
      this.openDotActionIndex = null;
    } else {
      this.openDotActionIndex = index;
    }
  }

  isDotActionOpen(index: number): boolean {
    return this.openDotActionIndex === index;
  }

  showSuccessToast(message: string = 'Operation completed successfully!') {
    this.isToastInfo = false;
    setTimeout(() => {
      this.toastType = 'success';
      this.toastMessage = message;
      this.toastHeading = 'Success';
      this.isToastInfo = true;
      this.cdr.detectChanges();
    }, 10);
  }

  showExcelToast() {
    this.isToastInfo = true;
    this.toastType = 'warning';
    this.toastMessage = 'shared successfully.';
    this.toastHeading = 'Excel Status';
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.parking_id = params['id'] || '';
      this.fetchOperators();
      this.fetchPassesData();
    });
  }

  fetchOperators() {
    if (!this.parking_id) return;

    this.userService.parkingUserDetail(this.parking_id).subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response)) {
          // Update operator list with actual operators
          this.operatorList = ['operator', ...response.map((op: any) =>
            `${op.firstName} ${op.lastName}`
          )];

          // Create operator map for ID lookup
          response.forEach((op: any) => {
            const fullName = `${op.firstName} ${op.lastName}`;
            this.operatorMap[fullName] = op.id;
          });
        }
      },
      error: (error) => {
        console.error('Error fetching operators:', error);
      }
    });
  }

  fetchPassesData() {
    if (!this.parking_id) {
      console.error('No parking ID available');
      return;
    }

    this.isSkeletonVisible = true;
    const parkingId = this.parking_id;
    const page = this.currentPage;
    const orderBy = 'startDate:DESC';
    const limit = this.rowsPerPage;

    // Prepare filters
    const filters: any = {};

    // Vehicle Type Filter
    if (this.selectedType && this.selectedType !== this.sessionTypes[0]) {
      const vehicleTypeId = this.vehicleTypeMap[this.selectedType];
      console.log('Selected Type:', this.selectedType);
      console.log('Vehicle Type ID:', vehicleTypeId);

      if (vehicleTypeId) {
        filters.vehicleType = vehicleTypeId;
        console.log('Filters being sent:', filters);
      } else {
        console.error('No vehicleTypeId found for:', this.selectedType);
      }
    }

    // Operator Filter
    if (this.selectedOperator && this.selectedOperator !== this.operatorList[0]) {
      const operatorId = this.operatorMap[this.selectedOperator];
      if (operatorId) {
        filters.operator = operatorId;
        console.log('Setting operator filter:', operatorId);
      }
    }

    // Status Filter
    if (this.selectedStatus && this.selectedStatus !== this.statusList[0]) {
      filters.status = this.selectedStatus;
      console.log('Setting status filter:', this.selectedStatus);
    }

    // Date Range Filter
    if (this.selectedRange && this.selectedRange.startDate && this.selectedRange.endDate) {
      const formatDateToString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      filters.from = formatDateToString(this.selectedRange.startDate);
      filters.to = formatDateToString(this.selectedRange.endDate);
      console.log('Setting date range filter:', { from: filters.from, to: filters.to });
    }

    console.log('Making API call with filters:', {
      parkingId,
      page,
      orderBy,
      limit,
      filters
    });

    this.userService.getPasses(parkingId, page, orderBy, limit, filters).subscribe({
      next: (response: any) => {
        // console.log('API Response:', response);
        if (response && Array.isArray(response.rows)) {
          // Map the response data to match the table structure
          const mappedData = response.rows.map((pass: any) => {
            return {
              id: pass.id,
              vehicle: {
                regNumber: pass.vehicle?.regNumber || '',
                vehicleTypeId: pass.vehicle?.vehicleTypeId || '',
                name: pass.vehicle?.name || '',
                phone: pass.vehicle?.phone || '',
                email: pass.vehicle?.email || '',
                paymentMethod: pass.vehicle?.paymentMethod || ''
              },
              type: pass.type || '',
              startDate: pass.startDate || '',
              endDate: pass.endDate || '',
              parking: {
                name: pass.parking?.name || ''
              },
              paymentMode: pass.paymentMode || '',
              amount: pass.amount || 0,
              createdBy: {
                firstName: pass.createdBy?.firstName || '',
                lastName: pass.createdBy?.lastName || '',
                id: pass.createdBy?.id || ''
              }
            };
          });

          // Apply client-side filtering for vehicle type, operator, and status
          let filteredData = mappedData;

          // Vehicle Type Filter
          if (this.selectedType && this.selectedType !== this.sessionTypes[0]) {
            const vehicleTypeId = this.vehicleTypeMap[this.selectedType];
            filteredData = filteredData.filter((item: { vehicle: { vehicleTypeId: string } }) =>
              item.vehicle.vehicleTypeId === vehicleTypeId
            );
          }

          // Operator Filter
          if (this.selectedOperator && this.selectedOperator !== this.operatorList[0]) {
            const operatorId = this.operatorMap[this.selectedOperator];
            filteredData = filteredData.filter((item: { createdBy: { id: string } }) =>
              item.createdBy.id === operatorId
            );
          }

          // Status Filter
          if (this.selectedStatus && this.selectedStatus !== this.statusList[0]) {
            filteredData = filteredData.filter((item: { startDate: string, endDate: string }) => {
              const remainingDays = this.calculateRemainingDays(item.startDate, item.endDate);
              console.log('Pass:', item.startDate, item.endDate, 'Remaining days:', remainingDays);

              if (this.selectedStatus === 'active') {
                return remainingDays > 0;
              } else if (this.selectedStatus === 'expired') {
                return remainingDays <= 0;
              }
              return true;
            });
          }

          // Date Range Filter
          if (this.selectedRange && this.selectedRange.startDate && this.selectedRange.endDate) {
            filteredData = filteredData.filter((item: { startDate: string, endDate: string }) => {
              const startDate = new Date(item.startDate);
              const endDate = new Date(item.endDate);
              const filterStartDate = new Date(this.selectedRange!.startDate!);
              const filterEndDate = new Date(this.selectedRange!.endDate!);

              // Set all dates to midnight for accurate comparison
              startDate.setHours(0, 0, 0, 0);
              endDate.setHours(0, 0, 0, 0);
              filterStartDate.setHours(0, 0, 0, 0);
              filterEndDate.setHours(0, 0, 0, 0);

              // Check if the pass's date range overlaps with the filter date range
              return (startDate >= filterStartDate && startDate <= filterEndDate) ||
                (endDate >= filterStartDate && endDate <= filterEndDate) ||
                (startDate <= filterStartDate && endDate >= filterEndDate);
            });
          }

          // Update the data with filtered results
          this.paginatedPasses = filteredData;
          this.totalPasses = response.count || 0;
          this.totalPages = Math.ceil(this.totalPasses / this.rowsPerPage);
          this.updateTags();

          // Force change detection
          this.cdr.detectChanges();
        } else {
          console.warn('Invalid response format:', response);
          this.paginatedPasses = [];
          this.totalPasses = 0;
          this.totalPages = 1;
          this.updateTags();
        }
      },
      error: (error) => {
        console.error('Error fetching passes:', error);
        this.paginatedPasses = [];
        this.totalPasses = 0;
        this.totalPages = 1;
        this.updateTags();
      },
      complete: () => {
        this.isSkeletonVisible = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateTags() {
    const isFiltered = this.selectedType !== this.sessionTypes[0] ||
      this.selectedOperator !== this.operatorList[0] ||
      this.selectedStatus !== this.statusList[0] ||
      (this.selectedRange && this.selectedRange.startDate && this.selectedRange.endDate);

    const displayCount = isFiltered ? this.paginatedPasses.length : this.totalPasses;

    this.topTag = [
      { label: `${displayCount} items`, url: '/' },
      { label: 'Sorted by START DATE', url: '/' },
    ];
    this.bottomTag = [
      { label: `Total: ${displayCount} items`, url: '/' },
    ];
  }

  // Vehicle type mapping
  private vehicleTypeMap: { [key: string]: string } = {
    'Bike': 'e7e2ffc1-faec-48b5-b8b1-735f28c1d3ab',
    'Car': '3d3f97d3-4cf0-45a6-9bbd-15ab5a6df8d6',
    'Cycle': '6a2aa2ad-cba2-49dc-b82f-531e8b158bf9',
    'Truck': 'truck-id-here'
  };

  // Temporary filter values
  tempSelectedType: string = '';
  tempSelectedOperator: string = '';
  tempSelectedStatus: string = '';
  tempSelectedRange: { startDate: Date | null; endDate: Date | null } = {
    startDate: null,
    endDate: null
  };

  onTypeSelectionChange(value: string): void {
    this.tempSelectedType = value;
  }

  onOperatorSelectionChange(value: string): void {
    this.tempSelectedOperator = value;
  }

  onStatusSelectionChange(value: string): void {
    this.tempSelectedStatus = value;
  }

  onDateRangeSelected(range: { startDate: Date | null; endDate: Date | null }): void {
    this.tempSelectedRange = range;
  }

  applyFilter(): void {
    this.selectedType = this.tempSelectedType;
    this.selectedOperator = this.tempSelectedOperator;
    this.selectedStatus = this.tempSelectedStatus;
    this.selectedRange = this.tempSelectedRange;
    this.currentPage = 1;
    this.fetchPassesData();
  }

  clearFilters(): void {
    this.selectedType = this.sessionTypes[0];
    this.selectedOperator = this.operatorList[0];
    this.selectedStatus = this.statusList[0];
    this.selectedRange = {
      startDate: null,
      endDate: null
    };
    this.tempSelectedType = this.sessionTypes[0];
    this.tempSelectedOperator = this.operatorList[0];
    this.tempSelectedStatus = this.statusList[0];
    this.tempSelectedRange = {
      startDate: null,
      endDate: null
    };
    this.resetCalendarTrigger = !this.resetCalendarTrigger;
    this.currentPage = 1;
    this.fetchPassesData();
  }

  // loading data animations
  loadData(): void {
    this.simulateAsyncOperation().then(() => {
      this.isSkeletonVisible = false;
    });
  }

  simulateAsyncOperation(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 2000);
    });
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

  paginat() {
    try {
      this.totalSessions = Math.max(0, this.totalSessions || 0);
      this.totalPages = Math.max(1, Math.ceil(this.totalSessions / this.rowsPerPage));
      this.updateTags();
    } catch (error) {
      console.error('Error in paginat:', error);
      this.totalSessions = 0;
      this.totalPages = 1;
      this.updateTags();
    }
  }

  updatePagination(): void {
    try {
      this.isSkeletonVisible = true;

      // Ensure we have valid arrays
      if (!Array.isArray(this.sessions)) this.sessions = [];
      if (!Array.isArray(this.filteredSessions)) this.filteredSessions = [];
      if (!Array.isArray(this.paginatedSessions)) this.paginatedSessions = [];

      const startIndex = Math.max(0, (this.currentPage - 1) * this.rowsPerPage);
      const endIndex = Math.min(startIndex + this.rowsPerPage, this.totalSessions);

      // Use filteredSessions if it has items, otherwise use sessions
      const sourceArray = this.filteredSessions.length > 0 ? this.filteredSessions : this.sessions;

      // Ensure we don't exceed array bounds
      if (startIndex < sourceArray.length) {
        this.paginatedSessions = sourceArray.slice(startIndex, endIndex);
      } else {
        this.paginatedSessions = [];
      }

      this.totalPages = Math.max(1, Math.ceil(this.totalSessions / this.rowsPerPage));

    } catch (error) {
      console.error('Error in updatePagination:', error);
      this.paginatedSessions = [];
      this.totalPages = 1;
    } finally {
      setTimeout(() => {
        this.isSkeletonVisible = false;
      }, 500);
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchPassesData();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchPassesData();
    }
  }

  onEnterPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const page = Number(this.tempPage);
      if (page && page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchPassesData();
      } else {
        this.tempPage = this.currentPage;
      }
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchPassesData();
    }
  }

  @ViewChild('rangeCalendar') rangeCalendar: any;

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

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // data shorting
  sortSessions(column: string): void {
    if (this.sortColumn === column) {
      // Toggle sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Change column and reset direction
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Perform the sorting
    this.sessions = this.sessions.sort((a: any, b: any) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getSortIcon(column: string): SafeHtml {
    if (this.sortColumn !== column) return '';

    const ascendingIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
</svg>
`;

    const descendingIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
</svg>
`;

    const icon = this.sortDirection === 'asc' ? ascendingIcon : descendingIcon;
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  openTemplateOne(modalContentOne: any) {
    this.modal.openModal(modalContentOne);
  }

  // Add new properties for sharing
  shareModalRange: ShareDateRange | null = null;
  isShareDateRangeVisible: boolean = false;
  shareEmailAddress: string = '';
  @ViewChild('shareForm') shareForm!: NgForm;

  // Initialize form model
  shareFormModel = {
    dateOption: 'yesterday',
    subject: '',
    emails: ''
  };

  // Update the properties to use form model
  get selectedDateOption(): 'yesterday' | 'thisMonth' | 'custom' {
    return this.shareFormModel.dateOption as 'yesterday' | 'thisMonth' | 'custom';
  }
  set selectedDateOption(value: 'yesterday' | 'thisMonth' | 'custom') {
    this.shareFormModel.dateOption = value;
  }

  // Update the event type for share modal date range selection
  onShareDateRangeSelected(event: any) {
    this.shareModalRange = {
      startDate: event.startDate,
      endDate: event.endDate
    };
  }

  // Add method to toggle date range visibility
  toggleShareDateRange() {
    this.isShareDateRangeVisible = !this.isShareDateRangeVisible;
    if (!this.isShareDateRangeVisible) {
      // Reset date range when hiding
      this.shareModalRange = null;
    }
  }

  // Add this helper function at class level
  private parseCustomDate(dateStr: string): string {
    try {
      if (!dateStr || dateStr === 'N/A') {
        return new Date().toISOString();
      }

      // Example format: "Wed 27 Mar 24 2:30PM"
      const parts = dateStr.match(/(\w+) (\d+) (\w+) (\d+) (\d+):(\d+)(AM|PM)/);
      if (!parts) {
        return new Date().toISOString();
      }

      const [_, _day, date, month, year, hours, minutes, ampm] = parts;

      const monthMap: { [key: string]: number } = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };

      let hour = parseInt(hours);
      if (ampm === 'PM' && hour !== 12) {
        hour += 12;
      } else if (ampm === 'AM' && hour === 12) {
        hour = 0;
      }

      const fullYear = 2000 + parseInt(year);
      const dateObj = new Date(
        fullYear,
        monthMap[month],
        parseInt(date),
        hour,
        parseInt(minutes)
      );

      return dateObj.toISOString();
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return new Date().toISOString();
    }
  }

  onModalShareClick() {
    if (!this.shareFormModel.subject) {
      alert('Please enter a subject');
      return;
    }

    if (!this.shareFormModel.emails) {
      alert('Please enter at least one email address');
      return;
    }

    let startDate: string = '';
    let endDate: string = '';
    const today = new Date();

    switch (this.shareFormModel.dateOption) {
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        startDate = yesterday.toISOString().split('T')[0];
        endDate = yesterday.toISOString().split('T')[0];
        break;

      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;

      case 'custom':
        if (this.shareModalRange?.startDate && this.shareModalRange?.endDate) {
          startDate = this.shareModalRange.startDate.toISOString().split('T')[0];
          endDate = this.shareModalRange.endDate.toISOString().split('T')[0];
        }
        break;
    }

    const emailList = this.shareFormModel.emails
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    const shareRequest = {
      subject: this.shareFormModel.subject.trim(),
      emails: emailList,
      fromDate: startDate,
      toDate: endDate,
      parkingId: this.parking_id,
      operators: {},
      sessions: this.paginatedPasses,
      attachments: ''
    };

    // Call API to share passes data
    this.userService.shareVehicleData(this.parking_id, shareRequest).subscribe({
      next: (response: any) => {
        this.showSuccessToast();
        this.modal.closeModal();
        this.shareFormModel.subject = '';
        this.shareFormModel.emails = '';
        this.shareModalRange = null;
        this.shareFormModel.dateOption = 'yesterday';
      },
      error: (error: any) => {
        console.error('Error sharing passes:', error);
        alert(`Error sharing passes: ${error.error?.message || 'Unknown error occurred'}`);
      }
    });
  }

  onDateOptionChange(option: string) {
    this.shareFormModel.dateOption = option;
    this.isShareDateRangeVisible = option === 'custom';
  }

  onRadioChange(value: string) {
    this.selectedOption = value;
    console.log('Selected option:', value);
  }

  onAttachmentSelectionChange(value: string): void {
    this.selectedAttachment = value;
    // Handle attachment type selection logic here
    console.log('Selected attachment type:', value);
  }

  // Add this method to calculate remaining days
  calculateRemainingDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    // Set all dates to midnight for accurate day calculation
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Calculate remaining days from today to end date
    const remainingDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Return remaining days, but not less than 0
    return Math.max(0, remainingDays);
  }

  // Add this method to get vehicle type from vehicleTypeId
  getVehicleType(vehicleTypeId: string): string {
    const vehicleTypeMap: { [key: string]: string } = {
      'e7e2ffc1-faec-48b5-b8b1-735f28c1d3ab': 'Bike',
      '3d3f97d3-4cf0-45a6-9bbd-15ab5a6df8d6': 'Car',
      '6a2aa2ad-cba2-49dc-b82f-531e8b158bf9': 'Cycle'
    };
    return vehicleTypeMap[vehicleTypeId] || 'Unknown';
  }

  // Add this method to get vehicle icon path
  getVehicleIcon(vehicleTypeId: string | undefined): string {
    if (!vehicleTypeId) return '../../../../assets/images/icons/cycle.svg';
    switch (vehicleTypeId) {
      case 'e7e2ffc1-faec-48b5-b8b1-735f28c1d3ab': return '../../../../assets/images/icons/bike.svg';
      case '3d3f97d3-4cf0-45a6-9bbd-15ab5a6df8d6': return '../../../../assets/images/icons/car.svg';
      default: return '../../../../assets/images/icons/cycle.svg';
    }
  }

  // Add this method to get vehicle background color
  getVehicleBgColor(vehicleTypeId: string | undefined): string {
    if (!vehicleTypeId) return '#f2defd';
    switch (vehicleTypeId) {
      case 'e7e2ffc1-faec-48b5-b8b1-735f28c1d3ab': return '#d9effa';
      case '3d3f97d3-4cf0-45a6-9bbd-15ab5a6df8d6': return '#c7dffb';
      default: return '#f2defd';
    }
  }

  onViewSubmit() {
    // Handle view modal submit
  }

  sharePassDetails() {
    if (!this.selectedPass) return;

    const subject = 'Your Parking Sistem Pass Details';
    const validFor = this.selectedPass.parking.name;
    const vehicleNumber = this.selectedPass.vehicle.regNumber;
    const passStatus = this.calculateRemainingDays(this.selectedPass.startDate, this.selectedPass.endDate) > 0 ? 'Active' : 'Expired';
    const passType = this.selectedPass.type;
    const createdOn = new Date(this.selectedPass.startDate).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: '2-digit' });
    const expiresOn = new Date(this.selectedPass.endDate).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: '2-digit' });
    const ownerName = this.selectedPass.vehicle.name || 'N/A';
    const mobileNo = this.selectedPass.vehicle.phone || 'N/A';
    const payment = `₹${this.selectedPass.amount}/- • ${this.selectedPass.paymentMode || 'N/A'}`;

    const body = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://sistem.app/assets/images/logo.svg" alt="Sistem Logo" style="max-width: 150px; height: auto;">
  </div>

  <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h2 style="color: #333; margin-bottom: 20px; text-align: center;">Parking Pass Details</h2>

    <div style="margin-bottom: 20px;">
      <h3 style="color: #666; margin-bottom: 10px;">Pass Information</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Valid for:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${validFor}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Vehicle number:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${vehicleNumber}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Pass Status:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${passStatus}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Pass type:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${passType}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Created on:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${createdOn}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Expires on:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${expiresOn}</strong></td>
        </tr>
      </table>
    </div>

    <div style="margin-bottom: 20px;">
      <h3 style="color: #666; margin-bottom: 10px;">Owner Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Name:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${ownerName}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Mobile No.:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${mobileNo}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Payment received:</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${payment}</strong></td>
        </tr>
      </table>
    </div>

    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin-top: 20px;">
      <p style="color: #666; margin: 0; font-size: 14px;">
        <strong>Note:</strong> This is a non-refundable pass. Only the owner of the vehicle can use this. No other category of vehicle will be permitted to park on behalf of the pass.
      </p>
    </div>
  </div>

  <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
    <p>This is an automated message from Sistem Parking Management System</p>
  </div>
</div>`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  }

  suspendSelectedPass() {
    if (!this.selectedPass) return;
    this.selectedPass.status = 'suspended';
    if (this.modalSuspend) this.modalSuspend.closeModal();
    this.showSuccessToast('Pass suspended successfully!');
  }

  onSidebarToggled(closed: boolean) {
    this.isSidebarClosed = closed;
  }
}
