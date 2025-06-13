import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { icons } from '../icons';

@Component({
  selector: 'ui-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent {
  constructor(private sanitizer: DomSanitizer) {}

  @Input() size: 'xxl' | 'xl' | 'md' | 'sm' | 'xsm' = 'xxl';
  @Input() shape: 'default' | 'round' = 'default';
  @Input() avatarIcon?: string;
  @Input() label?: string;
  defaultIcon: string = '../assets/images/icons/avaatar-default.png';

  // Determines if avatarIcon is an SVG or a URL to an image
  isSvgIcon(): boolean {
    return (
      !!this.avatarIcon &&
      !this.avatarIcon.endsWith('.svg') &&
      !this.avatarIcon.startsWith('http')
    );
  }

  // Retrieve SVG icon from icons library
  getIconSvg(iconName: string | undefined): SafeHtml {
    const iconSvg = iconName ? icons[iconName] || '' : '';
    return this.sanitizer.bypassSecurityTrustHtml(iconSvg);
  }
}
