import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingRateComponent } from './parking-rate.component';

describe('ParkingRateComponent', () => {
  let component: ParkingRateComponent;
  let fixture: ComponentFixture<ParkingRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingRateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
