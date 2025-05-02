import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'ui-number',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './number.component.html',
  styleUrl: './number.component.css'
})
export class NumberComponent {
  countryCode: string = '+91';
  number: string = '';
  isFocused: boolean = false;
  wordCount: number = 0;
  errorMessage: string = '';


  countryCodes: { code: string; name: string }[] = [
    { code: '+1', name: 'USA' },
    { code: '+91', name: 'India' },
    { code: '+44', name: 'UK' },
    { code: '+81', name: 'Japan' },
    { code: '+61', name: 'Australia' },
    // Add more country codes as needed
  ];

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }

  filterInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filteredValue = input.value.replace(/[^0-9]/g, ''); 
    if (input.value !== filteredValue) {
      this.errorMessage = 'Please enter only numbers.'; 
    } else {
      this.errorMessage = ''; 
    }
    this.number = filteredValue; 
    input.value = this.number; 
    this.wordCountFun(); 
  }

  wordCountFun(): void {
    this.wordCount = this.number.replace(/[^0-9]/g, '').length;
    // console.log(this.wordCount); 
  }

  selectCountryCode(code: string): void {
    this.countryCode = code; 
  }

}
