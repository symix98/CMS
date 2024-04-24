import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { BedDetails } from 'src/app/core/models/bed-details.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { AddBedDetailsComponent } from './add-bed-details/add-bed-details.component';
import { EditBedDetailsComponent } from './edit-bed-details/edit-bed-details.component';

@Component({
  selector: 'app-bed-details',
  templateUrl: './bed-details.component.html',
  styleUrls: ['./bed-details.component.scss'],
})
export class BedDetailsComponent
  implements OnInit, OnDestroy, AfterContentChecked, AfterViewInit
{
  roomId: number;
  bedDetails: BedDetails[];
  formCount = 0;

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
    this.getBedDetailsByRoomId();
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  getBedDetailsByRoomId() {
    let query: ApiQuery = new ApiQuery();
    query.filter = new Map<any, any>([['roomDetailsId', this.roomId]]);
    this.subscription.add(
      this.apiService.get(ApiURL.bed_details, query).subscribe({
        next: (res) => {
          this.bedDetails = res;
          console.log(this.bedDetails);
        },
        complete: () => {},
        error: (err) => {
          throw new Error('Could not perform operation!');
        },
      })
    );
  }

  openEditBedDetails(bedDetail: BedDetails) {
    console.log(bedDetail);
    this.dialogService
      .open(EditBedDetailsComponent, {
        header: 'Edit Room',
        height: '40vh',
        width: '50%',
        modal: true,
        data: bedDetail,
      })
      .onClose.subscribe((res) => {
        if (res) {
          this.getBedDetailsByRoomId();
        }
      });
  }

  deleteBedDetail(bedDetailId: number) {
    this.utilitiesService
      .confirmDialog(`Are you sure to bed details ${bedDetailId} ?`)
      .then((confirm) => {
        if (confirm) {
          this.subscription.add(
            this.apiService
              .delete(ApiURL.bed_details + '/' + bedDetailId)
              .subscribe(
                (res) => {
                  this.utilitiesService.notifySuccess(
                    `Bed ${bedDetailId} Details deleted`
                  );
                  this.getBedDetailsByRoomId();
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

  openNewBedDetail() {
    this.dialogService
      .open(AddBedDetailsComponent, {
        header: 'Edit Room',
        height: '40vh',
        width: '50%',
        modal: true,
        data: this.roomId
      })
      .onClose.subscribe((res) => {
        if (res) {
          this.getBedDetailsByRoomId();
        }
      });
  }
}
