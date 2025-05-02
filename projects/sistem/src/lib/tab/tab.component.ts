import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {

  private _tabs: { id: number; title: string; content: TemplateRef<any> }[] = [];
  
  @Input() 
  set tabs(value: { id: number; title: string; content: TemplateRef<any> }[]) {
    this._tabs = value;
    if (this._tabs.length) {
      this.activeTab = this._tabs[0].id;
    }
  }

  get tabs(): { id: number; title: string; content: TemplateRef<any> }[] {
    return this._tabs;
  }

  activeTab: number | null = null;

  ngOnInit() {
    if (this._tabs.length && this.activeTab === null) {
      this.activeTab = this._tabs[0].id;
    }
  }

  selectTab(tabId: number, index: number): void {
    this.activeTab = tabId;
    document.documentElement.style.setProperty('--tab-index', `${index}`);
  }
}
