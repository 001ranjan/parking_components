import { FormsModule } from '@angular/forms';
import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, ViewChild } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { SettingSidebarComponent } from '../../setting-sidebar/setting-sidebar.component';
import {
  AvatarComponent,
  ButtonsComponent,
  ModalComponent,
  VehicalComponent,
  NotificationComponent,
  DropdownComponent,
  TextFieldComponent
} from 'sistem';
import { CommonModule } from '@angular/common';
import { SideNavigationComponent } from "../../../../../projects/sistem/src/lib/side-navigation/side-navigation.component";

@Component({
  selector: 'app-facilities-rate',
  standalone: true,
  imports: [
    SidebarComponent,
    SettingSidebarComponent,
    AvatarComponent,
    ButtonsComponent,
    VehicalComponent,
    ModalComponent,
    NotificationComponent,
    DropdownComponent,
    TextFieldComponent,
    FormsModule,
    CommonModule,
    SideNavigationComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './facilities-rate.component.html',
  styleUrl: './facilities-rate.component.css'
})
export class FacilitiesRateComponent {
  isSidebarClosed = false;
  selectedPriceType = '';
  selectedStatus = '';
  remark = '';

  // Dot action tracking for car, cycle, and bike
  openDotActionIndex = {
    car: null as number | null,
    cycle: null as number | null,
    bike: null as number | null,
  };

  priceType = ['All Days'];
  status = ['Active', 'Inactive'];

  rateList = [
    {
      from: '',
      to: '',
      hourlyRate: '',
      tax: 18,
      total: ''
    }
  ];

  carRateLists = [
    {
      description: 'Upto 3 hours',
      pricingType: 'All Type',
      amount: 20,
      beginDate: 'Fri 27 Jan 23',
      endDate: 'End Date',
      status: 'Active'
    },
  ];

  cycleRateLists = [...this.carRateLists];
  bikeRateLists = [...this.carRateLists];

  // Add more rate list rows
  addMoreList() {
    this.rateList.push({
      from: '',
      to: '',
      hourlyRate: '',
      tax: 18,
      total: ''
    });
  }

  removeRate(index: number) {
    this.rateList.splice(index, 1);
  }

  onSidebarToggled(closed: boolean) {
    this.isSidebarClosed = closed;
  }

  updateTotal(index: number) {
    const item = this.rateList[index];
    const rate = parseFloat(item.hourlyRate) || 0;
    const tax = parseFloat(item.tax as any) || 0;
    item.total = (rate + (rate * tax / 100)).toFixed(2);
  }

  updateCarRate() {
    console.log('Selected Price Type:', this.selectedPriceType);
    console.log('Selected Status:', this.selectedStatus);
    console.log('Remark:', this.remark);
    console.log('Rate List:', this.rateList);
  }

  toggleDotAction(event: Event, i: number, type: 'car' | 'cycle' | 'bike') {
    event.stopPropagation();
    this.openDotActionIndex[type] = this.openDotActionIndex[type] === i ? null : i;
  }

  isDotActionOpen(i: number, type: 'car' | 'cycle' | 'bike') {
    return this.openDotActionIndex[type] === i;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(): void {
    this.openDotActionIndex = {
      car: null,
      cycle: null,
      bike: null,
    };
  }
  selectedPass: any = null;
  @ViewChild('modalSuspend') modalSuspend!: any;
  @ViewChild('modalDelete') modalDelete!: any;

  suspendSelectedPass() {
    if (!this.selectedPass) return;
    this.selectedPass.status = 'suspended';
    if (this.modalSuspend) this.modalSuspend.closeModal();
    // this.showSuccessToast('Pass suspended successfully!');
  }

  deleteSelectedRate() {
    if (!this.selectedPass) return;
    this.selectedPass.status = 'delete';
    if (this.modalSuspend) this.modalDelete.closeModal();
    // this.showSuccessToast('Pass suspended successfully!');
  }

}
