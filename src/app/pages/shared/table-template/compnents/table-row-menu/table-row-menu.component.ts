import { Component, Input, OnInit } from '@angular/core';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { CommentComponent } from '../../../comment/comment.component';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { MenuItem } from 'primeng/api';
import { ApiService } from 'src/app/core/services/api.service';
import { EmployeeMasterComponent } from 'src/app/pages/camp-management/employee-master/employee-master.component';
import { DialogService } from 'primeng/dynamicdialog';
import { EmployeeUpdateComponent } from 'src/app/pages/camp-management/employee-master/employee-update/employee-update.component';

@Component({
  selector: 'app-table-row-menu',
  templateUrl: './table-row-menu.component.html',
  styleUrls: ['./table-row-menu.component.scss']
})
export class TableRowMenuComponent implements OnInit {

  constructor(private utilitiesService: UtilitiesService,
    private apiService: ApiService,
    private dialogService: DialogService,
    private employeeMaster: EmployeeMasterComponent) { }

  @Input() data;
  items: MenuItem[];
  documentForm: Document = new Document();

  ngOnInit(): void {
    this.items = [
      // {
      //   label: 'Get Link',
      //   icon: 'pi pi-link',
      //   command: () => {
      //     this.dialogService.open(CreateHyperlinkDialogComponent,{
      //       header: "Share \"" + this.data.documentsNumber  + "\"",
      //       width: '30%',
      //       data: this.data,
      //     })
      //   },
      // },
      // {
      //   label: 'Download',
      //   icon: 'pi pi-download',
      //   command: () => {
      //     this.dialogService.open(DownloadDocumentsDialogComponent, {
      //       header: "Download",
      //       width: '60%',
      //       data: this.data,
      //     })
      //   },
      // },
      // {
      //   label: 'Open',
      //   icon: 'pi pi-desktop',
      //   command: () => {
      //     const id = this.data.id;
      //     const url = `http://localhost:4200/#/documents/edit-document?id=${id}`;
      //     window.open(url, '_blank');
      //   },
      // },
      // {
      //   label: 'Create New Revision',
      //   icon: 'pi pi-file',
      //   command: () => {
      //     this.dialogService.open(AddNewRevisionDialogComponent,{
      //       header: "Add New Document Revision",
      //       data: this.data,
      //       width: '40%',
      //       height: '50vh',
      //     }).onClose.subscribe((result) => {
      //       if(result){
      //         this.utilitiesService.notifySuccess('Document Revised successfully!')
      //         this.treeDatasourceService.refreshTable.next(true)
      //       }
      //     });
      //   },
      // },
      // {
      //   label: 'Attach New File',
      //   icon: 'pi pi-file',
      //   command: () => {
      //     this.dialogService.open(AttachFileToDocComponent,{
      //       header: "Add New File To Document",
      //       data: this.data,
      //       width: '40%',
      //       height: '50vh',
      //     }).onClose.subscribe((result) => {
      //       if(result){
      //         this.utilitiesService.notifySuccess('File added successfully!')
      //         this.treeDatasourceService.refreshTable.next(true)
      //       }
      //     });
      //   },
      // },
      // {
      //   label: 'Move',
      //   icon: 'pi pi-folder',
      //   command: () => {
      //     this.dialogService.open(MoveFilesDialogComponent,{
      //       header: "Move File to Folder",
      //       data: this.data,
      //       width: '40%',
      //       height: '50vh',
      //     }).onClose.subscribe((result) => {
      //       if(result){
      //         this.utilitiesService.notifySuccess('File moved successfully!')
      //         this.treeDatasourceService.refreshTable.next(true)
      //       }
      //     });
      //   },
      // },
      // {
      //   label: 'Work Flow',
      //   icon: 'pi pi-sitemap',
      //   items: [
      //     {
      //       label: 'Next Status',
      //       command: () => {
      //         this.dialogService.open(CommentComponent, {
      //           width: '35%',
      //           data: {
      //             id: this.data.id,
      //             label: 'Next Status',
      //             properties: this.data,
      //           },
      //         }).onClose.subscribe((res) => { });
      //       },
      //     },
      //     {
      //       label: 'Previous Status',
      //       command: () => {
      //         this.dialogService.open(CommentComponent, {
      //           width: '35%',
      //           data: {
      //             id: this.data.id,
      //             label: 'Previous Status',
      //             properties: this.data,
      //           },
      //         }).onClose.subscribe((res) => {
      //           // if (res)
      //           //   this.updateRevision();
      //         });
      //       },
      //     },
      //     {
      //       label: 'Set Final Status',
      //       command: () => {
      //         this.dialogService.open(CommentComponent, {
      //           width: '35%',
      //           data: {
      //             id: this.data.id,
      //             label: 'Set Final Status',
      //             properties: this.data,
      //           },
      //         }).onClose.subscribe((res) => { });
      //       },
      //     },
      //   ],
      // },
      {
        label: 'Edit Employee',
        icon: 'pi pi-pencil',
        command: () => {
          this.dialogService.open(EmployeeUpdateComponent, {
            header: 'Edit Employee',
            width: "80vw",
            height: "75vh",
            data: {
              data: this.data,
              type: 'Projects',
              edit: true
            },
            modal: true,
          }).onClose.subscribe((result) => {
            if (result) {
              this.employeeMaster.tableParam = null
              setTimeout(() => {
                this.employeeMaster.initTableParam()
              }, 10);

            } else { }
          })
        },
      },

      {
        label: 'Delete Employee',
        icon: 'pi pi-trash',
        command: () => {
          this.utilitiesService.confirmDialog('Are you sure you want to delete?').then((confirm) => {
            if (confirm) {
              this.apiService.delete(ApiURL.employee_master + '/' + this.data.id).subscribe(
                (res) => {
                  this.utilitiesService.notifySuccess('Employee Deleted');
                  this.employeeMaster.tableParam = null
                  setTimeout(() => {
                    this.employeeMaster.initTableParam()
                  }, 10);

                },
                (err) => {
                  this.utilitiesService.notifyError('Something Wrong Happend!');
                }
              );
            }
          });
        },
      },
    ];
  }
}
