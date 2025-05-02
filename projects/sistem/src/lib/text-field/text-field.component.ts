import { Component, Input, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-text-field',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true
    }
  ]
})
export class TextFieldComponent implements ControlValueAccessor {
  title: string = '';
  wordCount: number = 0;
  isFocused: boolean = false;
  errorMessage: string = 'Please enter only numbers.';  
  showPassword: boolean = false;
  
  @Input() variant: 'primary' | 'secondary' = 'secondary';
  @Input() shape?: 'round' | 'corner' | 'default' = 'round';
  @Input() hasError: boolean = false;  
  @Input() error: boolean = false;  
  @Input() disable: boolean = false;  
  @Input() label: string = 'Text';
  @Input() placeholder: string = 'Enter your text';
  @Input() type: string = 'text';

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.title = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable = isDisabled;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get inputType(): string {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type;
  }

  filterInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.title = input.value;
    this.onChange(this.title);
    this.onTouched();
    this.wordCountFun();
  }

  wordCountFun(): void {
    this.wordCount = this.title.replace(/\s/g, '').length;
  }

  handleFocus(): void {
    this.isFocused = true; 
  }

  handleBlur(): void {
    this.isFocused = false; 
  }
}
