import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBedDetailsComponent } from './add-bed-details.component';

describe('AddBedDetailsComponent', () => {
  let component: AddBedDetailsComponent;
  let fixture: ComponentFixture<AddBedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBedDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
