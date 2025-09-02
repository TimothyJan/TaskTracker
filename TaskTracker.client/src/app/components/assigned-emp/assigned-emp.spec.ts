import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedEmp } from './assigned-emp';

describe('AssignedEmp', () => {
  let component: AssignedEmp;
  let fixture: ComponentFixture<AssignedEmp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedEmp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedEmp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
