import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { AdvancedBooking } from 'src/app/core/models/advance-booking.model';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { Room } from 'src/app/core/models/room.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-edit-room-reservation',
  templateUrl: './edit-room-reservation.component.html',
  styleUrls: ['./edit-room-reservation.component.scss']
})
export class EditRoomReservationComponent implements OnInit {

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
    if (this.config.data) {
      console.log(this.config.data);
      this.advanceBooking.remarks = this.config.data.remarks;
      this.advanceBooking.bookingStartDate = new Date(this.config.data.bookingStartDate);
      this.advanceBooking.bookingEndDate = new Date(this.config.data.bookingEndDate);
    }
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  } 

  save() {
    if (!this.hasEmptyFields()) {
        let advanceBooking = {
          id: this.config.data.id,
          bookingStartDate: this.advanceBooking.bookingStartDate,
          bookingEndDate: this.advanceBooking.bookingEndDate,
          remarks: this.advanceBooking.remarks,
          createdAt : new Date(),
          modifyAt : new Date(),
          createdBy : this.currentUser.email,
          modifyBy : this.currentUser.email,
          roomDetails: {
            id: this.config.data.roomDetails.id
          }
        }
        advanceBooking.bookingStartDate = new Date(advanceBooking.bookingStartDate);
        advanceBooking.bookingStartDate.setHours(advanceBooking.bookingStartDate.getHours() + 3);
        advanceBooking.bookingEndDate = new Date(advanceBooking.bookingEndDate);
        advanceBooking.bookingEndDate.setHours(advanceBooking.bookingEndDate.getHours() + 3);
        this.subscription.add(
          this.apiService
            .put(ApiURL.room_advance_bookings + '/' + this.config.data.id, advanceBooking)
            .subscribe(
              (res) => {
                console.log(res);
                this.utilitiesService.notifySuccess('Room Saved');
                this.ref.close(true);
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
