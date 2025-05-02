import {
  Component,
  TemplateRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsComponent } from '../buttons/buttons.component';
import { NotificationComponent } from '../notification/notification.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { RadioButtonComponent } from '../radio-button/radio-button.component';
import { TextFieldComponent } from '../text-field/text-field.component';

import { icons } from '../icons';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonsComponent,
    NotificationComponent,
    DropdownComponent,
    RadioButtonComponent,
    TextFieldComponent
  ],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() variant: 'primary' | 'secondary' | 'outlined' | 'text' = 'primary';
  @Input() size: 'xsmall' | 'small' | 'medium' | 'large' = 'large';
  @Input() shape: 'round' | 'corner' | 'ovel' = 'ovel';
  @Input() iconLeft?: string;
  @Input() iconRight?: string;
  @Input() label?: string;
  @Input() labelFor?: string;
  @Input() loader: string = '../assets/images/icons/Loader.svg';
  @Input() disabled = false;
  @Input() title: string = 'Modal Heading';
  @Input() cancelText: string = 'Cancel';
  @Input() submitText: string = 'Submit';
  @Input() footerText?: string = 'Footer Text';

  @ViewChild('modalContent') modalContent!: TemplateRef<any>;
  @Input() modalBody!: TemplateRef<any>;
  isLoading: boolean = false;
  isOpen: boolean = false;

  @Output() submit = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  constructor(private sanitizer: DomSanitizer) {}

  // Open modal and set body template
  openModal(bodyTemplate: TemplateRef<any>) {
    this.isOpen = true;
    this.modalBody = bodyTemplate;
  }

  // Close modal
  closeModal(): void {
    this.isOpen = false;
    this.close.emit();
  }

  onCancel(): void {
    this.closeModal();
  }

  onSubmit(): void {
    this.submit.emit();
    this.closeModal();
  }

  // Check if the icon is an SVG path or name
  isSvgPath(icon: string): boolean {
    return icon.endsWith('.svg') || icon.startsWith('http');
  }

  // Get sanitized SVG for inline icons
  getIconSvg(iconName: string): SafeHtml {
    const iconSvg = icons[iconName] || '';
    return this.sanitizer.bypassSecurityTrustHtml(iconSvg);
  }
}
