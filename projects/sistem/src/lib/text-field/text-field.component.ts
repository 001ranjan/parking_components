import { Component, INJECTOR, Input, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { icons } from '../icons';
import { ButtonsComponent } from '../buttons/buttons.component';


@Component({
  selector: 'ui-text-field',
  standalone: true,
  imports: [FormsModule, CommonModule,ButtonsComponent],
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
  constructor(private sanitizer: DomSanitizer) { }
  title: string = '';
  wordCount: number = 0;
  isFocused: boolean = false;

  showPassword: boolean = false;

  @Input() variant: 'primary' | 'secondary' = 'secondary';
  @Input() shape?: 'round' | 'corner' | 'default' = 'corner';
  @Input() hasError: boolean = false;
  @Input() error: boolean = false;
  @Input() disable: boolean = false;
  @Input() label: string = 'Text';
  @Input() placeholder: string = 'Enter your text';
  @Input() type: string = 'text';
  @Input() icon?: string;
  defaultIcon: string = "assets/images/icons/dark.svg";
  @Input() count: 'true' | 'false' = 'true';
  @Input() help?: string;
  @Input() link?:string="#"
  @Input() hide?:string='';
  @Input() hasIcon: boolean = false;
  @Input() errorMessage?: string= 'Enter Error massage!'
  onChange: any = () => { };
  onTouched: any = () => { };

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

  filterInput(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    this.title = input.value;
    this.onChange(this.title);
    this.onTouched();
    this.wordCountFun();
    if (this.error) {
      this.error = false;
      this.errorMessage = '';
    }
    // if(this.hasIcon){
    //   this.hasIcon=false;
    // }
    if (this.hasIcon && field !== 'password') {
      this.hasIcon = false;
    }
    if (field == 'password') {
      this.hasIcon = true;
    }
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
  isSvgPath(icon: string): boolean {
    return icon?.endsWith('.svg') || icon?.startsWith('http');
  }

  // Retrieve SVG icon from icons library if not a path
  getIconSvg(iconName: string | undefined): SafeHtml {
    const iconSvg = iconName ? icons[iconName] || '' : '';
    return this.sanitizer.bypassSecurityTrustHtml(iconSvg);
  }

}
