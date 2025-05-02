import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SistemComponent } from './sistem.component';

describe('SistemComponent', () => {
  let component: SistemComponent;
  let fixture: ComponentFixture<SistemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SistemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SistemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
