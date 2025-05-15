import {
  Component,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../notification/notification.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ui-range-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent, IconComponent],
  templateUrl: './double-calendar.component.html',
  styleUrls: ['./double-calendar.component.css'],
})
export class DoubleCalendarComponent implements OnChanges {
  @Input() resetTrigger: boolean = false;
  startDate: Date | null = null;
  endDate: Date | null = null;
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  showCalendar: boolean = false;
  today: Date = new Date();
  hoveredDate: Date | null = null;
  @Output() dateRangeSelected = new EventEmitter<{
    startDate: Date | null;
    endDate: Date | null;
  }>();
  constructor(private elementRef: ElementRef) {}

  public clear(): void {
    this.startDate = null;
    this.endDate = null;
    this.dateRangeSelected.emit({
      startDate: null,
      endDate: null
    });
  }
  

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resetTrigger'] && changes['resetTrigger'].currentValue) {
      this.resetDateRange();
    }
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      setTimeout(() => this.adjustCalendarPosition(), 100); // Slight delay to ensure rendering
    }
  }

  adjustCalendarPosition() {
    const calendarElement = document.querySelector('.calendar-container');
    if (calendarElement) {
      const rect = calendarElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // If calendar overflows the viewport, align it to the right
      if (rect.right > viewportWidth) {
        calendarElement.classList.add('align-right');
      } else {
        calendarElement.classList.remove('align-right');
      }
    }
  }

  onDateSelect(date: Date) {
    if (!this.startDate || (this.startDate && this.endDate)) {
      this.startDate = date;
      this.endDate = null;
    } else if (this.startDate && !this.endDate && date > this.startDate) {
      this.endDate = date;
      this.dateRangeSelected.emit({
        startDate: this.startDate,
        endDate: this.endDate,
      });
      this.showCalendar = false;
    } else {
      this.startDate = date;
      this.endDate = null;
    }
  }

  isInRange(date: Date): boolean {
    return !!(
      this.startDate &&
      this.endDate &&
      date > this.startDate &&
      date < this.endDate
    );
  }

  isSelected(date: Date): boolean {
    return !!(
      (this.startDate && date.getTime() === this.startDate.getTime()) ||
      (this.endDate && date.getTime() === this.endDate.getTime())
    );
  }

  isToday(date: Date): boolean {
    return (
      date.getDate() === this.today.getDate() &&
      date.getMonth() === this.today.getMonth() &&
      date.getFullYear() === this.today.getFullYear()
    );
  }

  isDisabled(date: Date, offset: number): boolean {
    const monthToCheck = this.currentMonth + offset;
    const yearToCheck = this.currentYear + Math.floor(monthToCheck / 12);
    const monthNormalized = monthToCheck % 12;

    return (
      date.getMonth() !== monthNormalized || date.getFullYear() !== yearToCheck
    );
  }

  changeMonth(delta: number, offset: number) {
    if (offset === 0) {
      this.currentMonth += delta;
    } else {
      this.currentMonth += delta;
    }
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear -= 1;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear += 1;
    }
  }

  onDateHover(date: Date) {
    this.hoveredDate = date;
  }

  isInHoverRange(date: Date): boolean {
    return !!(
      this.startDate &&
      !this.endDate &&
      this.hoveredDate &&
      date > this.startDate &&
      date <= this.hoveredDate
    );
  }

  changeYear(delta: number) {
    this.currentYear += delta;
  }

  getMonthName(monthOffset: number): string {
    const date = new Date(this.currentYear, this.currentMonth + monthOffset, 1);
    return date.toLocaleString('default', { month: 'short' });
  }

  getYear(monthOffset: number): number {
    const date = new Date(this.currentYear, this.currentMonth + monthOffset, 1);
    return date.getFullYear();
  }

  getDaysInMonth(year: number, month: number): (Date | null)[] {
    const dates: (Date | null)[] = [];

    // First day of the current month
    const startDate = new Date(year, month, 1);
    const firstDayOfMonth = startDate.getDay(); // Day of the week for the 1st (0 = Sunday, 1 = Monday, etc.)

    // Get the number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // The last day of the month

    // Add previous month's trailing days to fill the first week
    const prevMonth = month === 0 ? 11 : month - 1; // If it's January, go to December
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthDays = new Date(prevMonthYear, prevMonth + 1, 0).getDate(); // Get the last day of the previous month

    // Add leading empty cells (days from previous month)
    for (let i = firstDayOfMonth; i > 0; i--) {
      dates.push(new Date(prevMonthYear, prevMonth, prevMonthDays - i + 1)); // Add previous month's last days
    }

    // Add valid days for the current month
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day)); // Push each valid day of the current month
    }

    // Add trailing empty cells (days from the next month) to fill the calendar grid
    const totalCells = 42; // 6 weeks (7 days per week)
    const remainingCells = totalCells - dates.length;

    // Add the days from the next month
    for (let i = 1; i <= remainingCells; i++) {
      dates.push(new Date(year, month + 1, i)); // Push the next month's days
    }

    return dates;
  }

  // Close dropdown if clicked outside
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement): void {
    if (!this.elementRef.nativeElement.contains(target)) {
      this.showCalendar = false;
    }
  }

  resetDateRange() {
    this.startDate = null;
    this.endDate = null;
    this.dateRangeSelected.emit({
      startDate: null,
      endDate: null
    });
  }
}
