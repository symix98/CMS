import { Component, Injectable, OnInit } from '@angular/core';
import { AddRefDataComponent } from '../add-ref-data/add-ref-data.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { TableColumn, FieldType } from 'src/app/core/models/table-model/table-column.model';
import { TableParameter, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { TableIconComponent } from 'src/app/pages/shared/table-template/compnents/table-icon/table-icon.component';
import { FilterType } from 'src/app/pages/shared/table-template/modules/table-filter.module';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})

@Injectable({ providedIn: 'root' })

export class CompanyComponent implements OnInit {
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
    param.api = ApiURL.ref_company;
    param.withCache = true
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.selectionMode = selectionMode.single
    this.tableParam = param;
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'Company Name', field: 'companyName', fieldType: FieldType.string, width: '25%', filter: { filterType: FilterType.string, filterName: 'companyName' } },
        { title: 'Location', field: 'location', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'location' } },
        { title: 'Services', field: 'servicesProvided', fieldType: FieldType.string, width: '25%', filter: { filterType: FilterType.string, filterName: 'servicesProvided' } },
        { title: 'Contact Person', field: 'contactPerson', fieldType: FieldType.string, width: '10%', filter: { filterType: FilterType.string, filterName: 'contactPerson' } },
        { title: 'Contact No', field: 'contactNo', fieldType: FieldType.string, width: '10%', filter: { filterType: FilterType.string, filterName: 'contactNo' } },
        { title: 'Contact Email', field: 'contactEmail', fieldType: FieldType.string, width: '10%', filter: { filterType: FilterType.string, filterName: 'contactEmail' } },
        { title: 'Action', field: '', fieldType: FieldType.component, width: '5%', specialColumn: TableIconComponent, disableSort: true },        
      ];
      
    return tableColumns;
  }

  addCompany(): Promise<void> {
    localStorage.setItem('REF_NAME', 'COMPANY');

    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddRefDataComponent, {
        width: '450px', height: 'auto',
        styleClass: 'my-dialog-class',
        header: 'Add Company',
        data: {
          data: null,
          type: 'Company',
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
