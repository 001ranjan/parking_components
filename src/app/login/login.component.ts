import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ButtonsComponent,
  TextFieldComponent,
  IconComponent,
  ToastComponent
} from 'sistem';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ButtonsComponent,
    TextFieldComponent,
    IconComponent,
    ToastComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginData = { loginId: '', password: '' };
  showToast = false;
  toastMessage = '';
  toastType: 'info' | 'success' | 'warning' | 'error' = 'error';

  constructor(private userService: UserService, private router: Router) { }

  userLogin() {
    if (!this.loginData.loginId || !this.loginData.password) {
      this.showToast = true;
      this.toastMessage = 'Please enter both email and password';
      this.toastType = 'error';
      return;
    }

    this.userService.loginUser(this.loginData).subscribe(
      (response: any) => {
        console.log("login response", response)
        localStorage.setItem('token', response.token);
        let parkings: any = null;
        if (response.user) {
          const userData = {
            id: response.user.id,
            company: response.user.company,
            createDate: response.user.createdAt,
            deletedAt: response.user.deletedAt,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            email: response.user.email,
            phone: response.user.phone,
            gender: response.user.gender,
            role: response.user.role,
            permissions: response.user.permissions,
            type: response.user.type,
          };

          // Access the first parking object from the array
          if (response.user.parkings && response.user.parkings.length > 0) {
            const parking = response.user.parkings[0];

            parkings = {
              id: parking.id,
              parkingName: parking.name,
              state: parking.state,
              address: parking.address,
              alwaysOpen: parking.alwaysOpen,
              city: parking.city,
              country: parking.country,
              createdAt: parking.createdAt,
              description: parking.description,
              lat: parking.point.coordinates[0],
              lng: parking.point.coordinates[1]
            };
          }

          localStorage.setItem('userData', JSON.stringify(userData));
          if (parkings) {
            localStorage.setItem('parkings', JSON.stringify(parkings));
          }

          // Navigate based on role
          switch (response.user.type) {
            case 'admin':
              this.router.navigate(['/admin/dashboard']);
              break;
            case 'user':
              this.router.navigate(['/user/home']);
              break;
            case 'manager':
              this.router.navigate(['/manager/overview']);
              break;
            default:
              this.router.navigate(['/parking/f5b0fc9f-ddde-4c3a-a25f-9ef679660db7']);
          }
        }
      },
      (error) => {
        console.error('Login failed:', error.error || error.message);
        this.showToast = true;
        this.toastMessage = error.error?.message || 'Login failed! Please check your credentials.';
        this.toastType = 'error';
      }
    );


    // this.userService.loginUser(this.loginData).subscribe(
    //   (response: any) => {
    //     // console.log('Login successful:', response);
    //     localStorage.setItem('token', response.token);
    //     if (response.user) {
    //       const userData = {
    //         id: response.user.id,
    //         company: response.user.company,
    //         createDate: response.user.createdAt,
    //         deletedAt: response.user.deletedAt,
    //         firstName: response.user.firstName,
    //         lastName: response.user.lastName,
    //         email: response.user.email,
    //         phone: response.user.phone,
    //         gender: response.user.gender,
    //         role: response.user.role,
    //         permissions: response.user.permissions,
    //         type: response.user.type,
    //       };
    //       if (response.user) {
    //         const parkings = {
    //           parkingName: response.user.parkings.name,
    //           state: response.user.parkings.state,
    //           address: response.user.parkings.parkings,
    //           alwaysOpen: response.user.parkings.alwaysOpen,
    //           city: response.user.parkings.city,
    //           country: response.user.parkings.country,
    //           createdAt: response.user.parkings.createdAt,
    //           description: response.user.parkings.description,
    //         }
    //       }
    //       localStorage.setItem('userData', JSON.stringify(userData));
    //       localStorage.setItem('parkings', JSON.stringify(parkings));
    //       // on the base of user role define page
    //       switch (response.user.type) {
    //         case 'admin':
    //           this.router.navigate(['/admin/dashboard']);
    //           break;
    //         case 'user':
    //           this.router.navigate(['/user/home']);
    //           break;
    //         case 'manager':
    //           this.router.navigate(['/manager/overview']);
    //           break;
    //         default:
    //           this.router.navigate(['/parking/f5b0fc9f-ddde-4c3a-a25f-9ef679660db7']);
    //       }

    //     }
    //     this.router.navigate(['/parking/f5b0fc9f-ddde-4c3a-a25f-9ef679660db7']);
    //   },
    //   (error) => {
    //     console.error('Login failed:', error.error || error.message);
    //     this.showToast = true;
    //     this.toastMessage = error.error?.message || 'Login failed! Please check your credentials.';
    //     this.toastType = 'error';
    //   }
    // );
  }
}
