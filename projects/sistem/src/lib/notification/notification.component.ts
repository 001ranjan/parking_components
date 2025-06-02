import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { icons } from '../icons';

@Component({
  selector: 'ui-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent {
  constructor(private sanitizer: DomSanitizer) { }

  @Input() size: 'xxl' | 'xl' | 'md' | 'sm' | 'xsm' = 'xxl';
  @Input() variant: 'primary' | 'secondary' = 'secondary';
  @Input() shape: 'default' | 'circle' = 'default';
  @Input() icon?: string;
  @Input() alert?: any;
  @Input() bgColor?: any;
  @Input() sameIcon: 'invert' | 'notinvert' = 'notinvert';
  defaultIcon: string = '../assets/images/icons/info.svg';

  // Check if icon path is an SVG file or icon URL
  isSvgPath(icon: string): boolean {
    return icon?.endsWith('.svg') || icon?.startsWith('http');
  }

  // Retrieve SVG icon from icons library if not a path
  getIconSvg(iconName: string | undefined): SafeHtml {
    const iconSvg = iconName ? icons[iconName] || '' : '';
    return this.sanitizer.bypassSecurityTrustHtml(iconSvg);
  }
}
