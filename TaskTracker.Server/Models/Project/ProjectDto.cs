using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Models.Project
{
    public class ProjectDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string Name_ { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required.")]
        [StringLength(200, MinimumLength = 1, ErrorMessage = "Description must be between 1 and 200 characters.")]
        public string Description_ { get; set; } = string.Empty;

        [Required(ErrorMessage = "Status is required.")]
        [StringLength(50, MinimumLength = 1, ErrorMessage = "Status must be between 1 and 50 characters.")]
        public string Status_ { get; set; } = string.Empty;

        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
