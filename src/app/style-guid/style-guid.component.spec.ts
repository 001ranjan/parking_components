import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleGuidComponent } from './style-guid.component';

describe('StyleGuidComponent', () => {
  let component: StyleGuidComponent;
  let fixture: ComponentFixture<StyleGuidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StyleGuidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StyleGuidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
