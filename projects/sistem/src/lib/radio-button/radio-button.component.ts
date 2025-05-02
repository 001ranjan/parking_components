import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ui-radio-button',
  standalone: true,
  imports: [],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.css'
})
export class RadioButtonComponent {
  @Input() size: 'large' | 'small' = 'small';
  @Input() label?: string;
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() checked: boolean = false;

  @Output() change = new EventEmitter<string>();

  onChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.change.emit(target.value);
  }
}
