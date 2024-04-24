import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { Room } from 'src/app/core/models/room.model';
import { Transaction } from 'src/app/core/models/transaction.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss'],
})
export class AddRoomComponent
  implements OnInit, OnDestroy, AfterContentChecked, AfterViewInit
{
  room: Room = new Room();
  selectedRooms!: Transaction[] | null;
  currentUser: AppUsers;
  roomStatuses: any[] = [
    { id: '1', name: 'occupied' },
    { id: '2', name: 'booked' },
    { id: '3', name: 'vacant' },
    { id: '4', name: 'blocked' },
    { id: '5', name: 'u/construction' },
    { id: '6', name: 'u/maintenance' },
  ];

  campIds: any[];
  cateringIds: any[];
  availableRooms!: any[];
  selectedCamp: any;
  selectedRoomAllocation: any;
  selectedRoomCategory: any;
  selectedCatering: any;
  selectedRoomStatus: any;
  subscription = new Subscription();

  constructor(
    public config: DynamicDialogConfig,
    private apiService: ApiService,
    private utilitiesService: UtilitiesService,
    private ref: DynamicDialogRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit() {
    this.currentUser = await this.utilitiesService.getCurrentAppUser();
  }

  ngAfterViewInit(): void {
    this.getRefTablesData();
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  getRefTablesData() {
    this.subscription.add(
      this.apiService.get(ApiURL.camp).subscribe({
        next: (res) => {
          this.campIds = res;
        },
        complete: () => {
          this.getCaterings();
        },
        error: (err) => {
          this.utilitiesService.notifyError('Could not perform operation!');
        },
      })
    );
  }

  getCaterings() {
    this.subscription.add(
      this.apiService.get(ApiURL.catering).subscribe({
        next: (res) => {
          this.cateringIds = res;
        },
        error: (err) => {
          this.utilitiesService.notifyError('Could not perform operation!');
        },
      })
    );
  }

  save() {
    if (!this.hasEmptyFields()) {
      if (this.selectedRoomStatus) {
        this.room.roomStatus = this.selectedRoomStatus.name;
      }
      // if(this.selectedCatering) {
      //   this.room.catering = {id: this.selectedCatering.id} as unknown as number;
      // }
      delete this.room.catering;
      // this.room.camp = { id: this.selectedCamp.id } as unknown as number;
      this.room.roomConfiguration = `1X${this.room.bedCount}`;
      this.room.availableFrom = new Date(this.room.availableFrom);
      this.room.availableFrom.setHours(this.room.availableFrom.getHours() + 3);
      console.log(this.room);
      this.subscription.add(
        this.apiService.post(ApiURL.room_details, this.room).subscribe(
          (res) => {
            this.ref.close(res);
          },
          (err) => {
            this.utilitiesService.notifyError('Could not perform operation!');
          }
        )
      );
    } else {
      console.log(this.room);
      this.utilitiesService.notifyWarning('Please fill all required fields');
    }
  }

  hasEmptyFields(): boolean {
    let roomToCheck = { ...this.room };
    roomToCheck.modifyAt = new Date();
    roomToCheck.createdAt = new Date();
    roomToCheck.modifyBy = this.currentUser.email;
    roomToCheck.createdBy = this.currentUser.email;
    delete roomToCheck.id;
    delete roomToCheck.availableFrom;
    delete roomToCheck.roomStatus;
    delete roomToCheck.bedOnly;
    delete roomToCheck.monthlyRate;
    delete roomToCheck.dailyRate;
    delete roomToCheck.bedRate;
    delete roomToCheck.reservationRate;
    delete roomToCheck.remarks;
    delete roomToCheck.createdBy;
    delete roomToCheck.createdAt;
    delete roomToCheck.modifyBy;
    delete roomToCheck.modifyAt;
    delete roomToCheck.bedDetails;
    delete roomToCheck.bookings;
    delete roomToCheck.roomAdvanceBookings;
    delete roomToCheck.roomDescription;
    delete roomToCheck.roomConfiguration;
    delete roomToCheck.catering;
    console.log(roomToCheck);
    for (const key of Object.keys(roomToCheck)) {
      if (
        roomToCheck[key] === null ||
        roomToCheck[key] < 0 ||
        roomToCheck[key] === '' ||
        roomToCheck[key] === undefined
      ) {
        return true;
      }
    }
    return false;
  }
}
