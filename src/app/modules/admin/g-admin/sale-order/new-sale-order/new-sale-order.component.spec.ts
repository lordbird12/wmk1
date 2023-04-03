import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSaleOrderComponent } from './new-sale-order.component';

describe('NewSaleOrderComponent', () => {
  let component: NewSaleOrderComponent;
  let fixture: ComponentFixture<NewSaleOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSaleOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSaleOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
