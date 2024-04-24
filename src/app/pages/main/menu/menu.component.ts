import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']

})
export class MenuComponent implements OnInit {

  items: MenuItem[];
  model: any[];
  constructor() {
  }

  ngOnInit(): void {
    this.items = [
      { label: 'Room Master', icon: 'pi pi-fw pi-home', routerLink: ['rooms'] },
      { label: 'Bookings', icon: 'pi pi-book', routerLink: ['bookings'] },
      { label: 'Advanced Bookings', icon: 'pi pi-key', routerLink: ['advanced-bookings'] },
      { label: 'Employee Master', icon: 'pi pi-users', routerLink: ['employees'] },

      {
        label: 'Settings', items: [
          { label: 'Reference Tables', icon: 'pi pi-fw pi-server', routerLink: ['/settings/reference-tables'] },
          { label: 'Project Info', icon: 'pi pi-fw pi-book', routerLink: ['/settings/project-info'] },
          { label: 'Project Settings', icon: 'pi pi-fw pi-cog', routerLink: ['/settings/project-settings']  },
          { label: 'User Settings', icon: 'pi pi-fw pi-lock', routerLink: ['/settings/users'] }
        ]
        // { label: 'Compliance Rating Reference', icon: 'pi pi-fw pi-star-fill', routerLink: ['compliance-reference'] },
        // { label: 'Generate Forms', icon: 'pi pi-fw pi-clone', routerLink: ['generate-form'] },
      }
    ]
  }

}
