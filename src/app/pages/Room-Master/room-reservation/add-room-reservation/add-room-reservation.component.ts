import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  DynamicDialogConfig,
  DynamicDialogRef,
  DialogService,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { AdvancedBooking } from 'src/app/core/models/advance-booking.model';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { Room } from 'src/app/core/models/room.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-add-room-reservation',
  templateUrl: './add-room-reservation.component.html',
  styleUrls: ['./add-room-reservation.component.scss'],
})
export class AddRoomReservationComponent implements OnInit {
  availableNonReservedRooms: Room[] = [];
  allRooms: Room[] = [];
  reservedRooms: Room[] = [];
  selectedRoom: Room;
  advanceBooking: AdvancedBooking = new AdvancedBooking();
  subscription = new Subscription();
  currentUser: AppUsers;
  selectedRoomsToReserve: Room[];
  constructor(
    public config: DynamicDialogConfig,
    private apiService: ApiService,
    private utilitiesService: UtilitiesService,
    private ref: DynamicDialogRef,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit() {
    this.currentUser = await this.utilitiesService.getCurrentAppUser();
    await this.getRooms();
    setTimeout(() => {
      this.getReservedRooms();
    }, 20);
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  async getRooms() {
    this.allRooms = null;
    this.subscription.add(
      await this.apiService.get(ApiURL.room_details).subscribe(
        (res) => {
          console.log('all rooms: ', res);
          this.allRooms = res;
        },
        (err) => {
          this.utilitiesService.notifyError('Could not perform operation!');
        }
      )
    );
  }

  isRoomReserved(room, reservedRooms) {
    return reservedRooms.some(
      (reservedRoom) => reservedRoom.roomDetails.id === room.id
    );
  }

  async getReservedRooms() {
    this.reservedRooms = null;
    this.subscription.add(
      await this.apiService.get(ApiURL.room_advance_bookings).subscribe(
        (res) => {
          this.reservedRooms = res;
          console.log('reserved rooms: ', this.reservedRooms);

          this.availableNonReservedRooms = this.allRooms.filter(
            (room) => !this.isRoomReserved(room, this.reservedRooms)
          );
          console.log(this.availableNonReservedRooms);
          console.log(
            'all non reserved rooms: ',
            this.availableNonReservedRooms
          );
        },
        (err) => {
          this.utilitiesService.notifyError('Could not perform operation!');
        }
      )
    );
  }

  save() {
    if (!this.hasEmptyFields()) {
      let advanceBooking = {
        bookingStartDate: this.advanceBooking.bookingStartDate,
        bookingEndDate: this.advanceBooking.bookingEndDate,
        remarks: this.advanceBooking.remarks,
        createdAt: new Date(),
        modifyAt: new Date(),
        createdBy: this.currentUser.email,
        modifyBy: this.currentUser.email,
        roomDetails: {
          id: this.selectedRoom.id,
        },
      };
      advanceBooking.bookingStartDate = new Date(advanceBooking.bookingStartDate);
        advanceBooking.bookingStartDate.setHours(advanceBooking.bookingStartDate.getHours() + 3);
        advanceBooking.bookingEndDate = new Date(advanceBooking.bookingEndDate);
        advanceBooking.bookingEndDate.setHours(advanceBooking.bookingEndDate.getHours() + 3);
      console.log(advanceBooking);
      this.subscription.add(
        this.apiService
          .post(ApiURL.room_advance_bookings, advanceBooking)
          .subscribe(
            (res) => {
              console.log(res);
              this.utilitiesService.notifySuccess('Room Reserved');
              this.ref.close('reserved');
            },
            (err) => {
              this.utilitiesService.notifyError('Could not perform operation!');
              throw new Error('Could not perform operation!');
            }
          )
      );
    } else {
      console.log(this.advanceBooking);
      this.utilitiesService.notifyWarning('Please fill all required fields');
    }
  }

  hasEmptyFields(): boolean {
    let advancedBookingToCheck = this.advanceBooking;
    delete advancedBookingToCheck.remarks;
    delete advancedBookingToCheck.createdAt;
    delete advancedBookingToCheck.createdBy;
    delete advancedBookingToCheck.modifyAt;
    delete advancedBookingToCheck.modifyBy;
    delete advancedBookingToCheck.id;
    delete advancedBookingToCheck.roomDetails;
    for (const key of Object.keys(advancedBookingToCheck)) {
      if (
        advancedBookingToCheck[key] === null ||
        advancedBookingToCheck[key] < 0 ||
        advancedBookingToCheck[key] === '' ||
        advancedBookingToCheck[key] === undefined
      ) {
        return true;
      }
    }
    return false;
  }
}
