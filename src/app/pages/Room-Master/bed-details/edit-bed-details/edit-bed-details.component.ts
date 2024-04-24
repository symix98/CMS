import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { BedDetails } from 'src/app/core/models/bed-details.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-edit-bed-details',
  templateUrl: './edit-bed-details.component.html',
  styleUrls: ['./edit-bed-details.component.scss'],
})
export class EditBedDetailsComponent implements OnInit {
  selectedBed: BedDetails = new BedDetails();

  subscription = new Subscription();

  constructor(
    public config: DynamicDialogConfig,
    private apiService: ApiService,
    private utilitiesService: UtilitiesService,
    private ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    if (this.config.data) {
      console.log(this.config.data);
      this.selectedBed = this.config.data;
    }
  }

  save() {
    if (!this.hasEmptyFields()) {
      this.subscription.add(
        this.apiService
          .put(ApiURL.bed_details + '/' + this.selectedBed.id, this.selectedBed)
          .subscribe(
            (res) => {
              this.utilitiesService.notifySuccess(`Bed ${this.selectedBed.id} Details Saved`);
              this.ref.close(true);
            },
            (err) => {
              this.utilitiesService.notifyError('Could not perform operation!');
              throw new Error('Could not perform operation!');
            }
          )
      );
    }
  }

  hasEmptyFields(): boolean {
    let bedDetailsToCheck = { ...this.selectedBed };
    delete bedDetailsToCheck.remarks;
    for (const key of Object.keys(bedDetailsToCheck)) {
      if (
        bedDetailsToCheck[key] === null ||
        bedDetailsToCheck[key] < 0 ||
        bedDetailsToCheck[key] === ''
      ) {
        return true;
      }
    }
    return false;
  }
}
