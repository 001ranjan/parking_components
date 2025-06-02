import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitiesRateComponent } from './facilities-rate.component';

describe('FacilitiesRateComponent', () => {
  let component: FacilitiesRateComponent;
  let fixture: ComponentFixture<FacilitiesRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilitiesRateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilitiesRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
