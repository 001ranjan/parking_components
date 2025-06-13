import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { icons } from '../icons';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ui-number',
  standalone: true,
  imports: [CommonModule, FormsModule,IconComponent],
  templateUrl: './number.component.html',
  styleUrl: './number.component.css'
})
export class NumberComponent {
  countryCode: string = '+91';
  searchTerm: string = '';
  number: string = '';
  wordCount: number = 0;
  showDropdown: boolean = false;
  isFocused: boolean = false;

  @Input() errorMessage: string = '';
  @Input() label: string = 'Number';
  @Input() placeholder: string = 'Mobile';
  @Input() icon: string = '';
  @Input() error: boolean = false;

  inputErrorMessage: string = '';

  countryCodes = [
    { code: '+93', name: 'AF' },
    { code: '+355', name: 'AL' },
    { code: '+213', name: 'DZ' },
    { code: '+1-684', name: 'AS' },
    { code: '+376', name: 'AD' },
    { code: '+244', name: 'AO' },
    { code: '+1-264', name: 'AI' },
    { code: '+672', name: 'AQ' },
    { code: '+54', name: 'AR' },
    { code: '+374', name: 'AM' },
    { code: '+297', name: 'AW' },
    { code: '+61', name: 'AU' },
    { code: '+43', name: 'AT' },
    { code: '+994', name: 'AZ' },
    { code: '+1-242', name: 'BS' },
    { code: '+973', name: 'BH' },
    { code: '+880', name: 'BD' },
    { code: '+1-246', name: 'BB' },
    { code: '+375', name: 'BY' },
    { code: '+32', name: 'BE' },
    { code: '+501', name: 'BZ' },
    { code: '+229', name: 'BJ' },
    { code: '+1-441', name: 'BM' },
    { code: '+975', name: 'BT' },
    { code: '+591', name: 'BO' },
    { code: '+387', name: 'BA' },
    { code: '+267', name: 'BW' },
    { code: '+55', name: 'BR' },
    { code: '+246', name: 'IO' },
    { code: '+359', name: 'BG' },
    { code: '+226', name: 'BF' },
    { code: '+257', name: 'BI' },
    { code: '+855', name: 'KH' },
    { code: '+237', name: 'CM' },
    { code: '+1', name: 'CA' },
    { code: '+238', name: 'CV' },
    { code: '+1-345', name: 'KY' },
    { code: '+236', name: 'CF' },
    { code: '+235', name: 'TD' },
    { code: '+56', name: 'CL' },
    { code: '+86', name: 'CN' },
    { code: '+57', name: 'CO' },
    { code: '+269', name: 'KM' },
    { code: '+682', name: 'CK' },
    { code: '+506', name: 'CR' },
    { code: '+385', name: 'HR' },
    { code: '+53', name: 'CU' },
    { code: '+357', name: 'CY' },
    { code: '+420', name: 'CZ' },
    { code: '+45', name: 'DK' },
    { code: '+253', name: 'DJ' },
    { code: '+1-767', name: 'DM' },
    { code: '+1-809', name: 'DO' },
    { code: '+593', name: 'EC' },
    { code: '+20', name: 'EG' },
    { code: '+503', name: 'SV' },
    { code: '+240', name: 'GQ' },
    { code: '+291', name: 'ER' },
    { code: '+372', name: 'EE' },
    { code: '+251', name: 'ET' },
    { code: '+679', name: 'FJ' },
    { code: '+358', name: 'FI' },
    { code: '+33', name: 'FR' },
    { code: '+594', name: 'GF' },
    { code: '+689', name: 'PF' },
    { code: '+241', name: 'GA' },
    { code: '+220', name: 'GM' },
    { code: '+995', name: 'GE' },
    { code: '+49', name: 'DE' },
    { code: '+233', name: 'GH' },
    { code: '+350', name: 'GI' },
    { code: '+30', name: 'GR' },
    { code: '+299', name: 'GL' },
    { code: '+1-473', name: 'GD' },
    { code: '+590', name: 'GP' },
    { code: '+1-671', name: 'GU' },
    { code: '+502', name: 'GT' },
    { code: '+224', name: 'GN' },
    { code: '+245', name: 'GW' },
    { code: '+592', name: 'GY' },
    { code: '+509', name: 'HT' },
    { code: '+504', name: 'HN' },
    { code: '+852', name: 'HK' },
    { code: '+36', name: 'HU' },
    { code: '+354', name: 'IS' },
    { code: '+91', name: 'IN' },
    { code: '+62', name: 'ID' },
    { code: '+98', name: 'IR' },
    { code: '+964', name: 'IQ' },
    { code: '+353', name: 'IE' },
    { code: '+972', name: 'IL' },
    { code: '+39', name: 'IT' },
    { code: '+1-876', name: 'JM' },
    { code: '+81', name: 'JP' },
    { code: '+962', name: 'JO' },
    { code: '+7', name: 'KZ' },
    { code: '+254', name: 'KE' },
    { code: '+686', name: 'KI' },
    { code: '+850', name: 'KP' },
    { code: '+82', name: 'KR' },
    { code: '+965', name: 'KW' },
    { code: '+996', name: 'KG' },
    { code: '+856', name: 'LA' },
    { code: '+371', name: 'LV' },
    { code: '+961', name: 'LB' },
    { code: '+266', name: 'LS' },
    { code: '+231', name: 'LR' },
    { code: '+218', name: 'LY' },
    { code: '+423', name: 'LI' },
    { code: '+370', name: 'LT' },
    { code: '+352', name: 'LU' },
    { code: '+853', name: 'MO' },
    { code: '+389', name: 'MK' },
    { code: '+261', name: 'MG' },
    { code: '+265', name: 'MW' },
    { code: '+60', name: 'MY' },
    { code: '+960', name: 'MV' },
    { code: '+223', name: 'ML' },
    { code: '+356', name: 'MT' },
    { code: '+692', name: 'MH' },
    { code: '+596', name: 'MQ' },
    { code: '+222', name: 'MR' },
    { code: '+230', name: 'MU' },
    { code: '+52', name: 'MX' },
    { code: '+691', name: 'FM' },
    { code: '+373', name: 'MD' },
    { code: '+377', name: 'MC' },
    { code: '+976', name: 'MN' },
    { code: '+382', name: 'ME' },
    { code: '+212', name: 'MA' },
    { code: '+258', name: 'MZ' },
    { code: '+95', name: 'MM' },
    { code: '+264', name: 'NA' },
    { code: '+674', name: 'NR' },
    { code: '+977', name: 'NP' },
    { code: '+31', name: 'NL' },
    { code: '+64', name: 'NZ' },
    { code: '+505', name: 'NI' },
    { code: '+227', name: 'NE' },
    { code: '+234', name: 'NG' },
    { code: '+683', name: 'NU' },
    { code: '+47', name: 'NO' },
    { code: '+968', name: 'OM' },
    { code: '+92', name: 'PK' },
    { code: '+680', name: 'PW' },
    { code: '+507', name: 'PA' },
    { code: '+675', name: 'PG' },
    { code: '+595', name: 'PY' },
    { code: '+51', name: 'PE' },
    { code: '+63', name: 'PH' },
    { code: '+48', name: 'PL' },
    { code: '+351', name: 'PT' },
    { code: '+974', name: 'QA' },
    { code: '+40', name: 'RO' },
    { code: '+7', name: 'RU' },
    { code: '+250', name: 'RW' },
    { code: '+685', name: 'WS' },
    { code: '+966', name: 'SA' },
    { code: '+221', name: 'SN' },
    { code: '+381', name: 'RS' },
    { code: '+248', name: 'SC' },
    { code: '+232', name: 'SL' },
    { code: '+65', name: 'SG' },
    { code: '+421', name: 'SK' },
    { code: '+386', name: 'SI' },
    { code: '+677', name: 'SB' },
    { code: '+27', name: 'ZA' },
    { code: '+34', name: 'ES' },
    { code: '+94', name: 'LK' },
    { code: '+249', name: 'SD' },
    { code: '+597', name: 'SR' },
    { code: '+268', name: 'SZ' },
    { code: '+46', name: 'SE' },
    { code: '+41', name: 'CH' },
    { code: '+963', name: 'SY' },
    { code: '+886', name: 'TW' },
    { code: '+992', name: 'TJ' },
    { code: '+255', name: 'TZ' },
    { code: '+66', name: 'TH' },
    { code: '+228', name: 'TG' },
    { code: '+676', name: 'TO' },
    { code: '+1-868', name: 'TT' },
    { code: '+216', name: 'TN' },
    { code: '+90', name: 'TR' },
    { code: '+993', name: 'TM' },
    { code: '+688', name: 'TV' },
    { code: '+256', name: 'UG' },
    { code: '+380', name: 'UA' },
    { code: '+971', name: 'AE' },
    { code: '+44', name: 'GB' },
    { code: '+1', name: 'US' },
    { code: '+598', name: 'UY' },
    { code: '+998', name: 'UZ' },
    { code: '+678', name: 'VU' },
    { code: '+39', name: 'VA' },
    { code: '+58', name: 'VE' },
    { code: '+84', name: 'VN' },
    { code: '+967', name: 'YE' },
    { code: '+260', name: 'ZM' },
    { code: '+263', name: 'ZW' }
  ];


