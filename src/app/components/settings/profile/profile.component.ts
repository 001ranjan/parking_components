import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { SettingSidebarComponent } from '../../setting-sidebar/setting-sidebar.component';
import { AvatarComponent, ButtonsComponent } from 'sistem';



@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SidebarComponent, SettingSidebarComponent, AvatarComponent, ButtonsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  isSidebarClosed = false;
  parkingName: string = '';
  vendorName: string = '';
  vendorEmail: string = '';
  vendorPhone: string = '';
  vendorCreatedDate: string = '';
  aboutParking: string = '';
  parkingAddress: string = '';
  parkingLocation: string = '';
  parkingOperation: string = '';



  onSidebarToggled(closed: boolean) {
    this.isSidebarClosed = closed;
  }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    const profileData = localStorage.getItem('parkings');
    const getUserData = localStorage.getItem('userData');

    let user = null;
    let parking = null;

    if (getUserData) {
      try {
        user = JSON.parse(getUserData);
        // console.log('User Data:', user);
        this.vendorName = `${user.firstName} ${user.lastName}`;
        this.vendorCreatedDate = this.formatDate(user.createDate);
        this.vendorEmail = user.email;
        this.vendorPhone = user.phone;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      console.warn('No user data found in localStorage');
    }

    if (profileData) {
      try {
        console.log(profileData)
        parking = JSON.parse(profileData);
        this.parkingName = parking.parkingName;
        this.aboutParking = parking.description;
        this.parkingAddress = parking.address;
        this.parkingLocation = `${parking.lat} ${parking.lng}`;
        this.parkingOperation = parking.alwaysOpen ? 'Always Open' : 'close'

      } catch (error) {
        console.error('Error parsing parking profile:', error);
      }
    } else {
      console.warn('No parking profile found in localStorage');
    }

    return { user, parking };
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
}
