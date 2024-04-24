import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { Employee } from 'src/app/core/models/employee.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee-update.component.scss']
})
export class EmployeeUpdateComponent implements OnInit {
  currentUser: any;
  isSubmitted: boolean = false;
  isUpdate: boolean = false;
  buttonLabel: string = "Save Data"
  buttonIcon: string = "pi pi-save"

  jobTitleList: any[] = [];
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

  selectedJobTitle: string;
  selectedNationality: string;
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

  stateOptions: any[];

  employeeForm: Employee = new Employee();

  constructor(private dialogRef: DynamicDialogRef,
    private apiService: ApiService,
    private utilitiesService: UtilitiesService,
    private dynamicDialogConfig: DynamicDialogConfig) { }

  async ngOnInit(): Promise<void> {
    setTimeout(() => {
      this.getReferenceDetails();
    }, 20);

    this.currentUser = await this.utilitiesService.getCurrentAppUser()
    this.stateOptions = [{ label: 'CCC', value: true }, { label: 'Subcontractor', value: false }];

    if (this.dynamicDialogConfig.data.edit == true) {
      this.isUpdate = true;
      this.buttonLabel = "Update"
      this.buttonIcon = "pi pi-check"

      console.log(this.dynamicDialogConfig.data.data)

      if (this.dynamicDialogConfig.data.data.nationality) { this.selectedNationality = this.dynamicDialogConfig.data.data.nationality };
      if (this.dynamicDialogConfig.data.data.category) { this.selectedEmpCategory = this.dynamicDialogConfig.data.data.category };
      if (this.dynamicDialogConfig.data.data.contractBase) { this.selectedContractBase = this.dynamicDialogConfig.data.data.contractBase };
      if (this.dynamicDialogConfig.data.data.band) { this.selectedBand = this.dynamicDialogConfig.data.data.band };
      if (this.dynamicDialogConfig.data.data.eqvBand) { this.selectedEqvBand = this.dynamicDialogConfig.data.data.eqvBand };
      if (this.dynamicDialogConfig.data.data.project) { this.selectedProject = this.dynamicDialogConfig.data.data.project };
      if (this.dynamicDialogConfig.data.data.company) { this.selectedCompany = this.dynamicDialogConfig.data.data.company };
      if (this.dynamicDialogConfig.data.data.workLocation) { this.selectedWorkLoc = this.dynamicDialogConfig.data.data.workLocation };
      if (this.dynamicDialogConfig.data.data.messEntitlment) { this.selectedMessEntitle = this.dynamicDialogConfig.data.data.messEntitlment };
      if (this.dynamicDialogConfig.data.data.mealCategory) { this.selectedMealCategory = this.dynamicDialogConfig.data.data.mealCategory };
      if (this.dynamicDialogConfig.data.data.mealType) { this.selectedMealType = this.dynamicDialogConfig.data.data.mealType };
      if (this.dynamicDialogConfig.data.data.religion) { this.selectedReligion = this.dynamicDialogConfig.data.data.religion };
      if (this.dynamicDialogConfig.data.data.inactiveReason) { this.selectedInactiveReason = this.dynamicDialogConfig.data.data.inactiveReason };

      this.employeeForm.badgeNo = this.dynamicDialogConfig.data.data.badgeNo;
      this.employeeForm.employeeName = this.dynamicDialogConfig.data.data.employeeName;
      this.employeeForm.jobTitle = this.dynamicDialogConfig.data.data.jobTitle;
      this.employeeForm.isCcc = this.dynamicDialogConfig.data.data.isCcc;
      this.employeeForm.employeeActive = this.dynamicDialogConfig.data.data.employeeActive;
      this.employeeForm.passportNo = this.dynamicDialogConfig.data.data.passportNo;
      this.employeeForm.qidNo = this.dynamicDialogConfig.data.data.qidNo;
      this.employeeForm.mobileNo = this.dynamicDialogConfig.data.data.mobileNo;
      this.employeeForm.email = this.dynamicDialogConfig.data.data.email;
      this.employeeForm.messCard = this.dynamicDialogConfig.data.data.messCard;
      this.employeeForm.milkCard = this.dynamicDialogConfig.data.data.milkCard;

    }

  }

