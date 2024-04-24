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
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.scss'],
})
export class EditRoomComponent
  implements OnInit, OnDestroy, AfterContentChecked, AfterViewInit
{
  room: Room = new Room();
  roomId: number;
  campIds!: any[];
  selectedCamp: any;
  roomStatuses: any[] = [
    { id: '1', name: 'occupied' },
    { id: '2', name: 'booked' },
    { id: '3', name: 'vacant' },
    { id: '4', name: 'blocked' },
    { id: '5', name: 'u/construction' },
    { id: '6', name: 'u/maintenance' },
  ];
  selectedRoomStatus: any;
  selectedCatering: any;
  cateringIds!: any[];
  availableRooms!: any[];
  currentUser: AppUsers;
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
    if (this.config.data) {
      this.roomId = this.config.data;
    }
    this.getRefTablesData();
    setTimeout(() => {
      this.getRoomById();
    }, 20);
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
          throw new Error('Could not perform operation!');
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
          throw new Error('Could not perform operation!');
        },
      })
    );
  }

  getRoomById() {
    this.subscription.add(
      this.apiService.get(ApiURL.room_details + '/' + this.roomId).subscribe({
        next: (res) => {
          console.log(res);
          this.room = res;
          this.room.availableFrom = new Date(this.room.availableFrom);
          if(this.room.roomStatus) {
            this.selectedRoomStatus = this.findRoomStatusByName(this.room.roomStatus, this.roomStatuses);
          }
          if (this.room.catering) {
            this.room.catering = this.findOptionById(
              this.room.catering,
              this.cateringIds
            );
          }
          if (this.room.camp) {
            this.room.camp = this.findOptionById(this.room.camp, this.campIds);
          }
        },
        complete: () => {},
        error: (err) => {
          this.utilitiesService.notifyError('Could not perform operation!');
        },
      })
    );
  }

  findRoomStatusByName(statusName: any, roomStatuses: any[]): any {
    console.log(statusName);
    console.log(roomStatuses);
    const foundOption = roomStatuses.find((option) => option.name === statusName);
    return foundOption ? foundOption : null;
  }

  findOptionById(listObject: any, options: any[]): any {
    console.log(listObject);
    console.log(options);
    const foundOption = options.find((option) => option.id === listObject.id);
    return foundOption ? foundOption : null;
  }

  getCamps() {
    this.subscription.add(
      this.apiService.get(ApiURL.camp).subscribe({
        next: (res) => {
          this.campIds = res;
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
      this.room.availableFrom = new Date(this.room.availableFrom);
      this.room.availableFrom.setHours(this.room.availableFrom.getHours() + 3);
      this.room.roomConfiguration = `1X${this.room.bedCount}`;
      this.subscription.add(
        this.apiService
          .put(ApiURL.room_details + '/' + this.roomId, this.room)
          .subscribe(
            (res) => {
              this.ref.close('updated');
              this.utilitiesService.notifySuccess('Room Saved');
            },
            (err) => {
              this.utilitiesService.notifyError('Could not perform operation!');
            }
          )
      );
    } else {
      this.utilitiesService.notifyWarning('Please fill all required fields');
    }
  }

  hasEmptyFields(): boolean {
    let roomToCheck = { ...this.room };
    roomToCheck.modifyAt = new Date();
    roomToCheck.createdAt = new Date();
    roomToCheck.modifyBy = this.currentUser.email;
    roomToCheck.createdBy = this.currentUser.email;
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
    delete roomToCheck.catering;
    delete roomToCheck.roomAdvanceBookings;
    console.log(roomToCheck);
    setTimeout(() => {
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
    }, 100);
    return false;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
    }
  }
}
