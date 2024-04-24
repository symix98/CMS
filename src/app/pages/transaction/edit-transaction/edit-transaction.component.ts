import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { Transaction } from 'src/app/core/models/transaction.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.component.html',
  styleUrls: ['./edit-transaction.component.scss']
})
export class EditTransactionComponent implements OnInit, OnDestroy, AfterContentChecked {

  transaction: Transaction = new Transaction();

  guestStatuses: any[] = [
    { id: '1', name: 'annual leave' },
    { id: '2', name: 'business' },
    { id: '3', name: 'emergency leave' },
    { id: '4', name: 'long leave' },
    { id: '5', name: 'occupied' },
    { id: '6', name: 'R&R' },
    { id: '7', name: 'released' },
    { id: '8', name: 'resigned' },
    { id: '9', name: 'sick leave' },
  ];
  selectedGuestStatus: any;
  availableRooms!: any[];

  subscription = new Subscription();

  selectedRoom: any;

  constructor(
    public config: DynamicDialogConfig,
    private apiService: ApiService,
    private utilitiesService: UtilitiesService,
    private ref: DynamicDialogRef,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.getRooms();
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  async getRooms() {
    await this.subscription.add(
      this.apiService.get(ApiURL.room_details).subscribe({
        next: (res) => {
          this.availableRooms = res;
          console.log(res);       
        },
        complete: () => {
          this.populateTransactionData()
        },
        error: (err) => {
          throw new Error('Could not perform operation!');
        },
      })
    );
  }
  populateTransactionData() {
  if (this.config.data) {
    this.transaction = this.config.data;
    if(this.transaction.checkInDate !== null) {this.transaction.checkInDate = new Date(this.config.data.checkInDate)}
    if(this.transaction.checkOutDate !== null) {this.transaction.checkOutDate = new Date(this.config.data.checkOutDate)}
    if(this.transaction.leaveEndDate !== null) {this.transaction.leaveEndDate = new Date(this.config.data.leaveEndDate)}
    if(this.transaction.leaveStartDate !== null) {this.transaction.leaveStartDate = new Date(this.config.data.leaveStartDate)}  
    this.transaction.guestStatus = this.findGuestStatusByName(this.transaction.guestStatus, this.guestStatuses);
    this.transaction.roomId = this.config.data.roomId;
    this.selectedRoom = this.findRoomId(this.transaction.roomId, this.availableRooms)
    console.log(this.selectedRoom);
    
  }
  this.cdr.detectChanges();
}

findRoomId(id: any, availableRooms: any[]): any {
  console.log(id);
  console.log(availableRooms);
  console.log(this.selectedRoom);  
  return availableRooms.find((room) => room.id === id);
}

  findGuestStatusByName(status: string, guestStatuses: any[]): any {
    console.log(status);
    console.log(guestStatuses);   
    return guestStatuses.find((stat) => stat.name === status);
  }

  saveTransaction() {
    this.transaction.guestStatus = this.selectedGuestStatus.name
    if(!this.hasEmptyFields()) {
      this.transaction.checkInDate = new Date(this.transaction.checkInDate);
      this.transaction.checkInDate.setHours(this.transaction.checkInDate.getHours() + 3);
      if(this.transaction.checkOutDate){
        this.transaction.checkOutDate = new Date(this.transaction.checkOutDate);
        this.transaction.checkOutDate.setHours(this.transaction.checkOutDate.getHours() + 3);
      }
      if(this.transaction.leaveStartDate) {
        this.transaction.leaveStartDate = new Date(this.transaction.leaveStartDate);
        this.transaction.leaveStartDate.setHours(this.transaction.leaveStartDate.getHours() + 3);
      }
      if(this.transaction.leaveEndDate) {
        this.transaction.leaveEndDate = new Date(this.transaction.leaveEndDate);
        this.transaction.leaveEndDate.setHours(this.transaction.leaveEndDate.getHours() + 3);
      }
      this.subscription.add(
        this.apiService.put(ApiURL.bookings + '/' + this.config.data.id, this.transaction).subscribe(
          (res) => {
            this.ref.close(res);
          },
          (err) => {
            this.utilitiesService.notifyError(err.error.title);
            throw new Error('Could not perform operation!');
          }
        )
      );
    } else {  
      this.utilitiesService.notifyWarning('Please fill all required fields');
    }
    
  }

  hasEmptyFields(): boolean {
    const transactionsToCheck = { ...this.transaction };
    delete transactionsToCheck.checkOutDate;
    delete transactionsToCheck.docuploaded;
    delete transactionsToCheck.employeeMaster;
    delete transactionsToCheck.leaveEndDate;
    delete transactionsToCheck.leaveStartDate;
    delete transactionsToCheck.roomDetails;
    delete transactionsToCheck.bedNo;
    delete transactionsToCheck.id;
    delete transactionsToCheck.roomId;
    delete transactionsToCheck.remarks;
    console.log(transactionsToCheck);
    console.log(this.transaction);
    for (const key of Object.keys(transactionsToCheck)) {
      if (transactionsToCheck[key] === null || transactionsToCheck[key] < 0 || transactionsToCheck[key] === "" || transactionsToCheck[key] === undefined) {
        return true;
      }
    }
    return false;
  }

}
