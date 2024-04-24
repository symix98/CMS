import { Component, OnInit } from '@angular/core';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AcceptanceCode, Categories, Discipline, DocumentSubType, DocumentsType, Area, FilesType, Location, Organizer, Recipient, Roles, Status, SubArea } from 'src/app/core/models/files-type.model';
import { RefCampType, RefCateringType, RefCompanyType, RefEmployeeCompanyType, RefInactiveReasonType, RefNationalityType, RefProjectType, RefServiceType } from 'src/app/core/models/employee-reference.model';


@Component({
  selector: 'app-add-ref-data',
  templateUrl: './add-ref-data.component.html',
  styleUrls: ['./add-ref-data.component.scss']
})

export class AddRefDataComponent implements OnInit {
  currentUser: any;

  isUpdate: boolean = false;
  isDisabled: boolean = true;
  isInputDisabled: boolean = false;

  buttonName: string = "Save"
  buttonIcon: string = "pi pi-save"

  projectName: string;
  projectCode: string;
  projectDesc: string;
  refProjectType: RefProjectType;
  projectRefType: boolean = false;

  nationalityName: string;
  nationalityCode: string;
  nationalityDesc: string;
  refNationalityType: RefNationalityType;
  nationalityRefType: boolean = false;

  inactiveReasonName: string;
  inactiveReasonCode: string;
  inactiveReasonDesc: string;
  refInactiveReasonType: RefInactiveReasonType;
  inactiveReasonRefType: boolean = false;

  employeeCompanyName: string;
  employeeCompanyCode: string;
  employeeCompanyDesc: string;
  refEmployeeCompanyType: RefEmployeeCompanyType;
  employeeCompanyRefType: boolean = false;

  serviceName: string;
  serviceDesc: string;
  refserviceType: RefServiceType;
  serviceRefType: boolean = false;

  companyName: string;
  location: string;
  servicesProvided: string;
  contactPerson: string;
  contactNo: string;
  contactEmail: string;
  companyRemarks: string;
  servicesList: any[] = [];
  selectedService: any;
  refCompanyType: RefCompanyType;
  companyRefType: boolean = false;


  campName: string;
  campLocation: string;
  campRemarks: string;
  companyList: any[] = [];
  selectedCompany: any;
  refCampType: RefCampType;
  campRefType: boolean = false;

  cateringName: string;
  cateringLocation: string;
  messCategory: string;
  mealType: string;
  menuType: string;
  rate: number;
  upgradedRate: number;
  cateringRemarks: string;
  messCategoryList: any[] = [];
  selectedMessCategory: any;
  refCateringType: RefCampType;
  cateringRefType: boolean = false;


  roleName: string;
  roleDesc: string;
  rId = '';
  roleData: any[];
  Roles: Roles;
  roleRefType: boolean = false;
  roleRidRefType: boolean = false;
  roleId: any;
  description: any;

  constructor(private apiService: ApiService,
    private utilities: UtilitiesService,
    private dialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig) { }

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.utilities.getCurrentAppUser()

    this.servicesList = [
      { label: 'Rooms' },
      { label: 'Catering' },
    ];

    if (this.dynamicDialogConfig.data.edit == true) {
      this.isUpdate = true;
      this.buttonName = "Update"
      this.buttonIcon = "pi pi-check"
    }

