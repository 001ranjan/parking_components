import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { icons } from '../icons'; // Adjust the import path to the icons library

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css'],
})
export class ButtonsComponent {
  @Input() variant:
    | 'primary'
    | 'secondary'
    | 'outlined'
    | 'text'
    | 'split'
    | 'splitBorder' = 'primary';
  @Input() size: 'xsmall' | 'small' | 'medium' | 'large' = 'large';
  @Input() shape: 'round' | 'corner' | 'ovel' = 'ovel';
  @Input() iconLeft?: string;
  @Input() iconRight?: string;
  @Input() label?: string;
  @Input() loader: string = '../../assets/images/icons/Loader.svg';
  @Input() disabled = false;
  @Input() time: any = '1000';

  isLoading: boolean = false;

  constructor(private sanitizer: DomSanitizer) {}

  onSubmit() {
    if (this.isLoading || this.disabled) return;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, this.time);
  }

  // Check if icon path is an SVG file or icon name
  isSvgPath(icon: string): boolean {
    return icon.endsWith('.svg') || icon.startsWith('http');
  }

  // Retrieve icon SVG from icons library if not a path
  getIconSvg(iconName: string): SafeHtml {
    const iconSvg = icons[iconName] || '';
    return this.sanitizer.bypassSecurityTrustHtml(iconSvg);
  }
}
