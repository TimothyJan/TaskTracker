using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Models.Role
{
    public class RoleDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string Name_ { get; set; } = string.Empty;

        [Required(ErrorMessage = "DepartmentId is required.")]
        public int DepartmentId { get; set; }
    }

    public class CreateRoleDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string Name_ { get; set; } = string.Empty;

        [Required(ErrorMessage = "DepartmentId is required.")]
        public int DepartmentId { get; set; }
    }

    public class UpdateRoleDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string Name_ { get; set; } = string.Empty;

        [Required(ErrorMessage = "DepartmentId is required.")]
        public int DepartmentId { get; set; }
    }
}