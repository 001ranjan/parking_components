import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  AvatarComponent,
  ButtonsComponent,
  ModalComponent,
  VehicalComponent,
  NotificationComponent,
  DropdownComponent,
  TextFieldComponent
} from 'sistem';

import { SidebarComponent } from '../../sidebar/sidebar.component';
import { SettingSidebarComponent } from '../../setting-sidebar/setting-sidebar.component';
import { SideNavigationComponent } from "../../../../../projects/sistem/src/lib/side-navigation/side-navigation.component";
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-team',
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
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }
  @ViewChild('modalShareBike', { static: true }) modalShareBike!: TemplateRef<any>;
  @ViewChild('modalDeleteTemplate', { read: TemplateRef }) modalDeleteTemplate!: TemplateRef<any>;
  editingUserId: any | null = null;
  deleteUserId: any | null = null;
  selectedUser: any = null;
  isSidebarClosed = false;
  selectedPriceType = '';
  selectedStatus = '';
  remark = '';
  parking_id = '';
  teams: any[] = [];
  totalTeams: number = 0;
  selectedGender: string = 'All';
  selectRole: string = 'All';
  // editingUserId: string | null = null;
  selectedPass: any = null;

  openDotActionIndex = {
    car: null as number | null,
    cycle: null as number | null,
    bike: null as number | null,
  };
  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('modalSuspend') modalSuspend!: ModalComponent;
  @ViewChild('modalDelete') modalDelete!: ModalComponent;

  roleList = ['Role', 'manager', 'operator'];
  gender = ['Gender', 'Male', 'Female'];

  rateList = [
    {
      from: '',
      to: '',
      hourlyRate: '',
      tax: 18,
      total: ''
    }
  ];
  // for new team register
  newTeamMember = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    company: 'Sistem Apps',
    parkingId: 'f5b0fc9f-ddde-4c3a-a25f-9ef679660db7',
    userType: ''
  };




  onGenderChange(value: any): void {
    this.selectedGender = value;
    this.newTeamMember.gender = value.toLowerCase;
    console.log('Selected gender:', value);
  }

  onRoleChange(selected: string) {
    this.newTeamMember.userType = selected.toLowerCase();
    console.log(selected)
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.parking_id = params['id'] || '';
      this.fetchTeam();
    });
  }

  fetchTeam() {
    this.userService.getTeamList(this.parking_id).subscribe({
      next: (data: any) => {
        this.teams = data;
        this.totalTeams = data.length;
      },
      error: (err) => {
        console.error('Error fetching teams:', err);
      }
    });
  }

  // edit user modal
  // editUser(userId: string) {
  //   const user = this.teams.find(member => member.id === userId);
  //   if (!user) return;

  //   this.editingUserId = userId;
  //   this.newTeamMember = {
  //     firstName: user.firstName || '',
  //     lastName: user.lastName || '',
  //     email: user.email || '',
  //     phone: user.phone || '',
  //     gender: user.gender || 'Gender',
  //     userType: this.newTeamMember.userType = user.type || 'Role',
  //     password: '',
  //     company: 'Sistem Apps',
  //     parkingId: 'f5b0fc9f-ddde-4c3a-a25f-9ef679660db7'
  //   };
  //   console.log('New Team Member:', this.newTeamMember);
  //   this.modal.openModal(this.modalShareBike);
  // }

  editUser(userId: string) {
    const user = this.teams.find(member => member.id === userId);
    if (!user) return;

    this.editingUserId = userId;
    this.newTeamMember = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      gender: user.gender || 'Gender',
      userType: user.type && this.roleList.includes(user.type) ? user.type : 'Role',
      password: '',
      company: 'Sistem Apps',
      parkingId: 'f5b0fc9f-ddde-4c3a-a25f-9ef679660db7'
    };

    // console.log('New Team Member:', this.newTeamMember);
    this.modal.openModal(this.modalShareBike);
  }

  openDeleteModal(user: any): void {
    this.selectedUser = user;
    this.modalDelete.openModal(this.modalDeleteTemplate);
  }

  deleteSelectedUser(userId: string | undefined): void {
    if (!userId) {
      console.error('User ID is missing. Cannot delete.');
      return;
    }

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.teams = this.teams.filter(member => member.id !== userId);
        this.modalDelete.closeModal();
        this.selectedUser = null;
        this.fetchTeam();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      }
    });
  }


  closeModal() {
    this.modal.openModal(this.modalShareBike);
  }

  resetForm() {
    this.editingUserId = null;
    this.newTeamMember = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '',
      userType: '',
      password: '',
      company: '',
      parkingId: ''
    };
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
    const tax = parseFloat(item.tax as any) || 0;
    item.total = (rate + (rate * tax / 100)).toFixed(2);
  }

  // user register
  addTeamMember() {
    console.log("registerTeamMember", this.newTeamMember); // log payload

    this.userService.registerTeamMember(this.newTeamMember).subscribe({
      next: (res: any) => {
        this.modalDelete.closeModal();
        this.fetchTeam();
      },
      error: (err) => {
        console.error('Error registering user:', err);
      }
    });
  }

  // edit
  updateTeamMember() {
    console.log("updateTeamMember")
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
