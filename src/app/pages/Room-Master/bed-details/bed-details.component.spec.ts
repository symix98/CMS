import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedDetailsComponent } from './bed-details.component';

describe('EditBedDetailsComponent', () => {
  let component: BedDetailsComponent;
  let fixture: ComponentFixture<BedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BedDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
