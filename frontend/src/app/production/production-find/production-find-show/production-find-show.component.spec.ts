import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionFindShowComponent } from './production-find-show.component';

describe('ProductionFindShowComponent', () => {
  let component: ProductionFindShowComponent;
  let fixture: ComponentFixture<ProductionFindShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionFindShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionFindShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
