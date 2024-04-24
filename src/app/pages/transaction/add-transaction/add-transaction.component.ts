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
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],
})
export class AddTransactionComponent
  implements OnInit, OnDestroy, AfterContentChecked
{

  transactions: Transaction = new Transaction();

  selectedTransactions!: Transaction[] | null;

  submitted: boolean = false;
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
  availableRooms!: any[];
  selectedRoom: any;
  selectedGuestStatus: any;

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

  ngOnInit() {
  this.getRooms()
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  async getRooms() {
    this.availableRooms = null;
    this.subscription.add(
      await this.apiService.get(ApiURL.room_details).subscribe(
        (res) => {
          console.log(res);
          this.availableRooms = res;
        },
        (err) => {
          this.utilitiesService.notifyError('Could not perform operation!');
        }
      )
    );
  }

  saveTransaction() {
    this.transactions.guestStatus = this.selectedGuestStatus.name
    if(!this.hasEmptyFields()) {
      this.transactions.checkInDate = new Date(this.transactions.checkInDate);
      this.transactions.checkInDate.setHours(this.transactions.checkInDate.getHours() + 3);
      if(this.transactions.checkOutDate){
        this.transactions.checkOutDate = new Date(this.transactions.checkOutDate);
        this.transactions.checkOutDate.setHours(this.transactions.checkOutDate.getHours() + 3);
      }
      if(this.transactions.leaveStartDate) {
        this.transactions.leaveStartDate = new Date(this.transactions.leaveStartDate);
        this.transactions.leaveStartDate.setHours(this.transactions.leaveStartDate.getHours() + 3);
      }
      if(this.transactions.leaveEndDate) {
        this.transactions.leaveEndDate = new Date(this.transactions.leaveEndDate);
        this.transactions.leaveEndDate.setHours(this.transactions.leaveEndDate.getHours() + 3);
      }
      this.transactions.roomId = this.selectedRoom.id;
      console.log(this.transactions);
      this.subscription.add(
        this.apiService.post(ApiURL.bookings, this.transactions).subscribe(
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
    const transactionsToCheck = { ...this.transactions };
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
    console.log(this.transactions);
    for (const key of Object.keys(transactionsToCheck)) {
      if (transactionsToCheck[key] === null || transactionsToCheck[key] < 0 || transactionsToCheck[key] === "" || transactionsToCheck[key] === undefined) {
        return true;
      }
    }
    return false;
  }
}
