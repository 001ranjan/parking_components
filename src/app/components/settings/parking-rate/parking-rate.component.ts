import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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

import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-parking-rate',
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
    RouterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './parking-rate.component.html',
  styleUrls: ['./parking-rate.component.css']
})
export class ParkingRateComponent implements OnInit {
  isSidebarClosed = false;
  selectedPriceType = '';
  selectedStatus = '';
  remark = '';

  parking_id = '';
  parkingRateData: any;
  selectedPass: any = null;

  priceType = ['All Days'];
  status = ['Active', 'Inactive'];

  vehicleTypeMap: any = {
    'Bike': 'e7e2ffc1-faec-48b5-b8b1-735f28c1d3ab',
    'Car': '3d3f97d3-4cf0-45a6-9bbd-15ab5a6df8d6',
    'Cycle': '6a2aa2ad-cba2-49dc-b82f-531e8b158bf9'
  };

  bikeRateLists: any[] = [];
  carRateLists: any[] = [];
  cycleRateLists: any[] = [];

  carItems: number = 0;
  bikeItems: number = 0;
  cycleItem: number = 0;

  rateList: any[] = [
    {
      from: '',
      to: '',
      hourlyRate: '',
      tax: 0,
      total: ''
    }
  ];

  openDotActionIndex = {
    car: null as number | null,
    cycle: null as number | null,
    bike: null as number | null,
  };

  @ViewChild('modalSuspend') modalSuspend!: any;
  @ViewChild('modalDelete') modalDelete!: any;
  @ViewChild('modalShareCar') modalShareCar!: any;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.parking_id = params['id'] || '';
      this.getParkingRate();
    });
  }

  getParkingRate() {
    if (!this.parking_id) return;

    this.userService.getParkingRate(this.parking_id).subscribe({
      next: (data: any) => {
        this.parkingRateData = data;

        if (data.prices && Array.isArray(data.prices)) {
          data.prices.forEach((price: any) => {
            const sortedHours = [...price.priceHours]
              .sort((a: { endHour: number }, b: { endHour: number }) => b.endHour - a.endHour)
              .reverse();

            const createRateItem = (hourData: any) => ({
              description: hourData.startHour === 0
                ? `Upto ${hourData.endHour} hours`
                : `${hourData.startHour} to ${hourData.endHour} hours`,
              pricingType: price.type,
              amount: hourData.rate,
              beginDate: new Date(price.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }),
              endDate: hourData.endDate || '',
              status: hourData.status ? 'Active' : 'Inactive',
              from: hourData.startHour,
              to: hourData.endHour,
              hourlyRate: hourData.rate,
              tax: 0,
              // total: (hourData.rate + (hourData.rate * 18) / 100).toFixed(2)
              total: (hourData.rate).toFixed(2)
            });

            const mappedRates = sortedHours.map(createRateItem);

            if (price.vehicleType.name === 'Car') {
              this.carRateLists = mappedRates;
            } else if (price.vehicleType.name === 'Bike') {
              this.bikeRateLists = mappedRates;
            } else if (price.vehicleType.name === 'Cycle') {
              this.cycleRateLists = mappedRates;
            }
          });

          this.carItems = this.carRateLists.length || 0;
          this.bikeItems = this.bikeRateLists.length || 0;
          this.cycleItem = this.cycleRateLists.length || 0;
        }
      },
      error: (err) => {
        console.error('Error fetching parking rate', err);
      }
    });
  }

  openCarRateModal(modalRef: any) {
    // Load existing car rates into modal rateList for editing
    this.rateList = this.carRateLists.length > 0
      ? this.carRateLists.map(item => ({ ...item }))
      : [{
        from: '',
        to: '',
        hourlyRate: '',
        tax: 0,
        total: ''
      }];
    modalRef.openModal(this.modalShareCar);
  }

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

  updateTotal(index: number) {
    const item = this.rateList[index];
    const rate = parseFloat(item.hourlyRate) || 0;
    const tax = parseFloat(item.tax) || 0;
    item.total = (rate + (rate * tax / 100)).toFixed(2);
  }

  updateCarRate() {
    // Save changes from modal to main list
    this.carRateLists = this.rateList.map(item => ({ ...item }));
    this.carItems = this.carRateLists.length;
    console.log('Updated Car Rate List:', this.carRateLists);
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

  suspendSelectedPass() {
    if (!this.selectedPass) return;
    this.selectedPass.status = 'suspended';
    if (this.modalSuspend) this.modalSuspend.closeModal();
  }

  deleteSelectedRate() {
    if (!this.selectedPass) return;
    this.selectedPass.status = 'delete';
    if (this.modalDelete) this.modalDelete.closeModal();
  }

  onSidebarToggled(closed: boolean) {
    this.isSidebarClosed = closed;
  }
}
