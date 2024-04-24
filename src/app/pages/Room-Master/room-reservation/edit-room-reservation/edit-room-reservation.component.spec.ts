import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoomReservationComponent } from './edit-room-reservation.component';

describe('EditRoomReservationComponent', () => {
  let component: EditRoomReservationComponent;
  let fixture: ComponentFixture<EditRoomReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRoomReservationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRoomReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
