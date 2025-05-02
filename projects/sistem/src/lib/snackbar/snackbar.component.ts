import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { ButtonsComponent } from '../buttons/buttons.component';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'ui-snackbar',
  standalone: true,
  imports: [CommonModule, ButtonsComponent, AvatarComponent],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css',
})
export class SnackbarComponent {
  @Input() msg?: string = 'Snackbar';
  @Input() text?: string = 'Snackbar Response';
  @Input() action?: string = 'Undo';
  @Input() icon?: string = '../../assets/images/icons/snack.svg';
  showIcon = true;
  @Input() time: string | number = 5000;
  @Input() position:
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'top-left'
    | 'top-right'
    | 'top-center' = 'bottom-left';

  showSnackbar = true;

  ngOnInit() {
    this.hideSnackBar();
  }

  hideSnackBar(): void {
    const duration =
      typeof this.time === 'string' ? parseInt(this.time, 10) : this.time;
    setTimeout(() => {
      this.showSnackbar = false;
    }, duration || 5000);
  }

  // Allow manual closing of the snackbar
  closeSnackbar(): void {
    this.showSnackbar = false;
  }
}