    if (this.dynamicDialogConfig.data.type == 'Projects') {
      if (this.dynamicDialogConfig.data.edit == true) {
        this.projectName = this.dynamicDialogConfig.data.data.name
        this.projectCode = this.dynamicDialogConfig.data.data.code
        this.projectDesc = this.dynamicDialogConfig.data.data.description
      }

      this.projectRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'Nationality') {
      if (this.dynamicDialogConfig.data.edit == true) {
        this.nationalityName = this.dynamicDialogConfig.data.data.name
        this.nationalityCode = this.dynamicDialogConfig.data.data.code
        this.nationalityDesc = this.dynamicDialogConfig.data.data.description
      }

      this.nationalityRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'Inactive Reason') {
      if (this.dynamicDialogConfig.data.edit == true) {
        this.inactiveReasonName = this.dynamicDialogConfig.data.data.name
        this.inactiveReasonCode = this.dynamicDialogConfig.data.data.code
        this.inactiveReasonDesc = this.dynamicDialogConfig.data.data.description
      }

      this.inactiveReasonRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'Employee Company') {
      if (this.dynamicDialogConfig.data.edit == true) {
        this.employeeCompanyName = this.dynamicDialogConfig.data.data.name
        this.employeeCompanyCode = this.dynamicDialogConfig.data.data.code
        this.employeeCompanyDesc = this.dynamicDialogConfig.data.data.description
      }

      this.employeeCompanyRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'Services') {
      if (this.dynamicDialogConfig.data.edit == true) {
        this.serviceName = this.dynamicDialogConfig.data.data.serviceName
        this.serviceDesc = this.dynamicDialogConfig.data.data.description
      }

      this.serviceRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'Company') {
      this.loadServices();

      if (this.dynamicDialogConfig.data.edit == true) {
        if (this.dynamicDialogConfig.data.data.servicesProvided) { this.selectedService = this.dynamicDialogConfig.data.data.servicesProvided.split(', ') };

        this.companyName = this.dynamicDialogConfig.data.data.companyName
        this.location = this.dynamicDialogConfig.data.data.location
        this.servicesProvided = this.dynamicDialogConfig.data.data.servicesProvided
        this.contactPerson = this.dynamicDialogConfig.data.data.contactPerson
        this.contactNo = this.dynamicDialogConfig.data.data.contactNo
        this.contactEmail = this.dynamicDialogConfig.data.data.contactEmail
        this.companyRemarks = this.dynamicDialogConfig.data.data.remarks
      }

      this.companyRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'Camp') {
      this.loadCompany();

      if (this.dynamicDialogConfig.data.edit == true) {
        this.selectedCompany = this.dynamicDialogConfig.data.data.company.id;

        this.campName = this.dynamicDialogConfig.data.data.campName
        this.campLocation = this.dynamicDialogConfig.data.data.location
        this.campRemarks = this.dynamicDialogConfig.data.data.remarks
      }

      this.campRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'Catering') {
      this.messCategoryList = [
        { label: 'SENIOR' },
        { label: 'JUNIOR - ASIAN' },
        { label: 'JUNIOR - ARAB' },
        { label: 'LABOR' },
      ];

      if (this.dynamicDialogConfig.data.edit == true) {
        this.selectedMessCategory = this.dynamicDialogConfig.data.data.messCategory;
        this.cateringName = this.dynamicDialogConfig.data.data.cateringName
        this.cateringLocation = this.dynamicDialogConfig.data.data.location
        this.rate = this.dynamicDialogConfig.data.data.rate
        this.upgradedRate = this.dynamicDialogConfig.data.data.upgradedRate
        this.cateringRemarks = this.dynamicDialogConfig.data.data.remarks
      }

      this.cateringRefType = true;
    }


