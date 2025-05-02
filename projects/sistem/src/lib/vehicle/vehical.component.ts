import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';

@Component({
  selector: 'ui-vehicle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehical.component.html',
  styleUrl: './vehical.component.css'
})
export class VehicalComponent {
  @Input() size: 'xxl' | 'xl' | 'md' | 'sm' | 'xsm' = 'md';
  // @Input() vehicle: 'car' | 'bike' | 'cycle' | 'truck' = 'bike';
  @Input() shape: 'default' | 'circle'  = 'circle';
  @Input() vehicleIcon?: string;
  @Input() vehicle?: string;
  defaultIcon: string = '../assets/images/icons/larg.svg';
} 
