export class Role {
  id: number = 0;
  name_: string = "";
  departmentId: number = 0;

  constructor(id: number, name_: string, departmentId: number = 0,) {
    this.id = id;
    this.name_ = name_;
    this.departmentId = departmentId;
  }
}
