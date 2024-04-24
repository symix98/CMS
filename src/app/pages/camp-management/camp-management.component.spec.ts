import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampManagementComponent } from './camp-management.component';

describe('CampManagementComponent', () => {
  let component: CampManagementComponent;
  let fixture: ComponentFixture<CampManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
