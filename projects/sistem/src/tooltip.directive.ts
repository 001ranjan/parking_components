import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective {
  @Input('appTooltip') tooltipTitle: string | null = '';
  @Input() placement: string = 'bottom'; // Default to 'bottom'
  @Input() delay: number = 300;
  tooltip?: HTMLElement;
  offset = 5;

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.tooltip) {
      this.show();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.tooltip) {
      this.hide();
    }
  }

  show() {
    this.create();
    this.setPosition();
    this.tooltip?.classList.add('ui-tooltip-show');
  }

  hide() {
    this.tooltip?.classList.remove('ui-tooltip-show');
    this.tooltip?.remove();
    this.tooltip = undefined;
  }

  create() {
    this.tooltip = document.createElement('span');
    this.tooltip.classList.add('ui-tooltip', this.placement); // Add placement class
    this.tooltip.textContent = this.tooltipTitle;
    document.body.appendChild(this.tooltip);
  }

  setPosition() {
    const elemRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltip?.getBoundingClientRect();
    if (!tooltipRect) return;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate initial position
    let left = 0;
    let top = 0;

    switch (this.placement) {
      case 'top':
        left = elemRect.left + (elemRect.width - tooltipRect.width) / 2;
        top = elemRect.top - tooltipRect.height - this.offset;
        this.tooltip?.classList.add('top');
        
        // Flip to bottom if no space on top
        if (top < 0) {
          top = elemRect.bottom + this.offset;
          this.tooltip?.classList.remove('top');
          this.tooltip?.classList.add('bottom');
        }
        break;

      case 'bottom':
        left = elemRect.left + (elemRect.width - tooltipRect.width) / 2;
        top = elemRect.bottom + this.offset;
        this.tooltip?.classList.add('bottom');
        
        // Flip to top if no space at bottom
        if (top + tooltipRect.height > viewportHeight) {
          top = elemRect.top - tooltipRect.height - this.offset;
          this.tooltip?.classList.remove('bottom');
          this.tooltip?.classList.add('top');
        }
        break;

      case 'left':
        left = elemRect.left - tooltipRect.width - this.offset;
        top = elemRect.top + (elemRect.height - tooltipRect.height) / 2;
        this.tooltip?.classList.add('left');
        
        // Flip to right if no space on left
        if (left < 0) {
          left = elemRect.right + this.offset;
          this.tooltip?.classList.remove('left');
          this.tooltip?.classList.add('right');
        }
        break;

      case 'right':
        left = elemRect.right + this.offset;
        top = elemRect.top + (elemRect.height - tooltipRect.height) / 2;
        this.tooltip?.classList.add('right');
        
        // Flip to left if no space on right
        if (left + tooltipRect.width > viewportWidth) {
          left = elemRect.left - tooltipRect.width - this.offset;
          this.tooltip?.classList.remove('right');
          this.tooltip?.classList.add('left');
        }
        break;

      default:
        left = elemRect.left + (elemRect.width - tooltipRect.width) / 2;
        top = elemRect.bottom + this.offset;
        this.tooltip?.classList.add('bottom');
        
        // Flip to top if no space at bottom
        if (top + tooltipRect.height > viewportHeight) {
          top = elemRect.top - tooltipRect.height - this.offset;
          this.tooltip?.classList.remove('bottom');
          this.tooltip?.classList.add('top');
        }
        break;
    }

    // Ensure tooltip stays within viewport bounds
    const padding = 8; // Padding from viewport edges

    // Adjust horizontal position
    if (left < padding) {
      left = padding;
    } else if (left + tooltipRect.width > viewportWidth - padding) {
      left = viewportWidth - tooltipRect.width - padding;
    }

    // Adjust vertical position
    if (top < padding) {
      top = padding;
    } else if (top + tooltipRect.height > viewportHeight - padding) {
      top = viewportHeight - tooltipRect.height - padding;
    }

    if (this.tooltip) {
      this.tooltip.style.top = `${top}px`;
      this.tooltip.style.left = `${left}px`;
    }
  }
}
