import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleCalendarComponent } from './double-calendar.component';

describe('DoubleCalendarComponent', () => {
  let component: DoubleCalendarComponent;
  let fixture: ComponentFixture<DoubleCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoubleCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoubleCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
