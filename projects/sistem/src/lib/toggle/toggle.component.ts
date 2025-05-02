import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'ui-toggle',
  standalone: true,
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.css'],
})
export class ToggleComponent implements OnInit {
  @Output() toggleChange = new EventEmitter<boolean>();
  isChecked: boolean = false;

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
    // this.setInitialTheme();
    // const target = event.target as HTMLInputElement;
    // const savedTheme = localStorage.getItem('theme');
    // if (savedTheme === 'dark') {
    //   console.log('Theme dark is selected');
    //   this.isChecked = target.checked;
    // }
  }

  setInitialTheme() {
    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    this.isChecked = prefersDarkMode;
    this.toggleChange.emit(this.isChecked);
  }

  toggleTheme() {
    this.isChecked = !this.isChecked;
    localStorage.setItem('theme', this.isChecked ? 'dark' : 'light');
    this.toggleChange.emit(this.isChecked);
  }

  onToggle(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isChecked = target.checked;
    this.toggleChange.emit(this.isChecked);
  }
}
