// import { Component } from '@angular/core';

// @Component({
//   selector: 'lib-search-bar',
//   standalone: true,
//   imports: [],
//   templateUrl: './search-bar.component.html',
//   styleUrl: './search-bar.component.css'
// })
// export class SearchBarComponent {

// }


import { NotificationComponent } from './../notification/notification.component';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ui-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit, OnChanges {
  @Input() icons: 'suffix' | 'prefix' = 'suffix';
  @Input() categories: string[] = ['All Parking', 'Sales', 'eCommerce', 'Parking'];
  @Input() categoriesId: string[] = ['All Parking', 'Sales', 'eCommerce', 'Parking'];
  @Input() size: 'large' | 'medium' | 'small' = 'medium';
  @Input() isCategory: string = 'notHave';
  @Input() searchList: { label: string; url?: string }[] = [];
  @Input() contacts: {
    id?: any;
    name: string;
    role: string;
    company: string;
    category: string;
    image: string;
    description: string;
  }[] = [];
  @Input() searchTerms: string = '';
  @Output() searchTermChange = new EventEmitter<string>();

  searchTerm: string = '';
  isFocused: boolean = false;
  showDropdown: boolean = false;
  selectedCategory: string = '';
  typing: boolean = false;
  selectedValue: string = '';
  // initialValue: string = '';
  @Input() initialValue: string = '';
  @Output() initialValueChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();


  filteredContacts: {
    id?: any;
    name: string;
    role: string;
    company: string;
    category: string;
    image: string;
    description: string;
  }[] = [];

  constructor(private elementRef: ElementRef) { }

  public clear(): void {
    this.searchTerm = '';
    this.searchTerms = '';
    this.filteredContacts = [];
    this.isFocused = false;
    this.typing = false;
    this.searchTermChange.emit('');
    this.filterContacts();
  }

  ngOnInit(): void {
    this.setDefaultCategory();
    this.searchTerm = this.searchTerms || '';
    this.filterContacts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialValue) {
      this.selectedValue = this.initialValue;
    }
    if (changes['contacts'] || changes['searchTerms']) {
      this.filterContacts();
    }
    if (changes['categories'] || changes['categoriesId']) {
      this.setDefaultCategory();
      this.filterContacts();
    }
  }

  getCategoryId(category: string | { id: string, name: string }): string {
    console.log("category", category);
    console.log("category.id", typeof category === 'object' ? category.id : category);
    return typeof category === 'object' ? category.id : category;
  }

  getCategoryName(category: string | { id: string, name: string }): string {
    return typeof category === 'object' ? category.name : category;
  }

  private setDefaultCategory(): void {
    if (this.categories.length > 0) {
      this.selectedCategory = this.categories[0];
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  selectCategory(category: string, id: string): void {
    this.selectedCategory = category;
    this.showDropdown = false;
    this.filterContacts();
    this.categoryChange.emit(category);
    this.listClick.emit(id);
    // console.log("selectedCategory",this.selectedCategory);
    // console.log("category",category);
  }
  @Output() listClick = new EventEmitter<string>();

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
        contact.category.toLowerCase() === this.selectedCategory.toLowerCase() ||
        this.selectedCategory === this.categories[0];
      const matchesSearch = contact.name.toLowerCase().includes(term.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  selectContact(contact: any): void {
    this.searchTerm = contact.name;
    this.searchTermChange.emit(contact.name);
    this.filteredContacts = [];
    this.isFocused = false;
    this.typing = false; // Prevent "no-results" message from showing
  }
  // onListClick(id: string): void {
  //   console.log("id",id);
  // }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement): void {
    if (!this.elementRef.nativeElement.contains(target)) {
      this.showDropdown = false;
      this.typing = false;
    }
  }
}
