import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { icons } from '../icons'; 

@Component({
  selector: 'ui-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class IconComponent {
  constructor(private sanitizer: DomSanitizer) {}
  @Input() icon?: string;

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
