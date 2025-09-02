import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDept } from './select-dept';

describe('SelectDept', () => {
  let component: SelectDept;
  let fixture: ComponentFixture<SelectDept>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectDept]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectDept);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
