import { CommonModule } from '@angular/common';
import { Component, Input, HostBinding } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { icons } from '../icons'; // Adjust the import path to your icons library

interface MenuItem {
  route: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'ui-navigation',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule],
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.css']
})
export class SideNavigationComponent {
  constructor(private sanitizer: DomSanitizer) {}

  @HostBinding('class.collapsed') get collapsedClass() {
    return this.isCollapsed;
  }

  isCollapsed: boolean = false;
  @Input() variant: 'primary' | 'secondary' = 'secondary';
  @Input() menuItems: MenuItem[] = [];
  @Input() collapsIcon: string = 'assets/images/icons/menu.svg';

  // Toggle collapse state
  collapsed() {
    this.isCollapsed = !this.isCollapsed;
  }

  // Handle image load errors
  onImageError() {
    console.error('Error loading collapsIcon:', this.collapsIcon);
    this.collapsIcon = 'assets/images/icons/default-icon.svg';  // Fallback icon
  }

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
