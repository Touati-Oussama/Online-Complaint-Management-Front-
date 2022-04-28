import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClientAdminComponent } from './list-client-admin.component';

describe('ListClientAdminComponent', () => {
  let component: ListClientAdminComponent;
  let fixture: ComponentFixture<ListClientAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListClientAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClientAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
