import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { TableColumn, FieldType } from 'src/app/core/models/table-model/table-column.model';
import { TableParameter, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { TableIconComponent } from '../../shared/table-template/compnents/table-icon/table-icon.component';
import { FilterType } from '../../shared/table-template/modules/table-filter.module';
import { EmployeeUpdateComponent } from './employee-update/employee-update.component';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { TableRowMenuComponent } from '../../shared/table-template/compnents/table-row-menu/table-row-menu.component';
import { SecurityAction } from 'src/app/core/models/security-model/security-action.model';
import { ISecurityButton } from 'src/app/core/models/security-model/security-component.model';
import { SecurityEntity } from 'src/app/core/models/security-model/security-entity.model';
import { ButtonPlace, ButtonIcon } from 'src/app/core/models/table-model/table-button.model';
import { TableFunctionArgument } from '../../shared/table-template/modules/table-function.model';
import * as XLSX from 'xlsx';
import { BatchUploadComponent } from './batch-upload/batch-upload.component';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.scss']
})
export class EmployeeMasterComponent implements OnInit {
  tableParam: TableParameter;
  roomtableParam: TableParameter;
  isLoading: boolean = false

  constructor(private dialogService: DialogService,
    private utilityService: UtilitiesService) { }

  ngOnInit(): void {
    localStorage.setItem('FORMNAME', 'EMPLOYEE')
    this.initTableParam()
  }

