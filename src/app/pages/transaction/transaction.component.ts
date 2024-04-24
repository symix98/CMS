import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Transaction } from 'src/app/core/models/transaction.model';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { EditTransactionComponent } from './edit-transaction/edit-transaction.component';
import { TableParameter } from 'src/app/core/models/table-model/table-parameter.model';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit, OnDestroy {
  tableParam: TableParameter;

  transactionDialog: boolean = false;

  transactions!: Transaction[];

  selectedTransactions!: Transaction[] | null;

  submitted: boolean = false;

  GuestStatus!: any[];

  subscription = new Subscription();

  guestNotAvailable: boolean = false;

  constructor(
    private dialogService: DialogService,
    public config: DynamicDialogConfig,
    private apiService: ApiService,
    private utilitiesService: UtilitiesService
  ) {}

  ngOnInit() {
    this.getTransactions();
  }

  async getTransactions() {
    this.transactions = null;
    this.subscription.add(
      await this.apiService.get(ApiURL.bookings).subscribe(
        (res) => {
          console.log(res);
          this.transactions = res;
        },
        (err) => {
          this.utilitiesService.notifyError('Could not perform operation!');
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  deleteSelectedTransactions() {
    this.utilitiesService
      .confirmDialog('Are you sure you want to delete transactions?')
      .then((confirm) => {
        if (confirm) {
          this.selectedTransactions.forEach((transaction) => {
            this.subscription.add(
              this.apiService
                .delete(ApiURL.bookings + '/' + transaction.id)
                .subscribe({
                  next: (res) => {
                    this.utilitiesService.notifySuccess(
                      `Transaction ${transaction.id} Deleted`
                    );
                  },
                  error(err) {
                    this.utilitiesService.notifyError('Could not perform operation!');
                  },
                })
              );
              this.getTransactions();
          });
        }
      });
  }

  openEditTransaction(transaction: Transaction) {
    this.dialogService
      .open(EditTransactionComponent, {
        header: 'Edit Booking',
        height: '75vh',
        width: '50%',
        modal: true,
        data: transaction,
      })
      .onClose.subscribe((res) => {
        if (res) {
          console.log(res);
          this.utilitiesService.notifySuccess(`Booking ${transaction.id} Saved`);
          this.getTransactions()
        }
      });
  }

  deleteTransaction(transaction: Transaction) {
    this.utilitiesService
      .confirmDialog('Are you sure you want to delete this transaction?')
      .then((confirm) => {
        if (confirm) {
          this.subscription.add(
            this.apiService
              .delete(ApiURL.bookings + '/' + transaction.id)
              .subscribe(
                (res) => {
                  this.utilitiesService.notifySuccess('Transaction Deleted');
                  this.ngOnInit();
                },
                (err) => {
                  this.utilitiesService.notifyError(
                    'Could not perform operation!'
                  );
                }
              )
          );
        }
      });
  }

  openNewTransaction() {
    this.dialogService
      .open(AddTransactionComponent, {
        header: 'Add Booking',
        height: '57vh',
        width: '50%',
        modal: true,
      })
      .onClose.subscribe((res) => {
        if (res) {
          console.log(res);
          this.transactions.push(res);
          this.utilitiesService.notifySuccess('Booking Added');
        }
      });
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): string {
    return '';
  }

  downloadTemplate() {
    let transactionTemplate = [
      {
        transactionNo: null,
        roomId: null,
        checkInDate: null,
        checkOutDate: null,
        guestStatus: null,
        leaveStartDt: null,
        leaveEndDt: null,
        manDays: null,
        remarks: null,
        attachment: null,
      },
    ];
    this.utilitiesService.exportAsExcelFile(
      transactionTemplate,
      'transaction_template'
    );
  }

  exportTransactions() {
    this.utilitiesService.exportAsExcelFile(this.transactions, 'bookings');
  }

  getSeverity(status: string) {
    switch(status) {
      case "business":
      return "success"
      case "occupied":
      return "success"
    }
    
  }
}
