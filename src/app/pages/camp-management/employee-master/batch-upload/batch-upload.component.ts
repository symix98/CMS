import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { Employee } from 'src/app/core/models/employee.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-batch-upload',
  templateUrl: './batch-upload.component.html',
  styleUrls: ['./batch-upload.component.scss']
})
export class BatchUploadComponent implements OnInit {
  currentUser: any;
  employeeForm: any = [];
  employeeCols: any[] = [];
  empData: any[] = [];
  isDisabled: boolean = false;
  isImportDisabled: boolean = false;
  editingTable: boolean;
  isEditedEmployee: boolean = false;

  nationalityList: any[] = [];
  empCategoryList: any[] = [];
  contractBaseList: any[] = [];
  bandList: any[] = [];
  eqvBandList: any[] = [];
  projectList: any[] = [];
  companyList: any[] = [];
  workLocationList: any[] = [];
  messEntitleList: any[] = [];
  mealCategoryList: any[] = [];
  mealTypeList: any[] = [];
  religionList: any[] = [];
  inactiveReasonList: any[] = [];

  selectedNationality: string = "INDIAN";
  selectedEmpCategory: string;
  selectedContractBase: string;
  selectedBand: string;
  selectedEqvBand: string;
  selectedProject: string;
  selectedCompany: string;
  selectedWorkLoc: string;
  selectedMessEntitle: string;
  selectedMealCategory: string;
  selectedMealType: string;
  selectedReligion: string;
  selectedInactiveReason: string;

  constructor(private utilitiesService: UtilitiesService,
    private apiService: ApiService,
    private dialogRef: DynamicDialogRef) { }

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.utilitiesService.getCurrentAppUser();

    setTimeout(() => {
      this.getReferenceDetails();
    }, 20);

