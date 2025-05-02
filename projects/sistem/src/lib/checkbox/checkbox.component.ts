import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'ui-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Use OnPush to minimize re-renders
})
export class CheckboxComponent {
  @Input() size: 'large' | 'small' = 'small';
  @Input() label?: string;
  @Input() checked: boolean = false;

  @Output() change = new EventEmitter<boolean>();

  onChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked !== this.checked) {
      this.checked = target.checked;
      this.change.emit(this.checked);
    }
  }
}
