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

  constructor(private userService: UserService, private router: Router) {}

  userLogin() {
    if (!this.loginData.loginId || !this.loginData.password) {
      this.showToast = true;
      this.toastMessage = 'Please enter both email and password';
      this.toastType = 'error';
      return;
    }

    this.userService.loginUser(this.loginData).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        localStorage.setItem('token', response.token);
        if (response.user) {
          const userData = {
            id: response.user.id,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            email: response.user.email,
            role: response.user.role,
            permissions: response.user.permissions,
          };
          localStorage.setItem('userData', JSON.stringify(userData));
        }
        this.router.navigate(['/parking/f5b0fc9f-ddde-4c3a-a25f-9ef679660db7']);
      },
      (error) => {
        console.error('Login failed:', error.error || error.message);
        this.showToast = true;
        this.toastMessage = error.error?.message || 'Login failed! Please check your credentials.';
        this.toastType = 'error';
      }
    );
  }
}
