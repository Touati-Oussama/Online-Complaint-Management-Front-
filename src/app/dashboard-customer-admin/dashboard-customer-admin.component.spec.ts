import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCustomerAdminComponent } from './dashboard-customer-admin.component';

describe('DashboardCustomerAdminComponent', () => {
  let component: DashboardCustomerAdminComponent;
  let fixture: ComponentFixture<DashboardCustomerAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCustomerAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCustomerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