  saveEmployeeDetails() {
    let currentdate = new Date()
    currentdate.setHours(currentdate.getHours() + 3)

    this.employeeForm.nationality = this.selectedNationality;
    this.employeeForm.category = this.selectedEmpCategory;
    this.employeeForm.contractBase = this.selectedContractBase;
    this.employeeForm.band = this.selectedBand;
    this.employeeForm.eqvBand = this.selectedEqvBand == null ? "" : this.selectedEqvBand;
    this.employeeForm.project = this.selectedProject;
    this.employeeForm.company = this.selectedCompany;
    this.employeeForm.workLocation = this.selectedWorkLoc;
    this.employeeForm.messEntitlment = this.selectedMessEntitle;
    this.employeeForm.mealCategory = this.selectedMealCategory;
    this.employeeForm.mealType = this.selectedMealType;
    this.employeeForm.religion = this.selectedReligion;
    this.employeeForm.inactiveReason = this.selectedInactiveReason;


    if (!this.isUpdate) {
      let newObject = {
        createdBy: this.currentUser.name,
        createdAt: currentdate,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      this.employeeForm = {
        ...this.employeeForm,
        ...newObject
      };

      this.apiService.post(ApiURL.employee_master, this.employeeForm).subscribe(async res => {
        if (res) {
          this.utilitiesService.notifySuccess("Employee Details Saved!")
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilitiesService.notifyError(err.error.title)
      })
    } else {

      let newObject = {
        id: this.dynamicDialogConfig.data.data.id,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      this.employeeForm = {
        ...this.employeeForm,
        ...newObject
      };


      console.log(this.employeeForm)
      this.apiService.patch(ApiURL.employee_master + '/' + this.dynamicDialogConfig.data.data.id, this.employeeForm).subscribe(res => {
        this.utilitiesService.notifySuccess('Employee Details Updated Successfully!');
        this.dialogRef.close(res);
      }, (err) => {
        this.utilitiesService.notifyError('Something Wrong Happend!')
      })
    }
  }

  closeForm() {
    this.dialogRef.close();
  }

  async getReferenceDetails() {
    let query: ApiQuery = new ApiQuery();
    query.size = 20000;

    //Nationiality
    this.apiService.get(ApiURL.ref_nationality, query).subscribe(res => {
      this.nationalityList = res
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


    this.jobTitleList = [
      { label: 'Pipe Fitter', value: 'Pipe Fitter' },
      { label: 'Welder', value: 'Welder' },
      { label: 'Jr. Engineer', value: 'Jr. Engineer' },
      { label: 'Site Engineer', value: 'Site Engineer' },
    ];


    this.empCategoryList = [
      { id: 1, code: 'SENIOR', name: 'SENIOR' },
      { id: 2, code: 'JUNIOR', name: 'JUNIOR' },
      { id: 3, code: 'LABOR', name: 'LABOR' },
    ];

    this.contractBaseList = [
      { label: 'MONTHLY', value: 'MONTHLY' },
      { label: 'DAILY', value: 'DAILY' },
    ];

    this.bandList = [
      { label: '04', value: '04' },
      { label: '05', value: '05' },
      { label: '06', value: '06' },
      { label: '07', value: '07' },
      { label: '08', value: '08' },
      { label: '09', value: '09' },
      { label: '10', value: '10' },
      { label: '11', value: '11' },
      { label: '12', value: '12' },
      { label: '13', value: '13' },
      { label: '14', value: '14' },
      { label: '15', value: '15' },
      { label: 'U/C', value: 'U/C' },
      { label: 'L/S', value: 'L/S' },
      { label: 'DAILY', value: 'DAILY' },
    ];

    this.eqvBandList = [
      { label: '04', value: '04' },
      { label: '05', value: '05' },
      { label: '06', value: '06' },
      { label: '07', value: '07' },
      { label: '08', value: '08' },
      { label: '09', value: '09' },
      { label: '10', value: '10' },
      { label: '11', value: '11' },
      { label: '12', value: '12' },
      { label: '13', value: '13' },
      { label: '14', value: '14' },
      { label: '15', value: '15' },
      { label: '99', value: '99' },
    ];

    this.messEntitleList = [
      { label: 'MGT', value: 'MGT' },
      { label: 'SNR', value: 'SNR' },
      { label: 'JNR', value: 'JNR' },
      { label: 'C/H', value: 'C/H' },
      { label: 'LBR', value: 'LBR' },
    ];

    this.mealCategoryList = [
      { label: 'ARAB', value: 'ARAB' },
      { label: 'INDIAN', value: 'INDIAN' },
      { label: 'FILIPINO', value: 'FILIPINO' },
      { label: 'PAKISTANI', value: 'PAKISTANI' },
      { label: 'SRILANKAN', value: 'SRILANKAN' },
      { label: 'BANGLADESHI', value: 'BANGLADESHI' },
      { label: 'OTHER', value: 'OTHER' },
    ];

    this.mealTypeList = [
      { label: 'NON-VEG', value: 'NON-VEG' },
      { label: 'VEG', value: 'VEG' },
    ];

    this.workLocationList = [
      { label: 'CAMP', value: 'CAMP' },
      { label: 'SITE', value: 'SITE' },
      { label: 'OFFICE', value: 'OFFICE' },
      { label: 'OTHER', value: 'OTHER' },
    ];

    this.religionList = [
      { label: 'MUSLIM', value: 'MUSLIM' },
      { label: 'CHRISTIAN', value: 'CHRISTIAN' },
      { label: 'HINDUISM', value: 'HINDUISM' },
      { label: 'BUDDHISM', value: 'BUDDHISM' },
      { label: 'SIKHISM', value: 'SIKHISM' },
      { label: 'OTHER', value: 'OTHER' },
    ];
  }
}
