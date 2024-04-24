import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBedDetailsComponent } from './edit-bed-details.component';

describe('EditBedDetailsComponent', () => {
  let component: EditBedDetailsComponent;
  let fixture: ComponentFixture<EditBedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBedDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
