import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import {
  ButtonsComponent,
  TabComponent,
  IconComponent,
  TextFieldComponent,
  CalendarComponent,
  DoubleCalendarComponent,
  DropdownComponent,
  ToastComponent,
  AvatarComponent,
  TypographyComponent,
  SearchComponent,
  RadioButtonComponent,
  CheckboxComponent,
  ToggleComponent,
  NumberComponent,
  TagsComponent,
  BreadcrumbsComponent,
  SideNavigationComponent,
  TooltipDirective,
  StagesComponent,
  ModalComponent,
} from 'sistem';

@Component({
  selector: 'app-style-guid',
  standalone: true,
  imports: [
    CommonModule,
    TabComponent,
    ButtonsComponent,
    IconComponent,
    TextFieldComponent,
    DoubleCalendarComponent,
    DropdownComponent,
    ToastComponent,
    AvatarComponent,
    TypographyComponent,
    SearchComponent,
    RadioButtonComponent,
    CheckboxComponent,
    ToggleComponent,
    NumberComponent,
    TagsComponent,
    BreadcrumbsComponent,
    SideNavigationComponent,
    TooltipDirective,
    StagesComponent,
    ModalComponent,
  ],
  templateUrl: './style-guid.component.html',
  styleUrl: './style-guid.component.css',
})
export class StyleGuidComponent {
  constructor(private cdr: ChangeDetectorRef) {}

  statusList = ['Dropdown list', 'in vehicle', 'out vehicle', 'booking'];

  onStatusSelectionChange(category: string): void {
    console.log('Selected category:', category);
  }

  @ViewChild(ModalComponent) modal!: ModalComponent;
  openTemplateOne(modalContentOne: any) {
    this.modal.openModal(modalContentOne);
  }

  // toaster
  isToastInfo = false;
  isToastWarning = false;
  isToastError = false;
  isToastSuccess = false;

  showInfo() {
    this.isToastInfo = false;
    setTimeout(() => {
      this.isToastInfo = true;
    }, 10);
  }

  showError() {
    this.isToastError = false;

    setTimeout(() => {
      this.isToastError = true;
    }, 10);

    setTimeout(() => {
      this.isToastError = false;
    }, 5000);
  }

  showWarning() {
    this.isToastWarning = false;

    setTimeout(() => {
      this.isToastWarning = true;
    }, 10);

    setTimeout(() => {
      this.isToastWarning = false;
    }, 5000);
  }

  showSuccess() {
    this.isToastSuccess = false;

    setTimeout(() => {
      this.isToastSuccess = true;
    }, 10);

    setTimeout(() => {
      this.isToastSuccess = false;
    }, 5000);
  }

  contactData = [
    {
      name: 'Sudesh kumar',
      role: 'Contact',
      company: 'Aadinath Retails',
      category: 'Sales',
      image: 'assets/images/icons/Avatar.svg',
      description: 'Description',
    },
    {
      name: 'Anita Rao',
      role: 'Contact',
      company: 'Global Trade',
      category: 'eCommerce',
      image: 'assets/images/icons/Avatar.svg',
      description: 'Description',
    },
  ];

  breadcrumbs = [
    { label: 'Home', url: '/style-guid' },
    { label: 'About', url: '' },
  ];

  menuItems = [
    { route: '/style-guid', label: 'Session', icon: 'bell' },
    { route: '/radio-button', label: 'Radio btn', icon: 'home' },
    {
      route: '/style-guid',
      label: 'Checkbox',
      icon: 'chat-bubble-bottom-center',
    },
    { route: '/toggle', label: 'Toggle', icon: 'device-phone-mobile' },
    { route: '/text', label: 'Text', icon: 'information-circle' },
    { route: '/otp', label: 'OTP', icon: 'question-mark-circle' },
    {
      route: '/calendar',
      label: 'Calendar',
      icon: 'chat-bubble-oval-left-ellipsis',
    },
    { route: '/number', label: 'Number', icon: 'arrow-up-tray' },
    { route: '/search', label: 'Search', icon: 'magnifying-glass' },
    { route: '/sidebar', label: 'Sidebar', icon: 'shield-exclamation' },
  ];

