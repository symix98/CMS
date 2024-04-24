import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { AddRefDataComponent } from 'src/app/pages/settings/reference-components/add-ref-data/add-ref-data.component';
import { CampComponent } from 'src/app/pages/settings/reference-components/camp/camp.component';
import { CateringComponent } from 'src/app/pages/settings/reference-components/catering/catering.component';
import { CompanyComponent } from 'src/app/pages/settings/reference-components/company/company.component';
import { EmployeeCompanyComponent } from 'src/app/pages/settings/reference-components/employee-company/employee-company.component';
import { InactiveReasonsComponent } from 'src/app/pages/settings/reference-components/inactive-reasons/inactive-reasons.component';
import { NationalityComponent } from 'src/app/pages/settings/reference-components/nationality/nationality.component';
import { ProjectsComponent } from 'src/app/pages/settings/reference-components/projects/projects.component';
import { ServicesComponent } from 'src/app/pages/settings/reference-components/services/services.component';

@Component({
  selector: 'app-table-icon',
  templateUrl: './table-icon.component.html',
  styleUrls: ['./table-icon.component.scss']
})
export class TableIconComponent implements OnInit {
  showProject: boolean = false;
  showNationality: boolean = false;
  showInactiveReason: boolean = false;
  showEmployeeCompany: boolean = false;
  showEmployee: boolean = false;
  showService: boolean = false;
  showCompany: boolean = false;
  showCamp: boolean = false;
  showCatering: boolean = false;


  constructor(private dialogService: DialogService,
    private utilitiesService: UtilitiesService,
    private apiService: ApiService,
    private projectsComponent: ProjectsComponent,
    private nationComponent: NationalityComponent,
    private inactiveReasonsComponent: InactiveReasonsComponent,
    private employeeCompanyComponent: EmployeeCompanyComponent,
    private servicesComponent: ServicesComponent,
    private companyComponent: CompanyComponent,
    private campComponent: CampComponent,
    private cateringComponent: CateringComponent
  ) { }

  @Input() data: any

  ngOnInit(): void {
    if (localStorage.getItem('FORMNAME').toUpperCase() == 'PROJECTS') {
      this.showProject = true;
    } else if (localStorage.getItem('FORMNAME').toUpperCase() == 'NATIONALITY') {
      this.showNationality = true;
    } else if (localStorage.getItem('FORMNAME').toUpperCase() == 'INACTIVE REASON') {
      this.showInactiveReason = true;
    } else if (localStorage.getItem('FORMNAME').toUpperCase() == 'EMPLOYEE COMPANY') {
      this.showEmployeeCompany = true;
    } else if (localStorage.getItem('FORMNAME').toUpperCase() == 'EMPLOYEE') {
      this.showEmployee = true;
    } else if (localStorage.getItem('FORMNAME').toUpperCase() == 'SERVICES') {
      this.showService = true;
    } else if (localStorage.getItem('FORMNAME').toUpperCase() == 'COMPANY') {
      this.showCompany = true;
    } else if (localStorage.getItem('FORMNAME').toUpperCase() == 'CAMP') {
      this.showCamp = true;
    } else if (localStorage.getItem('FORMNAME').toUpperCase() == 'CATERING') {
      this.showCatering = true;
    }
  }


