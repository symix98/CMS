import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { Room } from 'src/app/core/models/room.model';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { AdvancedBooking } from 'src/app/core/models/advance-booking.model';
import { AddRoomReservationComponent } from './add-room-reservation/add-room-reservation.component';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { BedDetails } from 'src/app/core/models/bed-details.model';
import { EditBedDetailsComponent } from '../bed-details/edit-bed-details/edit-bed-details.component';
import { EditRoomReservationComponent } from './edit-room-reservation/edit-room-reservation.component';
@Component({
  selector: 'app-room-reservation',
  templateUrl: './room-reservation.component.html',
  styleUrls: ['./room-reservation.component.scss'],
})
export class RoomReservationComponent implements OnInit, OnDestroy, AfterContentChecked, AfterViewInit
{
  roomId: number;
  reservedRooms: AdvancedBooking[];
  formCount = 0;
  selectedReservations!: AdvancedBooking[] | null;

  selectedBedStatus: any;

  subscription = new Subscription();

  constructor(
    public config: DynamicDialogConfig,
    private apiService: ApiService,
    private utilitiesService: UtilitiesService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    if (this.config.data) {
      this.roomId = this.config.data.id;
      console.log(this.config.data);
      this.formCount = this.config.data.bedCount;
    }
  }

  ngAfterViewInit(): void {
    this.getReservedRooms();
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  getReservedRooms() {
    this.subscription.add(
      this.apiService.get(ApiURL.room_advance_bookings).subscribe({
        next: (res) => {
          this.reservedRooms = res;
          console.log(this.reservedRooms);
        },
        complete: () => {},
        error: (err) => {
          throw new Error('Could not perform operation!');
        },
      })
    );
  }

  openEditRoomReservation(reservedRoom: BedDetails) {
    console.log(reservedRoom);
    this.dialogService
      .open(EditRoomReservationComponent, {
        header: `Edit Reservation: ${reservedRoom.id}`,
        height: '60vh',
        width: '50%',
        modal: true,
        data: reservedRoom,
      })
      .onClose.subscribe((res) => {
        if (res) {
          this.getReservedRooms();
        }
      });
  }

  deleteRoomReservation(reservedRoomId: number) {
    this.utilitiesService
      .confirmDialog(`Are you sure to delete reservation ${reservedRoomId} ?`)
      .then((confirm) => {
        if (confirm) {
          this.subscription.add(
            this.apiService
              .delete(ApiURL.room_advance_bookings + '/' + reservedRoomId)
              .subscribe(
                (res) => {
                  this.utilitiesService.notifySuccess(
                    `Reservation ${reservedRoomId} deleted`
                  );
                  this.getReservedRooms();
                },
                (err) => {
                  this.utilitiesService.notifyError(
                    'Could not perform operation!'
                  );
                  throw new Error('Could not perform operation!');
                }
              )
          );
        }
      });
  }

  openNewRoomReservation() {
    this.dialogService
      .open(AddRoomReservationComponent, {
        header: 'Reserve a Room',
        height: '60vh',
        width: '50%',
        modal: true,
        data: this.roomId
      })
      .onClose.subscribe((res) => {
        if (res) {
          this.getReservedRooms();
        }
      });
  }

  deleteSelectedReservations() {
    this.utilitiesService
      .confirmDialog('Are you sure you want to delete selected reservations?')
      .then((confirm) => {
        if (confirm) {
          this.selectedReservations.forEach((reservation) => {
            this.subscription.add(
              this.apiService
                .delete(ApiURL.room_advance_bookings + '/' + reservation.id)
                .subscribe({
                  next: (res) => {
                    this.utilitiesService.notifySuccess(
                      `Reservation ${reservation.id} Deleted`
                    );
                  },
                  error(err) {
                    this.utilitiesService.notifyError('Could not perform operation!');
                  },
                })
              );
              this.getReservedRooms();
          });
        }
      });
  }

  exportTransactions() {
    this.utilitiesService.exportAsExcelFile(this.reservedRooms, 'reservations');
  }
}
