import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-reference-components',
  templateUrl: './reference-components.component.html',
  styleUrls: ['./reference-components.component.scss']
})

export class ReferenceComponentsComponent implements OnInit {

  isLoading: any;
  selectedRefTableName: any;
  referenceTablesList: any[];

  constructor() { }

  ngOnInit(): void {
    localStorage.removeItem('FORMNAME');

    this.referenceTablesList = [
      { name: 'Projects', code: 'Projects' },
      { name: 'Employee Company', code: 'Employee Company' },
      { name: 'Nationality', code: 'Nationality' },
      { name: 'Inactive Reason', code: 'Inactive Reason' },
      { name: 'Company', code: 'Company' },
      { name: 'Services', code: 'Services' },
      { name: 'Camp', code: 'Camp' },
      { name: 'Catering', code: 'Catering' },
    ];
  }

  onRefTableSelected(event) { 
    localStorage.setItem('FORMNAME', event.value.name);
  }

}
