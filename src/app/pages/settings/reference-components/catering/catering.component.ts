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
  selector: 'app-catering',
  templateUrl: './catering.component.html',
  styleUrls: ['./catering.component.scss']
})

@Injectable({ providedIn: 'root' })

export class CateringComponent implements OnInit {
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
    param.api = ApiURL.catering;
    param.withCache = true
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.selectionMode = selectionMode.single
    this.tableParam = param;
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'Catering Name', field: 'cateringName', fieldType: FieldType.string, width: '25%', filter: { filterType: FilterType.string, filterName: 'cateringName' } },
        { title: 'Location', field: 'location', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'location' } },
        { title: 'Category', field: 'messCategory', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'messCategory' } },
        { title: 'Rate', field: 'rate', fieldType: FieldType.number, width: '10%', filter: { filterType: FilterType.number, filterName: 'rate' } },
        {
          title: 'Upgraded Rate', field: 'upgradedRate', fieldType: FieldType.object, width: '10%', objectReference: row => row["upgradedRate"].toFixed(2),
          filter: { filterName: "upgradedRate", filterType: FieldType.number }
        },
        { title: 'Description', field: 'description', fieldType: FieldType.string, width: '20%', filter: { filterType: FilterType.string, filterName: 'description' } },
        { title: 'Action', field: '', fieldType: FieldType.component, width: '5%', specialColumn: TableIconComponent, disableSort: true },        
      ];
      
    return tableColumns;
  }

  addCatering(): Promise<void> {
    localStorage.setItem('REF_NAME', 'CATERING');

    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddRefDataComponent, {
        width: '450px', height: 'auto',
        styleClass: 'my-dialog-class',
        header: 'Add Catering',
        data: {
          data: null,
          type: 'Catering',
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
