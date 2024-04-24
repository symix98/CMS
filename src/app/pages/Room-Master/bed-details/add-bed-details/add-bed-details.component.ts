import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { BedDetails } from 'src/app/core/models/bed-details.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-add-bed-details',
  templateUrl: './add-bed-details.component.html',
  styleUrls: ['./add-bed-details.component.scss'],
})
export class AddBedDetailsComponent implements OnInit {
  bedDetail: BedDetails = new BedDetails();
  subscription = new Subscription();

  constructor(
    public config: DynamicDialogConfig,
    private apiService: ApiService,
    private utilitiesService: UtilitiesService,
    private ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {}

  save() {
    if (!this.hasEmptyFields()) {
      let bedDetailsObject = {
        bedNo: this.bedDetail.bedNo,
        bedStatus: this.bedDetail.bedStatus,
        remarks: this.bedDetail.remarks,
        roomDetails: {id: this.config.data}
      }
      console.log(bedDetailsObject);
      this.subscription.add(
        this.apiService.post(ApiURL.bed_details, bedDetailsObject).subscribe(
          (res) => {
            this.utilitiesService.notifySuccess('Bed Details Added');
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
    let bedDetailsToCheck = { ...this.bedDetail };
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
