using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Models.ProjectTask
{
    public class ProjectTaskDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "ProjectId is required.")]
        public int ProjectId { get; set; }
        public string? ProjectName { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required.")]
        [StringLength(200, MinimumLength = 1, ErrorMessage = "Description must be between 1 and 200 characters.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Status is required.")]
        [StringLength(50, MinimumLength = 1, ErrorMessage = "Status must be between 1 and 50 characters.")]
        public string Status { get; set; } = string.Empty;

        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }

        public List<int> AssignedEmployeeIds { get; set; } = new List<int>();
    }

    public class CreateProjectTaskDto
    {
        [Required(ErrorMessage = "ProjectId is required.")]
        public int ProjectId { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required.")]
        [StringLength(200, MinimumLength = 1, ErrorMessage = "Description must be between 1 and 200 characters.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Status is required.")]
        [StringLength(50, MinimumLength = 1, ErrorMessage = "Status must be between 1 and 50 characters.")]
        public string Status { get; set; } = string.Empty;

        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }

        public List<int> AssignedEmployeeIds { get; set; } = new List<int>();
    }

    public class UpdateProjectTaskDto
    {
        [Required(ErrorMessage = "ProjectId is required.")]
        public int ProjectId { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required.")]
        [StringLength(200, MinimumLength = 1, ErrorMessage = "Description must be between 1 and 200 characters.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Status is required.")]
        [StringLength(50, MinimumLength = 1, ErrorMessage = "Status must be between 1 and 50 characters.")]
        public string Status { get; set; } = string.Empty;

        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }

        public List<int> AssignedEmployeeIds { get; set; } = new List<int>();
    }
}