  // Disable btn
  isDisabled = false;
  isDisabled_2 = false;
  isDisabled_3 = false;
  isDisabled_4 = false;
  isDisabledRound1 = false;
  isDisabledRound2 = false;
  isDisabledRound3 = false;
  isDisabledRound4 = false;
  isDisabledSquare2 = false;
  isDisabledSquare1 = false;
  isDisabledSquare3 = false;
  isDisabledSquare4 = false;
  isDisabledSec1 = false;
  isDisabledSec2 = false;
  isDisabledSec3 = false;
  isDisabledSec4 = false;
  isDisabledSec5 = false;
  isDisabledSec6 = false;
  isDisabledSec7 = false;
  isDisabledSec8 = false;
  isDisabledSec9 = false;
  isDisabledSec10 = false;
  isDisabledSec11 = false;
  isDisabledSec12 = false;
  isDisabledSec13 = false;
  isDisabledSec14 = false;
  isDisabledSec15 = false;
  isDisabledSec16 = false;
  isDisabledSec17 = false;
  isDisabledSec18 = false;
  isDisabledSec19 = false;
  isDisabledSec20 = false;
  isDisabledSec21 = false;
  isDisabledSec22 = false;
  isDisabledSec23 = false;
  isDisabledSec24 = false;
  isDisabledSec25 = false;
  isDisabledSec26 = false;

  disableCalled(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabled = isChecked;
    }
  }
  disableCalled_2(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabled_2 = isChecked;
    }
  }
  disableCalled_3(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabled_3 = isChecked;
    }
  }
  disableCalledRound1(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledRound1 = isChecked;
    }
  }
  // roundDown
  disableCalledRound2(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledRound2 = isChecked;
    }
  }
  disableCalledRound3(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledRound3 = isChecked;
    }
  }
  disableCalledRound4(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledRound4 = isChecked;
    }
  }
  disableCalled_4(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabled_4 = isChecked;
    }
  }
  // Square btn is disabled
  disableCalledSquare1(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSquare1 = isChecked;
    }
  }
  disableCalledSquare2(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSquare2 = isChecked;
    }
  }
  disableCalledSquare3(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSquare3 = isChecked;
    }
  }
  disableCalledSquare4(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSquare4 = isChecked;
    }
  }

  // secoundary
  disableCalledSec1(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec1 = isChecked;
    }
  }
  disableCalledSec2(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec2 = isChecked;
    }
  }
  disableCalledSec3(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec3 = isChecked;
    }
  }
  disableCalledSec4(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec4 = isChecked;
    }
  }
  disableCalledSec5(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec5 = isChecked;
    }
  }
  disableCalledSec6(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec6 = isChecked;
    }
  }
  disableCalledSec7(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec7 = isChecked;
    }
  }
  disableCalledSec8(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec8 = isChecked;
    }
  }
  disableCalledSec9(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec9 = isChecked;
    }
  }
  disableCalledSec10(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec10 = isChecked;
    }
  }
  disableCalledSec11(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec11 = isChecked;
    }
  }
  disableCalledSec12(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec12 = isChecked;
    }
  }
  disableCalledSec13(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec13 = isChecked;
    }
  }
  disableCalledSec14(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec14 = isChecked;
    }
  }
  disableCalledSec15(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec15 = isChecked;
    }
  }
  disableCalledSec16(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec16 = isChecked;
    }
  }
  disableCalledSec17(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec17 = isChecked;
    }
  }
  disableCalledSec18(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec18 = isChecked;
    }
  }
  disableCalledSec19(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec19 = isChecked;
    }
  }
  disableCalledSec20(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec20 = isChecked;
    }
  }
  disableCalledSec21(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec21 = isChecked;
    }
  }
  disableCalledSec22(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec22 = isChecked;
    }
  }
  disableCalledSec23(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec23 = isChecked;
    }
  }
  disableCalledSec24(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec24 = isChecked;
    }
  }
  disableCalledSec25(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec25 = isChecked;
    }
  }
  disableCalledSec26(isChecked: boolean) {
    if (typeof isChecked === 'boolean') {
      this.isDisabledSec26 = isChecked;
    }
  }
}
