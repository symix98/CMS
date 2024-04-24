import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveReasonsComponent } from './inactive-reasons.component';

describe('InactiveReasonsComponent', () => {
  let component: InactiveReasonsComponent;
  let fixture: ComponentFixture<InactiveReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InactiveReasonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
