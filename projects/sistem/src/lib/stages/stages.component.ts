import { Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ui-stages',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.css'] // Corrected here
})
export class StagesComponent {
  @Input() label?: string = 'Stage Name';
  @Input() stage: 'complete' | 'active' | 'pending' | 'lead' = 'complete';

}
