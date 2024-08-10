import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPurchaseComponent } from './add-edit-purchase.component';

describe('AddEditPurchaseComponent', () => {
  let component: AddEditPurchaseComponent;
  let fixture: ComponentFixture<AddEditPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
