export class Project {
  id: number;
  name_: string;
  description_: string;
  status_: "Not Started" | "Active" | "Completed";
  startDate?: Date;
  dueDate?: Date;

  constructor(
    id: number,
    name_: string,
    description_: string,
    status_: "Not Started" | "Active" | "Completed",
    startDate?: Date,
    dueDate?: Date,
  ) {
    this.id = id;
    this.name_ = name_;
    this.description_ = description_;
    this.status_ = status_;
    this.startDate = startDate;
    this.dueDate = dueDate;
  }
}