  //Project Reference Starts
  editProject(): Promise<void> {
    localStorage.setItem('REF_NAME', 'PROJECT');

    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddRefDataComponent, {
        width: '450px', height: 'auto',
        styleClass: 'my-dialog-class',
        header: 'Update Project',
        data: {
          data: this.data,
          type: 'Projects',
          edit: true
        }
      })
      ref.onClose.subscribe((result) => {
        localStorage.removeItem('REF_NAME');

        if (result) {
          this.projectsComponent.tableParam = null
          setTimeout(() => {
            this.projectsComponent.initTableParam()
          }, 10);

          resolve()
        } else {
          resolve()
        }
      })
    })
  }

  deleteProject() {
    this.utilitiesService.confirmDialog('Are you sure you want to delete?').then((confirm) => {
      if (confirm) {
        this.apiService.delete(ApiURL.ref_project + '/' + this.data.id).subscribe(
          (res) => {
            this.utilitiesService.notifySuccess('Project Deleted');
            this.projectsComponent.tableParam = null
            setTimeout(() => {
              this.projectsComponent.initTableParam()
            }, 10);
          },
          (err) => {
            this.utilitiesService.notifyError('Something Wrong Happend!');
          }
        );
      }
    });
  }
  //Project Reference Ends

  //Nationality Reference Starts
  editNationality(): Promise<void> {
    localStorage.setItem('REF_NAME', 'NATIONALITY');

    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddRefDataComponent, {
        width: '450px', height: 'auto',
        styleClass: 'my-dialog-class',
        header: 'Update Nationality',
        data: {
          data: this.data,
          type: 'Nationality',
          edit: true
        }
      })
      ref.onClose.subscribe((result) => {
        localStorage.removeItem('REF_NAME');

        if (result) {
          this.nationComponent.tableParam = null
          setTimeout(() => {
            this.nationComponent.initTableParam()
          }, 10);

          resolve()
        } else {
          resolve()
        }
      })
    })
  }

  deleteNationality() {
    this.utilitiesService.confirmDialog('Are you sure you want to delete?').then((confirm) => {
      if (confirm) {
        this.apiService.delete(ApiURL.ref_nationality + '/' + this.data.id).subscribe(
          (res) => {
            this.utilitiesService.notifySuccess('Nationality Deleted');
            this.nationComponent.tableParam = null
            setTimeout(() => {
              this.nationComponent.initTableParam()
            }, 10);
          },
          (err) => {
            this.utilitiesService.notifyError('Something Wrong Happend!');
          }
        );
      }
    });
  }
  //Nationality Reference Ends

  //Inactive Reason Reference Starts
  editInactiveReason(): Promise<void> {
    localStorage.setItem('REF_NAME', 'INACTIVE REASON');

    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddRefDataComponent, {
        width: '450px', height: 'auto',
        styleClass: 'my-dialog-class',
        header: 'Update Inactive Reason',
        data: {
          data: this.data,
          type: 'Inactive Reason',
          edit: true
        }
      })
      ref.onClose.subscribe((result) => {
        localStorage.removeItem('REF_NAME');

        if (result) {
          this.inactiveReasonsComponent.tableParam = null
          setTimeout(() => {
            this.inactiveReasonsComponent.initTableParam()
          }, 10);

          resolve()
        } else {
          resolve()
        }
      })
    })
  }

  deleteInactiveReason() {
    this.utilitiesService.confirmDialog('Are you sure you want to delete?').then((confirm) => {
      if (confirm) {
        this.apiService.delete(ApiURL.ref_inactive_reason + '/' + this.data.id).subscribe(
          (res) => {
            this.utilitiesService.notifySuccess('Inactive Reason Deleted');
            this.inactiveReasonsComponent.tableParam = null
            setTimeout(() => {
              this.inactiveReasonsComponent.initTableParam()
            }, 10);
          },
          (err) => {
            this.utilitiesService.notifyError('Something Wrong Happend!');
          }
        );
      }
    });
  }
  //Inactive Reason Reference Ends


  //Employee Company Reference Starts
  editEmployeeCompany(): Promise<void> {
    localStorage.setItem('REF_NAME', 'EMPLOYEE COMPANY');

    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddRefDataComponent, {
        width: '450px', height: 'auto',
        styleClass: 'my-dialog-class',
        header: 'Update Employee Company',
        data: {
          data: this.data,
          type: 'Employee Company',
          edit: true
        }
      })
      ref.onClose.subscribe((result) => {
        localStorage.removeItem('REF_NAME');

        if (result) {
          this.employeeCompanyComponent.tableParam = null
          setTimeout(() => {
            this.employeeCompanyComponent.initTableParam()
          }, 10);

          resolve()
        } else {
          resolve()
        }
      })
    })
  }

  deleteEmployeeCompany() {
    this.utilitiesService.confirmDialog('Are you sure you want to delete?').then((confirm) => {
      if (confirm) {
        this.apiService.delete(ApiURL.ref_employee_company + '/' + this.data.id).subscribe(
          (res) => {
            this.utilitiesService.notifySuccess('Employee Company Deleted');
            this.employeeCompanyComponent.tableParam = null
            setTimeout(() => {
              this.employeeCompanyComponent.initTableParam()
            }, 10);
          },
          (err) => {
            this.utilitiesService.notifyError('Something Wrong Happend!');
          }
        );
      }
    });
  }
  //Employee Company Reference Ends

  //Services Reference Starts
  editService(): Promise<void> {
    localStorage.setItem('REF_NAME', 'SERVICES');

    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddRefDataComponent, {
        width: '450px', height: 'auto',
        styleClass: 'my-dialog-class',
        header: 'Update Service',
        data: {
          data: this.data,
          type: 'Services',
          edit: true
        }
      })
      ref.onClose.subscribe((result) => {
        localStorage.removeItem('REF_NAME');

        if (result) {
          this.servicesComponent.tableParam = null
          setTimeout(() => {
            this.servicesComponent.initTableParam()
          }, 10);

          resolve()
        } else {
          resolve()
        }
      })
    })
  }

  deleteService() {
    this.utilitiesService.confirmDialog('Are you sure you want to delete?').then((confirm) => {
      if (confirm) {
        this.apiService.delete(ApiURL.service + '/' + this.data.id).subscribe(
          (res) => {
            this.utilitiesService.notifySuccess('Service Deleted');
            this.servicesComponent.tableParam = null
            setTimeout(() => {
              this.servicesComponent.initTableParam()
            }, 10);
          },
          (err) => {
            this.utilitiesService.notifyError('Something Wrong Happend!');
          }
        );
      }
    });
  }
  //Employee Company Reference Ends

  //Company Reference Starts
  editCompany(): Promise<void> {
    localStorage.setItem('REF_NAME', 'COMPANY');

    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddRefDataComponent, {
        width: '450px', height: 'auto',
        styleClass: 'my-dialog-class',
        header: 'Update Company',
        data: {
          data: this.data,
          type: 'Company',
          edit: true
        }
      })
      ref.onClose.subscribe((result) => {
        localStorage.removeItem('REF_NAME');

        if (result) {
          this.companyComponent.tableParam = null
          setTimeout(() => {
            this.companyComponent.initTableParam()
          }, 10);

          resolve()
        } else {
          resolve()
        }
      })
    })
  }

  deleteCompany() {
    this.utilitiesService.confirmDialog('Are you sure you want to delete?').then((confirm) => {
      if (confirm) {
        this.apiService.delete(ApiURL.ref_company + '/' + this.data.id).subscribe(
          (res) => {
            this.utilitiesService.notifySuccess('Company Deleted');
            this.companyComponent.tableParam = null
            setTimeout(() => {
              this.companyComponent.initTableParam()
            }, 10);
          },
          (err) => {
            this.utilitiesService.notifyError('Something Wrong Happend!');
          }
        );
      }
    });
  }
  //Company Reference Ends

  //Camp Reference Starts
  editCamp(): Promise<void> {
    localStorage.setItem('REF_NAME', 'CAMP');

    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddRefDataComponent, {
        width: '450px', height: 'auto',
        styleClass: 'my-dialog-class',
        header: 'Update Camp',
        data: {
          data: this.data,
          type: 'Camp',
          edit: true
        }
      })
      ref.onClose.subscribe((result) => {
        localStorage.removeItem('REF_NAME');

        if (result) {
          this.campComponent.tableParam = null
          setTimeout(() => {
            this.campComponent.initTableParam()
          }, 10);

          resolve()
        } else {
          resolve()
        }
      })
    })
  }

  deleteCamp() {
    this.utilitiesService.confirmDialog('Are you sure you want to delete?').then((confirm) => {
      if (confirm) {
        this.apiService.delete(ApiURL.camp + '/' + this.data.id).subscribe(
          (res) => {
            this.utilitiesService.notifySuccess('Camp Deleted');
            this.campComponent.tableParam = null
            setTimeout(() => {
              this.campComponent.initTableParam()
            }, 10);
          },
          (err) => {
            this.utilitiesService.notifyError('Something Wrong Happend!');
          }
        );
      }
    });
  }
  //Camp Reference Ends

  //Catering Reference Starts
  editCatering(): Promise<void> {
    localStorage.setItem('REF_NAME', 'CAMP');

    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddRefDataComponent, {
        width: '450px', height: 'auto',
        styleClass: 'my-dialog-class',
        header: 'Update Catering',
        data: {
          data: this.data,
          type: 'Catering',
          edit: true
        }
      })
      ref.onClose.subscribe((result) => {
        localStorage.removeItem('REF_NAME');

        if (result) {
          this.cateringComponent.tableParam = null
          setTimeout(() => {
            this.cateringComponent.initTableParam()
          }, 10);

          resolve()
        } else {
          resolve()
        }
      })
    })
  }

  deleteCatering() {
    this.utilitiesService.confirmDialog('Are you sure you want to delete?').then((confirm) => {
      if (confirm) {
        this.apiService.delete(ApiURL.catering + '/' + this.data.id).subscribe(
          (res) => {
            this.utilitiesService.notifySuccess('Catering Deleted');
            this.cateringComponent.tableParam = null
            setTimeout(() => {
              this.cateringComponent.initTableParam()
            }, 10);
          },
          (err) => {
            this.utilitiesService.notifyError('Something Wrong Happend!');
          }
        );
      }
    });
  }
  //Catering Reference Ends
}
