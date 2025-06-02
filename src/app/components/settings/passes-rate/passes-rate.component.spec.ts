import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassesRateComponent } from './passes-rate.component';

describe('PassesRateComponent', () => {
  let component: PassesRateComponent;
  let fixture: ComponentFixture<PassesRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassesRateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassesRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
