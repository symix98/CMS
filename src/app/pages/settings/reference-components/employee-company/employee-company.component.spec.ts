import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCompanyComponent } from './employee-company.component';

describe('EmployeeCompanyComponent', () => {
  let component: EmployeeCompanyComponent;
  let fixture: ComponentFixture<EmployeeCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
