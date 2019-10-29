import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionMillComponent } from './production-mill.component';

describe('ProductionMillComponent', () => {
  let component: ProductionMillComponent;
  let fixture: ComponentFixture<ProductionMillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionMillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionMillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
