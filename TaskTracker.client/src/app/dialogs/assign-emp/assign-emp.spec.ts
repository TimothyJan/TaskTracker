import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEmp } from './assign-emp';

describe('AssignEmp', () => {
  let component: AssignEmp;
  let fixture: ComponentFixture<AssignEmp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignEmp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignEmp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
