import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'ui-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {
  @Output() filtersApplied = new EventEmitter<any>();
  @Output() pageChanged = new EventEmitter<number>();

  // Filter properties
  sessionTypes: any[] = [];
  operatorList: any[] = [];
  statusList: any[] = [];
  
  // Temporary filter values
  tempSelectedType: any = null;
  tempSelectedOperator: any = null;
  tempSelectedStatus: any = null;
  tempSelectedRange: { startDate: Date | null, endDate: Date | null } = {
    startDate: null,
    endDate: null
  };
  resetCalendarTrigger = false;

  // Pagination properties
  currentPage = 1;
  totalPages = 1;
  tempPage = 1;

  constructor() {
    // Initialize your lists here or fetch from a service
    this.initializeLists();
  }

  private initializeLists() {
    // Initialize your lists with data
    this.sessionTypes = [
      { id: 1, name: 'Type 1' },
      { id: 2, name: 'Type 2' }
    ];
    this.operatorList = [
      { id: 1, name: 'Operator 1' },
      { id: 2, name: 'Operator 2' }
    ];
    this.statusList = [
      { id: 1, name: 'Active' },
      { id: 2, name: 'Inactive' }
    ];
  }

  // Filter change handlers
  onTypeSelectionChange(event: any) {
    this.tempSelectedType = event;
  }

  onOperatorSelectionChange(event: any) {
    this.tempSelectedOperator = event;
  }

  onStatusSelectionChange(event: any) {
    this.tempSelectedStatus = event;
  }

  onDateRangeSelected(event: any) {
    this.tempSelectedRange = event;
  }

  // Apply filters
  applyFilter() {
    const filters = {
      type: this.tempSelectedType,
      operator: this.tempSelectedOperator,
      status: this.tempSelectedStatus,
      dateRange: this.tempSelectedRange
    };
    this.filtersApplied.emit(filters);
  }

  // Clear filters
  clearFilters() {
    this.tempSelectedType = null;
    this.tempSelectedOperator = null;
    this.tempSelectedStatus = null;
    this.tempSelectedRange = { startDate: null, endDate: null };
    this.resetCalendarTrigger = true;
    setTimeout(() => {
      this.resetCalendarTrigger = false;
    }, 0);
    this.applyFilter();
  }

  // Pagination methods
  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.tempPage = this.currentPage;
      this.pageChanged.emit(this.currentPage);
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.tempPage = this.currentPage;
      this.pageChanged.emit(this.currentPage);
    }
  }

  onEnterPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const page = parseInt(this.tempPage.toString());
      if (!isNaN(page) && page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.pageChanged.emit(this.currentPage);
      } else {
        this.tempPage = this.currentPage;
      }
    }
  }
}
