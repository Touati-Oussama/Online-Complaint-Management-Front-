import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroActionComponent } from './zero-action.component';

describe('ZeroActionComponent', () => {
  let component: ZeroActionComponent;
  let fixture: ComponentFixture<ZeroActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZeroActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZeroActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
