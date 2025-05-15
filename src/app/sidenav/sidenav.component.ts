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
} from 'sistem';
import { TrimTextPipe } from '../trim-text.pipe';
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { FiltersComponent } from '../components/filters/filters.component';

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
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    IconComponent,
    CommonModule,
    BreadcrumbsComponent,
    ButtonsComponent,
    NotificationComponent,
    SearchComponent,
    DropdownComponent,
    DoubleCalendarComponent,
    FormsModule,
    VehicalComponent,
    CheckboxComponent,
    AvatarComponent,
    ModalComponent,
    RouterModule,
    SnackbarComponent,
    TrimTextPipe,
    TooltipDirective,
    TextFieldComponent,
    StagesComponent,
    RadioButtonComponent,
    ToastComponent,
    SidebarComponent,
    FiltersComponent
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
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
  @ViewChild(SearchComponent) searchInput!: SearchComponent;

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
  ) {}

  selectedRange: { startDate: Date | null; endDate: Date | null } | null = null;
  topTag: { label: string; url: string }[] = [];
  bottomTag: { label: string; url: string }[] = [];
  sessionTypes = ['type', 'Car', 'Bike', 'Cycle', 'Truck'];
  operatorList = ['operator'];
  operatorMap: { [key: string]: string } = {}; // Map to store operator name to ID mapping
  statusList = ['Status', 'in vehicle', 'out vehicle', 'booking'];
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
  searchQuery: string = '';

  // Attachment related properties
  attachmentList: string[] = ['All', 'Excel', 'PDF'];
  selectedAttachment: string = 'All';
  allVehicles: any[] = [];

  isSkeletonVisible: boolean = true;
  isToastInfo = false;
  toastMessage = '';
  toastType: 'info' | 'success' | 'warning' | 'error' = 'info';
  toastHeading = '';

  showSuccessToast() {
    this.isToastInfo = true;
    this.toastType = 'success';
    this.toastMessage = 'Operation completed successfully!';
    this.toastHeading = 'Success';
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
      // Only start data fetching after we have the parking_id
      this.initializeData();
      this.getVehicleData();
    });
  }

  private initializeData() {
    // set title
    this.title.setTitle('Sistem - Sessions');
    // Initialize arrays
    this.sessions = [];
    this.filteredSessions = [];
    this.paginatedSessions = [];
    this.totalSessions = 0;
    // Fetch data
    this.fetchVehicleData();
    this.getParkingUserDetails();
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

 

  onSearch(value: string): void {
    console.log('Search value:', value);
    this.searchQuery = value;
    this.currentPage = 1;
    this.fetchVehicleData();
  }
  
  searchData = [
    {
      name: '',
      role: '',
      company: '',
      category: '',
      image: '',
      description: '',
    },
  ];

  filterSearchResults(): void {
    const query = this.searchQuery.trim().toLowerCase();
  
    this.searchData = this.allVehicles.filter(item =>
      (item.name || '').toLowerCase().includes(query) ||
      (item.role || '').toLowerCase().includes(query) ||
      (item.company || '').toLowerCase().includes(query) ||
      (item.category || '').toLowerCase().includes(query)
    );
  }
  
  getVehicleImage(vehicleTypeId: string): string {
    if (!vehicleTypeId) return '../../../../assets/images/icons/cycle.svg';
    switch (vehicleTypeId) {
      case 'e7e2ffc1-faec-48b5-b8b1-735f28c1d3ab':
        return '../../../../assets/images/icons/bike.svg';
      case '3d3f97d3-4cf0-45a6-9bbd-15ab5a6df8d6':
        return '../../../../assets/images/icons/car.svg';
      default:
        return '../../../../assets/images/icons/cycle.svg';
    }
  }
  
  
  getVehicleData(): void {
    this.userService.vehicleList(this.parking_id, 1, 'createdAt:DESC', 25, 0, {}).subscribe((data) => {
      this.allVehicles = data.rows.map((item: any) => ({
        name: item.vehicle?.regNumber,
        role: item.inBy?.firstName || 'N/A',
        category: item.vehicle?.vehicleType || 'Uncategorized',
        image: this.getVehicleImage(item.vehicle?.vehicleTypeId)  
      }));
      this.filterSearchResults();
    });
  }
  
  


  onTypeSelectionChange(value: string): void {
    this.tempSelectedType = value; // Store in temporary variable
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
    this.fetchVehicleData();
  }



  clearFilters(): void {
    // Reset all filter selections to their default values
    this.selectedType = this.sessionTypes[0]; // 'type'
    this.selectedOperator = this.operatorList[0]; // 'operator'
    this.selectedStatus = this.statusList[0]; // 'Status'
    if (this.searchInput) {
      this.searchInput.clear();  
    }
    
    // Reset range and force calendar update
    this.selectedRange = {
      startDate: null,
      endDate: null
    };

    if (this.rangeCalendar) {
      this.rangeCalendar.clear();
    }
    this.resetCalendarTrigger = !this.resetCalendarTrigger;
    
    // Reset search query
    this.searchQuery = '';
    
    // Reset temporary filter values
    this.tempSelectedType = this.sessionTypes[0];
    this.tempSelectedOperator = this.operatorList[0];
    this.tempSelectedStatus = this.statusList[0];
    this.tempSelectedRange = {
      startDate: null,
      endDate: null
    };

    // Reset pagination
    // this.currentPage = 1;
    
    // Force immediate UI updates
    this.cdr.detectChanges();
    
    // Fetch fresh data
    this.fetchVehicleData();
  }
  fetchVehicleData() {
    if (!this.parking_id) {
      console.error('No parking ID available');
      return;
    }

    this.isSkeletonVisible = true;
    const parkingId = this.parking_id;
    const page = this.currentPage;
    const orderBy = 'createdAt:DESC';
    const limit = this.rowsPerPage;
    const offset = (this.currentPage - 1) * this.rowsPerPage;

    const filters: any = {};

    if (this.searchQuery && this.searchQuery.trim()) {
      console.log('Adding vehicle number search filter:', this.searchQuery);
      filters.vehicleNo = this.searchQuery.trim();
    }

    if (this.selectedType && this.selectedType !== this.sessionTypes[0]) {
      const vehicleTypeId = this.vehicleTypeMap[this.selectedType];
      if (vehicleTypeId) {
        filters.vehicleType = vehicleTypeId;
      }
    }

    if (this.selectedOperator && this.selectedOperator !== this.operatorList[0]) {
      const operatorId = this.operatorMap[this.selectedOperator];
      if (operatorId) {
        filters.inById = operatorId;
      }
    }

    if (this.selectedStatus && this.selectedStatus !== this.statusList[0]) {
      let statusValue = '';
      switch (this.selectedStatus.toLowerCase()) {
        case 'in vehicle':
          statusValue = 'inVehicle';
          break;
        case 'out vehicle':
          statusValue = 'outVehicle';
          break;
        case 'booking':
          statusValue = 'booking';
          break;
      }
      if (statusValue) {
        filters.status = statusValue;
      }
    }

    if (this.selectedRange?.startDate && this.selectedRange?.endDate) {
      const formatDateToString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      filters.from = formatDateToString(this.selectedRange.startDate);
      filters.to = formatDateToString(this.selectedRange.endDate);
    }

    this.userService.vehicleList(parkingId, page, orderBy, limit, offset, filters).subscribe({
      next: (response: ApiResponse) => {
        if (response && Array.isArray(response.rows)) {
          const mappedData = response.rows.map((item: VehicleResponse) => {
            const vehicle = item.vehicle || {};
            return {
              vehicleNo: vehicle.regNumber || '',
              booking: item.bookingTime ? 'yes' : 'no',
              pass: item.vehicleInPass || '-',
              timeIn: this.formatDate(item.inTime),
              remarks: item.remarks || '-',
              timeOut: this.formatDate(item.outTime),
              advance: item.advance || '0',
              totalTime: item.hours ? `${item.hours} hrs` : '0 mins',
              collection: item.total || '0',
              refund: item.refund || '0',
              total: item.total || '0',
              mode: item.paymentMode || '-',
              reference: item.refNumber || '',
              vehicleType: item.vehicleTypes || '',
              vehicleTypeId: item.vehicle?.vehicleTypeId || '',
              vehicleIcon: this.getVehicleIcon(item.vehicle?.vehicleTypeId),
              vehicleBgColor: this.getVehicleBgColor(item.vehicle?.vehicleTypeId),
              status: item.status || '-',
              operator: this.getOperatorName(item.inBy),
              helmet: this.getHelmetCount(item.helmets),
              helmetAmt: this.calculateHelmetAmount(item.helmets),
              totalAmt: this.calculateTotalAmount(item.helmets, item.total),
              vehicleAmt: item.vehicleAmt || 0,
              startDate: this.formatDate(item.createdAt),
              endDate: this.formatDate(item.updatedAt),
            };
          });

          // Apply client-side filtering for vehicle type
          let filteredData = mappedData;
          if (this.selectedType && this.selectedType !== this.sessionTypes[0]) {
            const vehicleTypeId = this.vehicleTypeMap[this.selectedType];
            filteredData = filteredData.filter(item =>
              item.vehicleTypeId === vehicleTypeId
            );
          }

          // Apply client-side vehicle number search
          if (this.searchQuery && this.searchQuery.trim()) {
            const searchTerm = this.searchQuery.trim().toLowerCase();
            filteredData = filteredData.filter(item => {
              const vehicleNo = item.vehicleNo || '';
              return vehicleNo.toLowerCase().includes(searchTerm);
            });
          }

          this.sessions = filteredData;
          this.totalSessions = response.count;
          this.paginatedSessions = filteredData;
          this.totalPages = Math.ceil(response.count / this.rowsPerPage);
          this.updateTags();

          this.cdr.detectChanges();
        } else {
          console.error('Invalid response format:', response);
          this.sessions = [];
          this.paginatedSessions = [];
          this.totalSessions = 0;
          this.totalPages = 1;
          this.updateTags();
        }
      },
      error: (error) => {
        console.error('Error fetching vehicle data:', error);
        this.sessions = [];
        this.paginatedSessions = [];
        this.totalSessions = 0;
        this.totalPages = 1;
        this.updateTags();
      },
      complete: () => {
        this.isSkeletonVisible = false;
        this.cdr.detectChanges();
      }
    });
  }


  private formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = days[date.getDay()];
    const dateNum = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${day} ${dateNum} ${month} ${year} ${formattedHours}:${minutes}${amPm}`;
  }

  private getVehicleIcon(vehicleTypeId: string | undefined): string {
    if (!vehicleTypeId) return '../../../../assets/images/icons/cycle.svg';
    switch (vehicleTypeId) {
      case 'e7e2ffc1-faec-48b5-b8b1-735f28c1d3ab': return '../../../../assets/images/icons/bike.svg';
      case '3d3f97d3-4cf0-45a6-9bbd-15ab5a6df8d6': return '../../../../assets/images/icons/car.svg';
      default: return '../../../../assets/images/icons/cycle.svg';
    }
  }

  private getVehicleBgColor(vehicleTypeId: string | undefined): string {
    if (!vehicleTypeId) return '#f2defd';
    switch (vehicleTypeId) {
      case 'e7e2ffc1-faec-48b5-b8b1-735f28c1d3ab': return '#d9effa';
      case '3d3f97d3-4cf0-45a6-9bbd-15ab5a6df8d6': return '#c7dffb';
      default: return '#f2defd';
    }
  }

  private getOperatorName(inBy: any): string {
    if (!inBy) return 'N/A';
    return `${inBy.firstName || ''} ${inBy.lastName || ''}`.trim() || 'N/A';
  }

  private getHelmetCount(helmets: any[] | undefined): string {
    if (!Array.isArray(helmets) || helmets.length === 0) return '-';
    return helmets.length.toString();
  }

  private calculateHelmetAmount(helmets: any[] | undefined): number {
    if (!Array.isArray(helmets)) return 0;
    return helmets.reduce((sum, helmet) => sum + (helmet.total || 0), 0);
  }

  private calculateTotalAmount(helmets: any[] | undefined, total: string | number | undefined): number {
    const helmetAmount = this.calculateHelmetAmount(helmets);
    const itemTotal = Number(total || 0);
    return helmetAmount + itemTotal;
  }

  getParkingUserDetails() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const userId = tokenPayload.sub;
    
    this.userService.parkingUserDetail(userId).subscribe(
      (response) => {
        // Reset the operator map
        this.operatorMap = {};
        
        // Add default operator
        this.operatorList = ['Operator'];
        
        // Map response data
        response.forEach((res: any) => {
          const operatorName = `${res.firstName} ${res.lastName}`;
          this.operatorList.push(operatorName);
          this.operatorMap[operatorName] = res.id;
        });
      },
      (error) => {
        console.error('Error fetching parking user details:', error);
      }
    );
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
      this.fetchVehicleData();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchVehicleData();
    }
  }

  onEnterPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const page = Number(this.tempPage);
      if (page && page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchVehicleData();
      } else {
        this.tempPage = this.currentPage;
      }
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchVehicleData();
    }
  }

  @ViewChild('rangeCalendar') rangeCalendar: any;
 
  getAppliedFilterCount(): number {
    let count = 0;
    
    // Vehicle type - only count if not default and not empty
    if (this.selectedType && this.selectedType !== this.sessionTypes[0] && this.selectedType !== 'type') {
      count++;
    }
  
    // Operator - only count if not default and not empty
    if (this.selectedOperator && this.selectedOperator !== this.operatorList[0] && this.selectedOperator !== 'operator') {
      count++;
    }
  
    // Status - only count if not default and not empty
    if (this.selectedStatus && this.selectedStatus !== this.statusList[0] && this.selectedStatus !== 'Status') {
      count++;
    }
  
    // Date range - only count if both dates are set
    if (this.selectedRange?.startDate && this.selectedRange?.endDate) {
      count++;
    }
  
    // Search - only count if there's actual search text
    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      count++;
    }
  
    return count;
}
  
  updateTags() {
    // console.log('Updating tags - curre/nt filters:', {
    //   type: this.selectedType,
    //   operator: this.selectedOperator,
    //   status: this.selectedStatus,
    //   range: this.selectedRange,
    //   search: this.searchQuery
    // });
  
    const itemCount = this.totalSessions || 0;
    const filterCount = this.getAppliedFilterCount();
    
    this.topTag = [
      { label: `${itemCount} items`, url: '#' },
      ...(filterCount > 0 ? [{ label: `${filterCount} Filter applied`, url: '#' }] : []),
      { label: 'Sorted by CREATED AT', url: '#' },
    ];
    this.bottomTag = [
      { label: `Total: ${itemCount} items`, url: '#' },
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

  @ViewChild(ModalComponent) modal!: ModalComponent;
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
  onShareDateRangeSelected(range: ShareDateRange) {
    this.shareModalRange = range;
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
    // Validate required fields
    if (!this.shareFormModel.subject) {
      alert('Please enter a subject');
      return;
    }

    if (!this.shareFormModel.emails) {
      alert('Please enter at least one email addresses');
      return;
    }

    let startDate: string = '';
    let endDate: string = '';
    const today = new Date();

    switch (this.selectedDateOption) {
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
        if (this.shareModalRange && this.shareModalRange.startDate && this.shareModalRange.endDate) {
          startDate = this.shareModalRange.startDate.toISOString().split('T')[0];
          endDate = this.shareModalRange.endDate.toISOString().split('T')[0];
          console.log('Start Date:', startDate);
          console.log('End Date:', endDate);
        }
        break;
    }

    // Format emails as array and remove any empty strings
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
      sessions: [], // Add empty sessions array as it's required by the type
      attachments: ''
    };

    // Call the API to generate and share Excel
    this.userService.shareVehicleData(this.parking_id, shareRequest).subscribe({
      next: (response: any) => {
        console.log('Success Response:', response);
        // Assuming the response contains the Excel file URL
        const excelUrl = response.url || response.fileUrl;
        if (excelUrl) {
          this.showSuccessToast();
          this.isToastInfo = true;
          this.toastType = 'success';
          this.toastMessage = 'Excel sheet has been shared successfully. Recipients will receive the download link.';
          this.toastHeading = 'Success';
          // alert('Excel sheet has been shared successfully. Recipients will receive the download link.');
        } else {
          this.showExcelToast();
          this.isToastInfo = true;
          this.toastType = 'success';
          this.toastMessage = 'Excel sheet shared successfully.';
          this.toastHeading = 'Success';
          // alert('Excel sheet has been generated and shared successfully.');
        }
        this.modal.closeModal();
        // Reset form
        this.shareFormModel.subject = '';
        this.shareFormModel.emails = '';
        this.shareModalRange = null;
        this.selectedDateOption = 'yesterday';
      },
      error: (error: any) => {
        console.error('Error Response:', error);
        console.error('Error Status:', error.status);
        console.error('Error Message:', error.message);
        if (error.error) {
          console.error('API Error Details:', error.error);
          const errorMessage = error.error.message || 'Unknown error occurred';
          alert(`Error sharing Excel sheet: ${errorMessage}`);
        }
      }
    });
  }
  onDateOptionChange(option: string) {
    this.shareFormModel.dateOption = option;
    if (option === 'custom') {
      this.isShareDateRangeVisible = true;
    } else {
      this.isShareDateRangeVisible = false;
    }
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

  onSidebarToggled(closed: boolean) {
    this.isSidebarClosed = closed;
  }
}
