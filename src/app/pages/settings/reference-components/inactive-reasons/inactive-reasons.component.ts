import { Component, Injectable, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { TableColumn, FieldType } from 'src/app/core/models/table-model/table-column.model';
import { TableParameter, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { TableIconComponent } from 'src/app/pages/shared/table-template/compnents/table-icon/table-icon.component';
import { FilterType } from 'src/app/pages/shared/table-template/modules/table-filter.module';
import { AddRefDataComponent } from '../add-ref-data/add-ref-data.component';

@Component({
  selector: 'app-inactive-reasons',
  templateUrl: './inactive-reasons.component.html',
  styleUrls: ['./inactive-reasons.component.scss']
})

@Injectable({ providedIn: 'root' })

export class InactiveReasonsComponent implements OnInit {
  isLoading: boolean = false;
  tableParam: TableParameter;

  constructor(private dialogService: DialogService,
              private apiService: ApiService,
              private utilitiesService: UtilitiesService ) { }

  ngOnInit(): void {
    this.initTableParam();
  }

  async initTableParam() {
    let param: TableParameter = new TableParameter();
    param.columns = this.initTableColumns();
    param.api = ApiURL.ref_inactive_reason;
    param.withCache = true
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.selectionMode = selectionMode.single
    this.tableParam = param;
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'Name', field: 'name', fieldType: FieldType.string, width: '25%', filter: { filterType: FilterType.string, filterName: 'name' } },
        { title: 'Code', field: 'code', fieldType: FieldType.string, width: '25%', filter: { filterType: FilterType.string, filterName: 'code' } },
        { title: 'Description', field: 'description', fieldType: FieldType.string, width: '45%', filter: { filterType: FilterType.string, filterName: 'description' } },
        { title: 'Action', field: '', fieldType: FieldType.component, width: '5%', specialColumn: TableIconComponent, disableSort: true },        
      ];
      
    return tableColumns;
  }

  addInactiveReason(): Promise<void> {
    localStorage.setItem('REF_NAME', 'INACTIVEREASON');

    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddRefDataComponent, {
        width: '450px', height: 'auto',
        styleClass: 'my-dialog-class',
        header: 'Add Inactive Reason',
        data: {
          data: null,
          type: 'Inactive Reason',
          edit: false
        }
      })
      ref.onClose.subscribe((result) => {
        localStorage.removeItem('REF_NAME');

        if (result) {
          this.tableParam = null
          setTimeout(() => {
            this.initTableParam()
          }, 10);
          resolve()
        } else {
          resolve()
        }
      })
    })
  }
}
