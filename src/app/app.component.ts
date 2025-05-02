import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ThemeService } from './theme.service';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'components';

  constructor(private router: Router) {}

  get isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }
}
