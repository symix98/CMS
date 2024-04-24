import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoomReservationComponent } from './add-room-reservation.component';

describe('AddRoomReservationComponent', () => {
  let component: AddRoomReservationComponent;
  let fixture: ComponentFixture<AddRoomReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRoomReservationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoomReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