    else if (this.dynamicDialogConfig.data.type == 'role') {
      if (this.dynamicDialogConfig.data.id) {
        this.roleRidRefType = true;
        this.rId = this.dynamicDialogConfig.data.id
        this.apiService.get(ApiURL.roles + '/' + this.rId).subscribe(result => {
          this.Roles = result;
        })
      } else {
        this.rId = '';
        this.roleRefType = true;
      }
    }
  }

  edited(e) { this.isDisabled = false; }

  onAreaChange(e) { this.isDisabled = false; }

  //Project Ref
  saveProjectRef() {
    let currentdate = new Date()
    currentdate.setHours(currentdate.getHours() + 3)

    let data = {
      name: this.projectName,
      code: this.projectCode,
      description: this.projectDesc,
    }

    if (this.isUpdate) {
      let newObject = {
        id: this.dynamicDialogConfig.data.data.id,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      data = {
        ...data,
        ...newObject
      };

      this.apiService.patch(ApiURL.ref_project + '/' + this.dynamicDialogConfig.data.data.id, data).subscribe((res: RefProjectType) => {
        this.utilities.notifySuccess('Project Updated Successfully!');
        this.dialogRef.close(res);
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happend!')
      })
    } else {
      let newObject = {
        createdBy: this.currentUser.name,
        createdAt: currentdate,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      data = {
        ...data,
        ...newObject
      };

      this.apiService.post(ApiURL.ref_project, data).subscribe((res: RefProjectType) => {
        if (res) {
          this.refProjectType = res;
          this.utilities.notifySuccess('Project Added Successfully!');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  //Nationality Ref
  saveNationalityRef() {
    let currentdate = new Date()
    currentdate.setHours(currentdate.getHours() + 3)

    let data = {
      name: this.nationalityName,
      code: this.nationalityCode,
      description: this.nationalityDesc,
    }

    if (this.isUpdate) {
      let newObject = {
        id: this.dynamicDialogConfig.data.data.id,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      data = {
        ...data,
        ...newObject
      };

      this.apiService.patch(ApiURL.ref_nationality + '/' + this.dynamicDialogConfig.data.data.id, data).subscribe((res: RefNationalityType) => {
        this.utilities.notifySuccess('Nationality Updated Successfully!');
        this.dialogRef.close(res);
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happend!')
      })
    } else {
      let newObject = {
        createdBy: this.currentUser.name,
        createdAt: currentdate,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      data = {
        ...data,
        ...newObject
      };

      this.apiService.post(ApiURL.ref_nationality, data).subscribe((res: RefNationalityType) => {
        if (res) {
          this.refNationalityType = res;
          this.utilities.notifySuccess('Nationality Added Successfully!');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  //Inactive Reason Ref
  saveInactiveReasonRef() {
    let currentdate = new Date()
    currentdate.setHours(currentdate.getHours() + 3)

    let data = {
      name: this.inactiveReasonName,
      code: this.inactiveReasonCode,
      description: this.inactiveReasonDesc,
    }

    if (this.isUpdate) {
      let newObject = {
        id: this.dynamicDialogConfig.data.data.id,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      data = {
        ...data,
        ...newObject
      };

      this.apiService.patch(ApiURL.ref_inactive_reason + '/' + this.dynamicDialogConfig.data.data.id, data).subscribe((res: RefInactiveReasonType) => {
        this.utilities.notifySuccess('Inactive Reason Updated Successfully!');
        this.dialogRef.close(res);
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happend!')
      })
    } else {
      let newObject = {
        createdBy: this.currentUser.name,
        createdAt: currentdate,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      data = {
        ...data,
        ...newObject
      };

      this.apiService.post(ApiURL.ref_inactive_reason, data).subscribe((res: RefInactiveReasonType) => {
        if (res) {
          this.refInactiveReasonType = res;
          this.utilities.notifySuccess('Inactive Reason Added Successfully!');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }


  //Employee Company Ref
  saveEmployeeCompanyRef() {
    let currentdate = new Date()
    currentdate.setHours(currentdate.getHours() + 3)

    let data = {
      name: this.employeeCompanyName,
      code: this.employeeCompanyCode,
      description: this.employeeCompanyDesc,
    }

    if (this.isUpdate) {
      let newObject = {
        id: this.dynamicDialogConfig.data.data.id,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      data = {
        ...data,
        ...newObject
      };

      this.apiService.patch(ApiURL.ref_employee_company + '/' + this.dynamicDialogConfig.data.data.id, data).subscribe((res: RefEmployeeCompanyType) => {
        this.utilities.notifySuccess('Employee Company Updated Successfully!');
        this.dialogRef.close(res);
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happend!')
      })
    } else {
      let newObject = {
        createdBy: this.currentUser.name,
        createdAt: currentdate,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      data = {
        ...data,
        ...newObject
      };

      this.apiService.post(ApiURL.ref_employee_company, data).subscribe((res: RefEmployeeCompanyType) => {
        if (res) {
          this.refEmployeeCompanyType = res;
          this.utilities.notifySuccess('Employee Company Added Successfully!');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  //Services Ref
  saveServiceRef() {
    let currentdate = new Date()
    currentdate.setHours(currentdate.getHours() + 3)

    let data = {
      serviceName: this.serviceName,
      description: this.serviceDesc,
    }

    if (this.isUpdate) {
      let newObject = {
        id: this.dynamicDialogConfig.data.data.id,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      data = {
        ...data,
        ...newObject
      };

      this.apiService.patch(ApiURL.service + '/' + this.dynamicDialogConfig.data.data.id, data).subscribe((res: RefServiceType) => {
        this.utilities.notifySuccess('Service Updated Successfully!');
        this.dialogRef.close(res);
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happend!')
      })
    } else {
      let newObject = {
        createdBy: this.currentUser.name,
        createdAt: currentdate,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      data = {
        ...data,
        ...newObject
      };

      this.apiService.post(ApiURL.service, data).subscribe((res: RefServiceType) => {
        if (res) {
          this.refserviceType = res;
          this.utilities.notifySuccess('Service Added Successfully!');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

   //Company Ref
   saveCompanyRef() {
    let checkValue: string = ""
    let currentdate = new Date()
    currentdate.setHours(currentdate.getHours() + 3)

    if (this.selectedService) {
      this.selectedService.forEach((item: string) => {
        checkValue += item + ", "
      })
    };

    let data = {
      companyName: this.companyName,
      location: this.location,
      servicesProvided: checkValue.slice(0, -2),
      contactPerson: this.contactPerson,
      contactNo: this.contactNo,
      contactEmail: this.contactEmail,
      remarks: this.companyRemarks,
    }

    if (this.isUpdate) {
      let newObject = {
        id: this.dynamicDialogConfig.data.data.id,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      data = {
        ...data,
        ...newObject
      };

      this.apiService.patch(ApiURL.ref_company + '/' + this.dynamicDialogConfig.data.data.id, data).subscribe((res: RefCompanyType) => {
        this.utilities.notifySuccess('Company Updated Successfully!');
        this.dialogRef.close(res);
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happend!')
      })
    } else {
      let newObject = {
        createdBy: this.currentUser.name,
        createdAt: currentdate,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      data = {
        ...data,
        ...newObject
      };

      this.apiService.post(ApiURL.ref_company, data).subscribe((res: RefCompanyType) => {
        if (res) {
          this.refCompanyType = res;
          this.utilities.notifySuccess('Company Added Successfully!');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  //Camp Ref
  saveCampRef() {
    let currentdate = new Date()
    currentdate.setHours(currentdate.getHours() + 3)

    let data = {
      campName: this.campName,
      location: this.campLocation,
      remarks: this.campRemarks,
      company: { id: this.selectedCompany }
    }

    if (this.isUpdate) {
      let newObject = {
        id: this.dynamicDialogConfig.data.data.id,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      data = {
        ...data,
        ...newObject
      };

      this.apiService.patch(ApiURL.camp + '/' + this.dynamicDialogConfig.data.data.id, data).subscribe((res: RefCampType) => {
        this.utilities.notifySuccess('Camp Updated Successfully!');
        this.dialogRef.close(res);
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happend!')
      })
    } else {
      let newObject = {
        createdBy: this.currentUser.name,
        createdAt: currentdate,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      data = {
        ...data,
        ...newObject
      };

      this.apiService.post(ApiURL.camp, data).subscribe((res: RefCampType) => {
        if (res) {
          this.refCampType = res;
          this.utilities.notifySuccess('Camp Added Successfully!');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  //Catering Ref
  saveCateringRef() {
    let currentdate = new Date()
    currentdate.setHours(currentdate.getHours() + 3)

    let data = {
      cateringName: this.cateringName,
      location: this.cateringLocation,
      messCategory: this.selectedMessCategory,
      rate: this.rate,
      upgradedRate: this.upgradedRate,
      remarks: this.cateringRemarks
    }

    if (this.isUpdate) {
      let newObject = {
        id: this.dynamicDialogConfig.data.data.id,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      data = {
        ...data,
        ...newObject
      };

      this.apiService.patch(ApiURL.catering + '/' + this.dynamicDialogConfig.data.data.id, data).subscribe((res: RefCateringType) => {
        this.utilities.notifySuccess('Catering Updated Successfully!');
        this.dialogRef.close(res);
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happend!')
      })
    } else {
      let newObject = {
        createdBy: this.currentUser.name,
        createdAt: currentdate,
        modifyBy: this.currentUser.name,
        modifyAt: currentdate
      };

      data = {
        ...data,
        ...newObject
      };

      this.apiService.post(ApiURL.catering, data).subscribe((res: RefCateringType) => {
        if (res) {
          this.refCateringType = res;
          this.utilities.notifySuccess('Catering Added Successfully!');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }


  saveRoleRefStep() {
    if (this.roleRefType) {
      let data = {
        roleId: this.roleName,
        description: this.roleDesc,
      }
      {
        this.apiService.post(ApiURL.roles, data).subscribe((res: Roles) => {
          if (res) {
            this.Roles = res;
            this.utilities.notifySuccess('Role Added Successfully');
            this.dialogRef.close(res);
          }
        }, (err) => {
          this.utilities.notifyError('Something Wrong Happened.');
        })
      }
    } else if (this.roleRidRefType) {
      let data = {
        roleId: this.Roles.roleId,
        description: this.Roles.description,
      }
      {
        this.apiService.put(ApiURL.roles + '/' + this.rId, data).subscribe((res: Roles) => {
          if (res) {
            this.Roles = res;
            this.utilities.notifySuccess('Role Updated Successfully');
            this.dialogRef.close(res);
          }
        }, (err) => {
          this.utilities.notifyError('Something Wrong Happened.');
        })
      }
    }
  }

  closeForm() {
    this.dialogRef.close();
  }

  loadServices() {
    //ref_services
    this.apiService.get(ApiURL.service).subscribe(res => {
      this.servicesList = res;
    }, (err) => {
      this.utilities.notifyError("Error")
    })
  }

  loadCompany() {
    //ref_company
    this.apiService.get(ApiURL.ref_company).subscribe(res => {
      this.companyList = res;
    }, (err) => {
      this.utilities.notifyError("Error")
    })
  }

}
