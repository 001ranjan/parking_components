import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-otp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent {

// error msg
onlyNumber:string='Only Number allowed.';
showError: boolean = false;

  onKeyUp(event: any, index: number) {
    const element = event.target;
    if (element.value.length === 1 && index < 5) {
      element.nextElementSibling?.focus();
    }
    if (event.key === 'Backspace' && index > 0) {
      element.previousElementSibling?.focus();
    }
  }


  // only allowed no. 
  onInput(event: any) {
    const input = event.target;
    const isNumeric = /^[0-9]*$/.test(input.value);
    if (!isNumeric) {
      this.showError = true; 
      input.value = input.value.replace(/[^0-9]/g, ''); 
    } else {
      this.showError = false; 
    }
    if (input.value.length > 1) {
      input.value = input.value.charAt(0);
    }
  }


}
