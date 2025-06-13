import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextDropdownComponent } from './text-dropdown.component';

describe('TextDropdownComponent', () => {
  let component: TextDropdownComponent;
  let fixture: ComponentFixture<TextDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
