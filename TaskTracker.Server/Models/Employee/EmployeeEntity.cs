using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TaskTracker.Models.Department;
using TaskTracker.Models.Role;

namespace TaskTracker.Models.Employee
{
    [Table("Employee", Schema = "dbo")]
    public class EmployeeEntity
    {
        [Key]
        [Column("Id", TypeName = "int")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("Name_", TypeName = "varchar(100)")]
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string Name_ { get; set; } = string.Empty;

        [Column(TypeName = "numeric(10,2)")]
        [Required(ErrorMessage = "Salary is required.")]
        [Range(1, 99999999.99, ErrorMessage = "Salary must be between 1 and 99999999.99.")]
        public decimal Salary { get; set; }

        [Column("DepartmentId", TypeName = "int")]
        [Required(ErrorMessage = "DepartmentId is required.")]
        public int DepartmentId { get; set; }

        [Column("RoleId", TypeName = "int")]
        [Required(ErrorMessage = "RoleId is required.")]
        public int RoleId { get; set; }

        // Navigation properties
        [ForeignKey("DepartmentId")]
        public virtual DepartmentEntity Department { get; set; } = null!;

        [ForeignKey("RoleId")]
        public virtual RoleEntity Role { get; set; } = null!;
    }
}