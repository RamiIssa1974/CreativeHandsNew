import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProductComponent } from "./AddEditProductComponent";

describe('ProductDetailsComponent', () => {
  let component: AddEditProductComponent;
  let fixture: ComponentFixture<AddEditProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
