export class ProjectTaskModel {
  id: number;
  projectId: number;
  name: string;
  description: string;
  status: "Not Started" | "Active" | "Completed";
  startDate?: Date;
  dueDate?: Date;
  assignedEmployeeIds?: number[] | null;

  constructor(
    id: number,
    projectId: number,
    name: string,
    description: string,
    status: "Not Started" | "Active" | "Completed",
    startDate?: Date,
    dueDate?: Date,
    assignedEmployeeIds?: number[] | null,
  ) {
    this.id = id;
    this.projectId = projectId,
    this.name = name,
    this.description = description,
    this.status = status,
    this.startDate = startDate,
    this.dueDate = dueDate,
    this.assignedEmployeeIds = assignedEmployeeIds
  }
}
