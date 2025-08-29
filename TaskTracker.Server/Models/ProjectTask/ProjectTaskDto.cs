using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Models.ProjectTask
{
    public class ProjectTaskDto
    {
        public int Id { get; set; }

        [Required]
        public int ProjectId { get; set; }
        public string? ProjectName { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = string.Empty;

        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }

        public List<int> AssignedEmployeeIds { get; set; } = new List<int>();
    }
}
