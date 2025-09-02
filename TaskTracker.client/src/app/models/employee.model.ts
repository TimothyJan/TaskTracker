export class Employee {
  id: number = 0;
  name_: string = "";
  salary: number = 0;
  departmentId: number = 0;
  roleId: number = 0;

  constructor(id: number, name_: string, salary: number, departmentId: number, roleId: number) {
    this.id = id;
    this.name_ = name_;
    this.salary = salary;
    this.departmentId = departmentId;
    this.roleId = roleId;
  }
}
