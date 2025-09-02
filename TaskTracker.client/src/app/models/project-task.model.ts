export class ProjectTaskModel {
  id: number;
  projectId: number;
  name_: string;
  description_: string;
  status_: "Not Started" | "Active" | "Completed";
  startDate?: Date;
  dueDate?: Date;
  assignedEmployeeIds?: number[] | null;

  constructor(
    id: number,
    projectId: number,
    name_: string,
    description_: string,
    status_: "Not Started" | "Active" | "Completed",
    startDate?: Date,
    dueDate?: Date,
    assignedEmployeeIds?: number[] | null,
  ) {
    this.id = id;
    this.projectId = projectId,
    this.name_ = name_,
    this.description_ = description_,
    this.status_ = status_,
    this.startDate = startDate,
    this.dueDate = dueDate,
    this.assignedEmployeeIds = assignedEmployeeIds
  }
}
