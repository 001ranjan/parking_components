import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  @Input() toast: 'info' | 'success' | 'warning' | 'error' = 'info';
  @Input() message: string = 'Information message';
  @Input() heading: string = 'Info';
  @Input() duration: number = 3000;
  @Input() position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'bottom-right';

  isClose: boolean = false;
  private _isShown: boolean = false;

  @Input() 
  set isShown(value: boolean) {
    if (value) {
      this.showToast();
    }
    this._isShown = value;
  }
  get isShown(): boolean {
    return this._isShown;
  }

  get iconPath(): string {
    switch (this.toast) {
      case 'info':  return '../assets/images/icons/info.svg';
      case 'success': return '../assets/images/icons/success.svg';
      case 'warning': return '../assets/images/icons/warning.svg';
      case 'error': return '../assets/images/icons/error.svg';
      default: return '';
    }
  }

  get closeIconPath(): string {
    switch (this.toast) {
      case 'info': return '../../../assets/images/icons/infi-cross.svg';
      case 'success': return '../../../assets/images/icons/success-cross.svg';
      case 'warning': return '../../../assets/images/icons/warning-cross.svg';
      case 'error': return '../../../assets/images/icons/error-cross.svg';
      default: return '';
    }
  }

  showToast() {
    this.isClose = false;
    setTimeout(() => {
      this.closeToast();
    }, this.duration);
  }

  closeToast() {
    this.isClose = true;
    this._isShown = false;
  }
}
