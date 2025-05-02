import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ui-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, OnChanges {
  @Input() icons: 'suffix' | 'prefix' = 'suffix';
  @Input() categories: string[] = [
    'All Parking',
    'Sales',
    'eCommerce',
    'Parking',
  ];
  @Input() size: 'large' | 'medium' | 'small' = 'medium';
  @Input() isCategory: string = 'notHave';
  @Input() searchList: { label: string; url?: string }[] = [];
  @Input() contacts: {
    name: string;
    role: string;
    company: string;
    category: string;
    image: string;
    description: string;
  }[] = [];

  @Input() searchTerms: string = '';

  searchTerm: string = '';
  isFocused: boolean = false;
  showDropdown: boolean = false;
  selectedCategory: string = '';
  typing: boolean = false;

  filteredContacts: {
    name: string;
    role: string;
    company: string;
    category: string;
    image: string;
    description: string;
  }[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.setDefaultCategory();
    this.searchTerm = this.searchTerms || '';
    this.filterContacts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contacts'] || changes['searchTerms']) {
      this.filterContacts();
    }

    if (changes['categories']) {
      this.setDefaultCategory();
      this.filterContacts();
    }
  }

  private setDefaultCategory(): void {
    if (this.categories.length > 0) {
      this.selectedCategory = this.categories[0];
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.showDropdown = false;
    this.filterContacts();
  }

  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  filterContacts(): void {
    const term = this.searchTerm || this.searchTerms;
    this.isFocused = term.length > 0;

    this.filteredContacts = this.contacts.filter((contact) => {
      const matchesCategory =
        contact.category.toLowerCase() ===
          this.selectedCategory.toLowerCase() ||
        this.selectedCategory === this.categories[0];
      const matchesSearch = contact.name
        .toLowerCase()
        .includes(term.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  // Close dropdown if clicked outside
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement): void {
    if (!this.elementRef.nativeElement.contains(target)) {
      this.showDropdown = false;
      this.typing = false;
    }
  }
}
