import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PassesComponent } from './passes.component';

describe('PassesComponent', () => {
  let component: PassesComponent;
  let fixture: ComponentFixture<PassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentPage).toBe(1);
    expect(component.rowsPerPage).toBe(10);
    expect(component.totalPages).toBe(1);
    expect(component.totalPasses).toBe(0);
    expect(component.paginatedPasses).toEqual([]);
  });

  it('should handle pagination correctly', () => {
    component.totalPasses = 50;
    component.rowsPerPage = 10;
    component.loadPasses();
    
    expect(component.totalPages).toBe(5);
    
    component.goToNextPage();
    expect(component.currentPage).toBe(2);
    
    component.goToPreviousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should handle filter changes', () => {
    const event = { value: 'daily' };
    component.onTypeSelectionChange(event);
    expect(component.tempSelectedType).toBe('daily');
    
    component.clearFilters();
    expect(component.tempSelectedType).toBe('');
    expect(component.tempSelectedOperator).toBe('');
    expect(component.tempSelectedStatus).toBe('');
  });
}); 