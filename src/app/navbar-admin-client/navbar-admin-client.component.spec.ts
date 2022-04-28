import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAdminClientComponent } from './navbar-admin-client.component';

describe('NavbarAdminClientComponent', () => {
  let component: NavbarAdminClientComponent;
  let fixture: ComponentFixture<NavbarAdminClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarAdminClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarAdminClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