  async initTableParam() {
    let param: TableParameter = new TableParameter();
    param.api = ApiURL.employee_master
    param.dataKey = 'id'
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.columns = this.initTableColumns();
    param.selectionMode = selectionMode.single
    param.showToggler = false
    param.scrollHeight = "35vh"
    param.onRowSelected = this.onRowSelected
    this.tableParam = param;
     param.buttons = this.initTableButtons();
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'Badge No', field: 'badgeNo', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'badgeNo' } },
        { title: '', field: '', fieldType: FieldType.component1, specialColumn: TableRowMenuComponent, disableSort: true },
        { title: 'Employee Name', field: 'employeeName', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'employeeName' } },
        { title: 'Job Title', field: 'jobTitle', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'jobTitle' } },
        { title: 'Nationality', field: 'nationality', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'nationality' } },
        { title: 'Category', field: 'category', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'category' } },
        { title: 'Contract Category', field: 'contractBase', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'contractBase' } },
        { title: 'Band', field: 'band', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'band' } },
        { title: 'Eqv Band', field: 'eqvBand', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'eqvBand' } },
        { title: 'Project', field: 'project', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'project' } },
        { title: 'Company', field: 'company', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'company' } },
        { title: 'Work Location', field: 'workLocation', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'workLocation' } },
        { title: 'Mess Entitlment', field: 'messEntitlment', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'messEntitlment' } },
        { title: 'Meal Category', field: 'mealCategory', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'mealCategory' } },
        { title: 'Meal Type', field: 'mealType', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'mealType' } },
        { title: 'Religion', field: 'religion', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'religion' } },
        { title: 'Active', field: 'employeeActive', fieldType: FieldType.boolean, filter: { filterType: FilterType.boolean, filterName: 'employeeActive' } },
        { title: 'Inactive Reason', field: 'inactiveReason', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'inactiveReason' } },
        { title: 'Passport No', field: 'passportNo', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'passportNo' } },
        { title: 'QID No', field: 'qidNo', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'qidNo' } },
        { title: 'Mobile No', field: 'mobileNo', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'mobileNo' } },
        { title: 'Email', field: 'email', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'email' } },
        { title: 'Mess Card', field: 'messCard', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'messCard' } },
        { title: 'Milk Card', field: 'milkCard', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'milkCard' } },


        // isCcc: null,
      ];
    return tableColumns;
  }

  initTableButtons(): ISecurityButton[] {
    let tableButtons: ISecurityButton[] =
      [
        { title: 'Export Data', place: ButtonPlace.header, icon: ButtonIcon.downloaod, customFunction: this.exportData, disabled: false, class: "mr-2", entity: [SecurityEntity.settings], action: SecurityAction.read, hasPermission: true },
        // { title: 'Export All', place: ButtonPlace.header, icon: ButtonIcon.downloaod, customFunction: this.onRowSelected, disabled: false, class: "mr-2", entity: [SecurityEntity.settings], action: SecurityAction.read, hasPermission: true },
      ]
    return tableButtons;
  }

  onRowSelected = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.roomtableParam = null;
      setTimeout(() => {
        this.initRoomTableParam();
      }, 20);

      resolve();
    });
  }

  //Room Transaction History
  async initRoomTableParam() {
    let param: TableParameter = new TableParameter();
    // if (query) { query = "&" + query }
    // param.api = ApiURL.documentss + "?fileType.notEquals=FOLDER&" + "path.contains=Production&" + query
    // param.defaultFilter = new Map<any, any>([['fileType', '']])
    param.api = ApiURL.booking
    param.dataKey = 'id'
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.columns = this.initRoomTableColumns();
    param.selectionMode = selectionMode.single
    param.showToggler = false
    param.scrollHeight = "35vh"
    param.onRowSelected = this.onRowSelected
    this.roomtableParam = param;
  }

  initRoomTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'Room No', field: 'roomNo', fieldType: FieldType.component, width: '15%' },
        { title: 'Check-In-Date', field: 'CheckInDate', fieldType: FieldType.date, width: '15%' },
        { title: 'Check-Out-Date', field: 'CheckInDate', fieldType: FieldType.date, width: '15%' },
        { title: 'Leave From', field: 'LeaveStartDt', fieldType: FieldType.date, width: '15%' },
        { title: 'Leave Till', field: 'LeaveEndDt', fieldType: FieldType.date, width: '15%' },
        { title: 'Status', field: 'GuestStatus', fieldType: FieldType.string, width: '25%' },
      ];
    return tableColumns;
  }


  addNewEmployee() {
    this.dialogService.open(EmployeeUpdateComponent, {
      header: "Add Employee",
      width: "80vw",
      height: "75vh"
    }).onClose.subscribe(res => {
      this.tableParam = null;

      setTimeout(() => {
        this.initTableParam()
      }, 20);

      // if (res) {

      // }
    })
  }

  batchUpload() {
    this.dialogService.open(BatchUploadComponent, {
      header: "Employee - Batch Update",
      width: "80vw",
      height: "85vh"
    }).onClose.subscribe(res => {
      this.tableParam = null;

      setTimeout(() => {
        this.initTableParam()
      }, 20);
      // if (res) {


      // }
    })
  }

  downloadTemplate() {

    this.utilityService.downloadTemplate('Employee_Template');

  }

  exportData = (args: TableFunctionArgument): Promise<any> => {
    return new Promise(async (resolve, reject) => {

      let arr = [];
      this.isLoading = true;
      args.data.forEach((e) => {
        let obj = {
          "Badge No": e.badgeNo,
          "Employee Name": e.employeeName,
          "Job Title": e.jobTitle,
          "Nationality": e.nationality,
          "Category": e.category,
          "Contract Base": e.contractBase,
          "Band": e.band,
          "Eqv Band": e.eqvBand,
          "Project": e.project,
          "CCC Employee": e.isCcc,
          "Company": e.company,
          "Work Location": e.workLocation,
          "Mess Entitlment": e.messEntitlment,
          "Meal Category": e.mealCategory,
          "Meal Type": e.mealType,
          "Religion": e.reject,
          "Active": e.employeeActive,
          "Inactive Reason": e.inactiveReason,
          "Mobile No": e.mobileNo,
          "Passport No": e.passportNo,
          "QID No": e.qidNo,
          "Email": e.email,
          "Mess Card": e.messCard,
          "Milk Card": e.milkCard,
        };

        arr.push(obj);
      })

      this.utilityService.exportAsExcelFile(arr, "Employee")
      this.isLoading = false;
      this.utilityService.notifySuccess('Employee Data Exported Successfully');
 
      // this.addDataToExcel(arr);
      resolve(args);
    })
  }


  // //Excel Export Data
  // addDataToExcel(data: any[]): void {
  //   const templatePath = 'assets/Employee_Template.xlsx';

  //   fetch(templatePath)
  //     .then(response => response.arrayBuffer())
  //     .then(arrayBuffer => {
  //       const dataBuffer = new Uint8Array(arrayBuffer);
  //       const workbook = XLSX.read(dataBuffer, { type: 'array' });

  //       // Assuming the first sheet is the target
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];

  //       console.log(data)

  //       // Convert data to worksheet format
  //       const excelData = this.convertDataToWorksheet(data);

  //       // Append data to worksheet
  //       const range = XLSX.utils.decode_range(worksheet['!ref']);
  //       XLSX.utils.sheet_add_json(worksheet, excelData, { skipHeader: true, origin: range.e.r });

  //       // Write the updated workbook to a new Excel file
  //       const updatedBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //       this.saveExcelFile(updatedBuffer, 'updatedData.xlsx');

  //       // this.utilityService.saveAsExcelFile(updatedBuffer, 'updatedData.xlsx')
  //     });
  // }

  // private convertDataToWorksheet(data: any[]): any[] {
  //   // Convert your data to match the Excel template columns
  //   return data.map(item => ({
  //     'Column1': item.Badge_No,
  //     'Column2': item.Employee_Name,
  //   }));
  // }

  // private saveExcelFile(buffer: any, fileName: string): void {
  //   const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = fileName;
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // }

}
