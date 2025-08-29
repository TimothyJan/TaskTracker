using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Models.Employee
{
    public class EmployeeDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string Name_ { get; set; } = string.Empty;

        [Required(ErrorMessage = "Salary is required.")]
        [Range(1, 99999999.99, ErrorMessage = "Salary must be between 1 and 99999999.99.")]
        public decimal Salary { get; set; }

        [Required(ErrorMessage = "DepartmentId is required.")]
        public int DepartmentId { get; set; }

        [Required(ErrorMessage = "RoleId is required.")]
        public int RoleId { get; set; }
    }

    public class CreateEmployeeDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string Name_ { get; set; } = string.Empty;

        [Required(ErrorMessage = "Salary is required.")]
        [Range(1, 99999999.99, ErrorMessage = "Salary must be between 1 and 99999999.99.")]
        public decimal Salary { get; set; }

        [Required(ErrorMessage = "DepartmentId is required.")]
        public int DepartmentId { get; set; }

        [Required(ErrorMessage = "RoleId is required.")]
        public int RoleId { get; set; }
    }

    public class UpdateEmployeeDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string Name_ { get; set; } = string.Empty;

        [Required(ErrorMessage = "Salary is required.")]
        [Range(1, 99999999.99, ErrorMessage = "Salary must be between 1 and 99999999.99.")]
        public decimal Salary { get; set; }

        [Required(ErrorMessage = "DepartmentId is required.")]
        public int DepartmentId { get; set; }

        [Required(ErrorMessage = "RoleId is required.")]
        public int RoleId { get; set; }
    }
}