  filteredCountryCodes = [...this.countryCodes];

  onFocus(): void {
    this.isFocused = true;
  }
  onFocusDrop(): void {
    this.isFocused = true;
    this.showDropdown = true;
    this.searchTerm = '';
    this.filteredCountryCodes = [...this.countryCodes];
  }

  onBlur(): void {
    setTimeout(() => {
      this.isFocused = false;
    }, 200);
  }

  onBlurDrop(): void {
    setTimeout(() => {
      this.isFocused = false;
      this.showDropdown = false;
      this.searchTerm = '';
    }, 200);
  }
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }


  selectCountryCode(code: string): void {
    this.countryCode = code;
    this.showDropdown = false;
    this.searchTerm = '';             // Reset search after selection
  }

  onSearch(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.searchTerm = input;

    this.filteredCountryCodes = this.countryCodes.filter(item =>
      item.name.toLowerCase().includes(input.toLowerCase()) ||
      item.code.includes(input)
    );

  }

  filterInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filteredValue = input.value.replace(/[^0-9]/g, '');
    this.inputErrorMessage = input.value !== filteredValue ? 'Please enter only numbers.' : '';
    this.number = filteredValue;
    input.value = this.number;
    this.wordCount = this.number.length;
    if (this.error) {
      this.error = false;
      this.errorMessage = '';
    }
  }
  getCountryCodeWidth(): string {
    // base width per character, tweak as needed
    const baseCharWidth = 10;
    const minWidth = 32; // px
    const maxWidth = 60; // px

    const length = this.countryCode ? this.countryCode.length : 2;
    let width = length * baseCharWidth;

    if (width < minWidth) width = minWidth;
    if (width > maxWidth) width = maxWidth;

    return width + 'px';
  }

}
