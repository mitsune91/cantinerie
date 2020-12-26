import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenSummaryComponent } from './canteen-summary.component';

describe('CanteenSummaryComponent', () => {
  let component: CanteenSummaryComponent;
  let fixture: ComponentFixture<CanteenSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanteenSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanteenSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
