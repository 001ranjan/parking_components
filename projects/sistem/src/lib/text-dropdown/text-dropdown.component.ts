import { Component, Input, OnInit, OnChanges, SimpleChanges, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { icons } from '../icons';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ui-text-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './text-dropdown.component.html',
  styleUrl: './text-dropdown.component.css'
})
export class TextDropdownComponent implements OnInit, OnChanges {
  @Input() icons: 'suffix' | 'prefix' = 'suffix';
  @Input() dropdownList: string[] = ['All Parking', 'Sales', 'eCommerce', 'Parking'];
  @Input() size: 'large' | 'medium' | 'small' = 'large';
  @Input() isDropdown: string = 'notHave';
  @Input() searchList: { label: string; url?: string }[] = [];
  @Input() contacts: { name: string; role: string; company: string; category: string; image: string; description: string }[] = [];
  @Input() selectedValue: string | null = null;
  @Output() selectedValueChange = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<string>();
  @Input() text?: string = "Text";
  @Input() icon?: string;
  @Input() label?: string = "Text";
  defaultIcon: string = "";

  searchTerm: string = '';
  isFocused: boolean = false;
  showDropdown: boolean = false;
  selectedCategory: string = '';
  typing: boolean = false;
  userSelected: boolean = false;
  @Input() error: boolean = false;
  @Input() errorMessage?: string = 'Select dropdown!.'
  @Input() help?: string;
  @Input() link?: string = "#"
  @Input() hide?: string = '';

  filteredContacts: { name: string; role: string; company: string; category: string; image: string; description: string }[] = [];

  constructor(
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // this.setDefaultCategory();
    // Override with selectedValue if present
    if (this.selectedValue && this.selectedValue !== this.dropdownList[0]) {
      this.selectedCategory = this.selectedValue;
      this.userSelected = true;
    } else {
      this.userSelected = false;
    }

    this.filterContacts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contacts']) {
      this.filterContacts();
    }

    if (changes['dropdownList']) {
      // this.setDefaultCategory();
      this.filterContacts();
    }

    if (changes['selectedValue']) {
      const newVal = changes['selectedValue'].currentValue;
      if (newVal && newVal !== this.dropdownList[0]) {
        this.selectedCategory = newVal;
        this.userSelected = true;
      } else {
        this.userSelected = false;
      }
      this.filterContacts();
    }
  }

  // private setDefaultCategory(): void {
  //   // if (this.dropdownList.length > 1) {
  //   //   this.selectedCategory = this.dropdownList[0];
  //   // } else if (this.dropdownList.length > 0) {
  //   //   this.selectedCategory = this.dropdownList[0];
  //   // }
  // }

  // private setDefaultCategory(): void {
  //   if (this.dropdownList.length > 0) {
  //     this.selectedCategory = this.dropdownList[0];
  //   }
  // }




  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.userSelected = true;
    this.showDropdown = false;
    this.filterContacts();
    this.selectionChange.emit(this.selectedCategory);
    this.selectedValueChange.emit(this.selectedCategory);
    if (this.error) {
      this.error = false;
      this.errorMessage = '';
    }
  }

  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  filterContacts(): void {
    this.isFocused = this.searchTerm.length > 0;

    this.filteredContacts = this.contacts.filter(contact => {
      const matchesCategory =
        contact.category.toLowerCase() === this.selectedCategory.toLowerCase() ||
        this.selectedCategory === this.dropdownList[0];
      const matchesSearch = contact.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  // Close dropdown if clicked outside
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement): void {
    if (!this.elementRef.nativeElement.contains(target)) {
      this.showDropdown = false;
    }
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
