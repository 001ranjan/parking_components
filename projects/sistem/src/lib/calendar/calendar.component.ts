import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ui-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  showCalendar: boolean = false;
  selectedDate: string | null = null;
  selectedDay: number | null = null; 

  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months: string[] = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
    'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  monthsNumber: string[] = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
  ];
  
  daysInMonth: any[] = [];
  today: Date = new Date();

  constructor() {
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  selectDate(day: any) {
    if (!day.disabled) {
      this.selectedDay = day.date;
      this.selectedDate = `${day.date}/${this.monthsNumber[this.currentMonth]}/${this.currentYear}`;
      this.showCalendar = false;
    }
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  generateCalendar(month: number, year: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDaysInMonth = month === 0 ? 31 : new Date(year, month, 0).getDate();

    this.daysInMonth = [];

    // Previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
      this.daysInMonth.push({ date: prevDaysInMonth - i, disabled: true });
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      this.daysInMonth.push({ date: i, disabled: false });
    }
  }

  isToday(day: number): boolean {
    return (
      (this.selectedDay === null && 
        day === this.today.getDate() &&
        this.currentMonth === this.today.getMonth() &&
        this.currentYear === this.today.getFullYear()) ||
      (this.selectedDay === day && day === this.today.getDate()) 
    );
  }

  setToday() {
    const day = this.today.getDate();
    this.selectedDay = day;
    this.selectedDate = `${day}/${this.monthsNumber[this.currentMonth]}/${this.currentYear}`;
    this.showCalendar = false;
  }
}

