import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-tags',
  standalone: true,
  imports: [],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent {
  @Input() lable?: string;
  @Input() size?: string;
  @Input() variant: 'closed' | 'new' | 'canclled' | 'active' | 'expired' | 'error' | 'default' = 'closed';
}