    this.employeeCols = [
      { header: 'Badge No', field: 'badgeNo', type: 'string' },
      { header: 'Employee Name', field: 'employeeName', type: 'string' },
      { header: 'Job Title', field: 'jobTitle', type: 'string' },
      { header: 'Nationality', field: 'nationality', type: 'dropdown' },
      { header: 'Category', field: 'category', type: 'dropdown' },
      { header: 'Contract Base', field: 'contractBase', type: 'dropdown' },
      { header: 'Band', field: 'band', type: 'dropdown' },
      { header: 'Eqv Band', field: 'eqvBand', type: 'dropdown' },
      { header: 'Project', field: 'project', type: 'dropdown' },
      { header: 'CCC Employee', field: 'isCcc', type: 'checkbox' },
      { header: 'Company', field: 'company', type: 'dropdown' },
      { header: 'Work Location', field: 'workLocation', type: 'dropdown' },
      { header: 'Mess Entitlment', field: 'messEntitlment', type: 'dropdown' },
      { header: 'Meal Category', field: 'mealCategory', type: 'dropdown' },
      { header: 'Meal Type', field: 'mealType', type: 'dropdown' },
      { header: 'Religion', field: 'religion', type: 'dropdown' },
      { header: 'Active', field: 'employeeActive', type: 'checkbox' },
      { header: 'Inactive Reason', field: 'inactiveReason', type: 'dropdown' },
      { header: 'Mobile No', field: 'mobileNo', type: 'string' },
      { header: 'Passport No', field: 'passportNo', type: 'string' },
      { header: 'QID No', field: 'qidNo', type: 'string' },
      { header: 'Email', field: 'email', type: 'string' },
      { header: 'Mess Card', field: 'messCard', type: 'string' },
      { header: 'Milk Card', field: 'milkCard', type: 'string' },
    ];
  }

  saveEmployeeData() {
    this.utilitiesService.confirmDialog("Are you sure to save Employee Details ?").then((confirm) => {
      if (confirm) {
        let currentdate = new Date()
        let query: ApiQuery = new ApiQuery();

        for (let i = 0; i < this.employeeForm.length; i++) {
          query.filter = new Map<any, any>([['badgeNo', this.employeeForm[i].badgeNo]])

          this.apiService.get(ApiURL.employee_master, query).subscribe(res => {
            if (res.length) {
              console.log("aaa")
              console.log(res)
              let newObject = {
                id: res[0].id,
                modifyBy: this.currentUser.name,
                modifyAt: currentdate
              };

              let finalObject  = {
                ...this.employeeForm[i],
                ...newObject
              };

          
              this.apiService.patch(ApiURL.employee_master + '/' + res[0].id, finalObject).subscribe(resEdit => {
                if (resEdit) {
                  
                }
              }, (err) => {
                this.utilitiesService.notifyError('Something Wrong Happend!')
              })

            } else {

              let newObject  = {
                ...this.employeeForm[i],
                createdBy: this.currentUser.name,
                createdAt: currentdate,
                modifyBy: this.currentUser.name,
                modifyAt: currentdate
              };

              delete newObject.id;

              this.apiService.post(ApiURL.employee_master, newObject).subscribe(resDet => {
                if (res) {
                }
              }, (err) => {
                this.utilitiesService.notifyError('Something Wrong Happened.');
              })
            }


          }, (err) => {
            this.utilitiesService.notifyError("Something went wrong!")
          })

        }

        this.utilitiesService.notifySuccess('Employee Details Updated Successfully!');
        this.dialogRef.close();
      }


    })
  }

  clearImportData() {

    this.utilitiesService.confirmDialog("Are you sure to cancel your changes?").then((confirm) => {
      if (confirm) {

        this.employeeForm = [];
        this.onFileChange(null)

        this.isImportDisabled = false;
        this.isDisabled = true;
      } else {

      }
    })
  }

  onFileChange(event: any): void {

    if (event != null) {
      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>event.target;
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      const reader: FileReader = new FileReader();
      reader.onload = async (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        let data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        setTimeout(async () => {
          // this.addMissingDocuments(data.length);
          this.populateDocumentInputFields(data);
        }, 10);
      };
      reader.readAsBinaryString(target.files[0]);
    }

  }

  populateDocumentInputFields(data: any) {
    console.log(data);
    // this.saveDataInSessionStorage();

    for (let i = 1; i < data.length; i++) {
      let empDetails = {
        id: i - 1,
        badgeNo: data[i][0],
        employeeName: data[i][1],
        jobTitle: data[i][2],
        nationality: data[i][3],
        category: data[i][4],
        contractBase: data[i][5],
        band: data[i][6],
        eqvBand: data[i][7],
        project: data[i][8],
        isCcc: data[i][9],
        company: data[i][10],
        workLocation: data[i][11],
        messEntitlment: data[i][12],
        mealCategory: data[i][13],
        mealType: data[i][14],
        reject: data[i][15],
        employeeActive: data[i][16],
        inactiveReason: data[i][17],
        mobileNo: data[i][18],
        passportNo: data[i][19],
        qidNo: data[i][20],
        email: data[i][21],
        messCard: data[i][22],
        milkCard: data[i][23],
      };



      this.employeeForm.push(empDetails)
      this.isImportDisabled = true;

      // this.employeeForm[i - 1].badgeNo = data[i][0];
      // this.employeeForm[i - 1].employeeName =
      //   data[i][1] == undefined ? null : data[i][1];

      // this.employeeForm[i - 1].revisionDate =
      //   this.convertExcelDateToJSDate(data[i][2]).toDateString() ==
      //   'Invalid Date'
      //     ? null
      //     : this.convertExcelDateToJSDate(data[i][2]);
      // this.employeeForm[i - 1].version =
      //   data[i][3] == undefined ? null : data[i][3];
      // this.employeeForm[i - 1].fileType =
      //   data[i][4] == undefined ? null : data[i][4];
      // this.employeeForm[i - 1].title =
      //   data[i][5] == undefined ? null : data[i][5];
      // this.employeeForm[i - 1].phase =
      //   data[i][6] == undefined ? null : data[i][6];
      // this.employeeForm[i - 1].classes =
      //   data[i][7] == undefined ? null : data[i][7];
      // this.employeeForm[i - 1].documentsFor =
      //   data[i][8] == undefined ? null : data[i][8];
      // this.employeeForm[i - 1].initiatedBy =
      //   data[i][9] == undefined ? null : data[i][9];
      // this.employeeForm[i - 1].disciplines =
      //   data[i][10] == undefined ? null : data[i][10];
      // this.employeeForm[i - 1].receiveDate =
      //   this.convertExcelDateToJSDate(data[i][11]).toDateString() ==
      //   'Invalid Date'
      //     ? null
      //     : this.convertExcelDateToJSDate(data[i][11]);
      // this.employeeForm[i - 1].replyRequired =
      //   data[i][12] == undefined ? null : data[i][12];
      // this.employeeForm[i - 1].replyRequiredBy =
      //   this.convertExcelDateToJSDate(data[i][13]).toDateString() ==
      //   'Invalid Date'
      //     ? null
      //     : this.convertExcelDateToJSDate(data[i][13]);
      // this.employeeForm[i - 1].repliedDate =
      //   this.convertExcelDateToJSDate(data[i][14]).toDateString() ==
      //   'Invalid Date'
      //     ? null
      //     : this.convertExcelDateToJSDate(data[i][14]);
      // this.employeeForm[i - 1].tqStatus =
      //   data[i][15] == undefined ? null : data[i][15];
      // this.employeeForm[i - 1].path = localStorage.getItem('filePath');
      // this.employeeForm[i - 1].workflow =
      //   data[i][17] == undefined ? null : data[i][17];
      // this.employeeForm[i - 1].currentStep =
      //   data[i][18] == undefined ? null : data[i][18];
      // this.employeeForm[i - 1].ssize =
      //   data[i][19] == undefined ? null : data[i][19];
      // this.employeeForm[i - 1].isTransmitted =
      //   data[i][20] == undefined ? null : data[i][20];
      // this.employeeForm[i - 1].sstatus =
      //   data[i][21] == undefined ? null : data[i][21];
      // this.employeeForm[i - 1].confidential =
      //   data[i][22] == undefined ? null : data[i][22];
      // this.employeeForm[i - 1].additionalReference =
      //   data[i][23] == undefined ? null : data[i][23];
      // this.employeeForm[i - 1].reviewStatus =
      //   data[i][24] == undefined ? null : data[i][24];
      // this.employeeForm[i - 1].modelReference =
      //   data[i][25] == undefined ? null : data[i][25];
      // this.employeeForm[i - 1].createdBy = this.currentUser?.name;
      // this.employeeForm[i - 1].dateModified = new Date();
      // this.employeeForm[i - 1].relatedItems =
      //   data[i][28] == undefined ? null : data[i][28];
      // this.employeeForm[i - 1].accessLevel =
      //   data[i][29] == undefined ? null : data[i][29];
      // this.employeeForm[i - 1].csiSpecCode =
      //   data[i][30] == undefined ? null : data[i][30];
      // this.employeeForm[i - 1].current =
      //   data[i][31] == undefined ? null : data[i][31];
      // this.employeeForm[i - 1].facilityCode =
      //   data[i][32] == undefined ? null : data[i][32];
      // this.employeeForm[i - 1].fileName =
      //   data[i][33] == undefined ? null : data[i][33];
      // this.employeeForm[i - 1].forecastSubmToClient =
      //   this.convertExcelDateToJSDate(data[i][34]).toDateString() ==
      //   'Invalid Date'
      //     ? null
      //     : this.convertExcelDateToJSDate(data[i][34]);
      // this.employeeForm[i - 1].jobNumber =
      //   data[i][35] == undefined ? null : data[i][35];
      // this.employeeForm[i - 1].lock =
      //   data[i][36] == undefined ? null : data[i][36];
      // this.employeeForm[i - 1].lastModifiedDate =
      //   this.convertExcelDateToJSDate(data[i][37]).toDateString() ==
      //   'Invalid Date'
      //     ? null
      //     : this.convertExcelDateToJSDate(data[i][37]);
      // this.employeeForm[i - 1].milestone =
      //   data[i][38] == undefined ? null : data[i][38];
      // this.employeeForm[i - 1].numberOfMarkups =
      //   data[i][39] == undefined ? null : data[i][39];
      // this.employeeForm[i - 1].activityId =
      //   data[i][40] == undefined ? null : data[i][40];
      // this.employeeForm[i - 1].plannedSubmissionDate =
      //   this.convertExcelDateToJSDate(data[i][41]).toDateString() ==
      //   'Invalid Date'
      //     ? null
      //     : this.convertExcelDateToJSDate(data[i][41]);
      // this.employeeForm[i - 1].printSize =
      //   data[i][42] == undefined ? null : data[i][42];
      // this.employeeForm[i - 1].purchaseOrder =
      //   data[i][43] == undefined ? null : data[i][43];
      // this.employeeForm[i - 1].remarks =
      //   data[i][44] == undefined ? null : data[i][44];
      // this.employeeForm[i - 1].reviewSource =
      //   data[i][45] == undefined ? null : data[i][45];

    }

    console.log(this.employeeForm)
  }

  convertExcelDateToJSDate(excelDateSerial: number): Date {
    const millisecondsInOneDay = 24 * 60 * 60 * 1000;
    const excelStartDate = new Date('1899-12-30T00:00:00Z');
    const jsDate = new Date(
      excelStartDate.getTime() + excelDateSerial * millisecondsInOneDay
    );
    return jsDate;
  }


  closeDialog() {
    this.saveDataInSessionStorage();
    this.dialogRef.close();

    // const documentBody = { ...this.employeeForm };
    // if (!this.isEditedEmployee) {
    //   documentBody.revision = '';
    //   documentBody.revisionDate = null;
    //   documentBody.version = '';
    // }
    // documentBody.path = localStorage.getItem('filePath');
    // this.treeDataSourceService.isClosedNewFileDialog.next(documentBody);
  }

  onRowEditInit() {
    this.editingTable = true;
    this.isDisabled = true;
  }

  onRowEditSave() {
    this.editingTable = false;
    this.isEditedEmployee = true;
    this.isDisabled = false;

    this.saveDataInSessionStorage();
  }

  onRowDelete(document: any) {
    console.log(document);
    let docs = JSON.parse(sessionStorage.getItem('docList')) as Array<any>;
    docs = docs.filter((doc) => {
      return doc.docno !== document.documentsNumber;
    });
    sessionStorage.removeItem('docList');
    sessionStorage.setItem('docList', JSON.stringify(docs));

    console.log(JSON.parse(sessionStorage.getItem('docList')));
  }

  onRowEditCancel() {
    this.editingTable = false;
    this.isDisabled = false;
  }

  async deleteEmployee(employee: any) {
    const confirm = await this.utilitiesService.confirmDialog(
      'Are you sure to delete?'
    );
    if (confirm) {
      this.employeeForm = this.employeeForm.filter((emp) => {
        return emp.id !== employee.id;
      });
      this.saveDataInSessionStorage();
    }
  }


  saveDataInSessionStorage() {
    sessionStorage.setItem(
      'EmployeeDetails',
      JSON.stringify(this.employeeForm)
    );
  }

  selectOptionsArrayforEditDocument(fieldName: string): any {
    switch (fieldName) {
      case 'nationality':
        return this.nationalityList;
        console.log(this.nationalityList)
        break;
      case 'category':
        return this.empCategoryList;
        break;
      case 'contractBase':
        return this.contractBaseList;
        break;
      case 'band':
        return this.bandList;
        break;
      case 'eqvBand':
        return this.eqvBandList;
        break;
      case 'project':
        return this.projectList;
        break;
      case 'company':
        return this.companyList;
        break;
      case 'workLocation':
        return this.workLocationList;
        break;
      case 'messEntitlment':
        return this.messEntitleList;
        break;
      case 'mealCategory':
        return this.mealCategoryList;
        break;
      case 'mealType':
        return this.mealTypeList;
        break;
      case 'religion':
        return this.religionList;
        break;
      case 'inactiveReason':
        return this.inactiveReasonList;
        break;
      default:
        break;
    }
  }

  async getReferenceDetails() {
    let query: ApiQuery = new ApiQuery();
    query.size = 20000;

    //Nationiality
    this.apiService.get(ApiURL.ref_nationality, query).subscribe(res => {
      this.nationalityList = res
      console.log(this.nationalityList)
    }, (err) => {
      this.utilitiesService.notifyError("Something went wrong!")
    })

    //Projects
    this.apiService.get(ApiURL.ref_project, query).subscribe(res => {
      this.projectList = res
    }, (err) => {
      this.utilitiesService.notifyError("Something went wrong!")
    })

    //Employee Company
    this.apiService.get(ApiURL.ref_employee_company, query).subscribe(res => {
      this.companyList = res
    }, (err) => {
      this.utilitiesService.notifyError("Something went wrong!")
    })

    //Inactive Reason
    this.apiService.get(ApiURL.ref_inactive_reason, query).subscribe(res => {
      this.inactiveReasonList = res
    }, (err) => {
      this.utilitiesService.notifyError("Something went wrong!")
    })


    this.empCategoryList = [
      { id: 1, code: 'SENIOR', name: 'SENIOR' },
      { id: 2, code: 'JUNIOR', name: 'JUNIOR' },
      { id: 3, code: 'LABOR', name: 'LABOR' },
    ];

    this.contractBaseList = [
      { label: 'MONTHLY', name: 'MONTHLY' },
      { label: 'DAILY', name: 'DAILY' },
    ];

    this.bandList = [
      { label: '04', name: '04' },
      { label: '05', name: '05' },
      { label: '06', name: '06' },
      { label: '07', name: '07' },
      { label: '08', name: '08' },
      { label: '09', name: '09' },
      { label: '10', name: '10' },
      { label: '11', name: '11' },
      { label: '12', name: '12' },
      { label: '13', name: '13' },
      { label: '14', name: '14' },
      { label: '15', name: '15' },
      { label: 'U/C', name: 'U/C' },
      { label: 'L/S', name: 'L/S' },
      { label: 'DAILY', name: 'DAILY' },
    ];

    this.eqvBandList = [
      { label: '04', name: '04' },
      { label: '05', name: '05' },
      { label: '06', name: '06' },
      { label: '07', name: '07' },
      { label: '08', name: '08' },
      { label: '09', name: '09' },
      { label: '10', name: '10' },
      { label: '11', name: '11' },
      { label: '12', name: '12' },
      { label: '13', name: '13' },
      { label: '14', name: '14' },
      { label: '15', name: '15' },
      { label: '99', name: '99' },
    ];

    this.messEntitleList = [
      { label: 'MGT', name: 'MGT' },
      { label: 'SNR', name: 'SNR' },
      { label: 'JNR', name: 'JNR' },
      { label: 'C/H', name: 'C/H' },
      { label: 'LBR', name: 'LBR' },
    ];

    this.mealCategoryList = [
      { label: 'ARAB', name: 'ARAB' },
      { label: 'INDIAN', name: 'INDIAN' },
      { label: 'FILIPINO', name: 'FILIPINO' },
      { label: 'PAKISTANI', name: 'PAKISTANI' },
      { label: 'SRILANKAN', name: 'SRILANKAN' },
      { label: 'BANGLADESHI', name: 'BANGLADESHI' },
      { label: 'OTHER', name: 'OTHER' },
    ];

    this.mealTypeList = [
      { label: 'NON-VEG', name: 'NON-VEG' },
      { label: 'VEG', name: 'VEG' },
    ];

    this.workLocationList = [
      { label: 'CAMP', name: 'CAMP' },
      { label: 'SITE', name: 'SITE' },
      { label: 'OFFICE', name: 'OFFICE' },
      { label: 'OTHER', name: 'OTHER' },
    ];

    this.religionList = [
      { label: 'MUSLIM', name: 'MUSLIM' },
      { label: 'CHRISTIAN', name: 'CHRISTIAN' },
      { label: 'HINDUISM', name: 'HINDUISM' },
      { label: 'BUDDHISM', name: 'BUDDHISM' },
      { label: 'SIKHISM', name: 'SIKHISM' },
      { label: 'OTHER', name: 'OTHER' },
    ];
  }
}
