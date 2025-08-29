using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TaskTracker.Models.Department;
using TaskTracker.Models.Employee;

namespace TaskTracker.Models.Role
{
    [Table("Role", Schema = "dbo")]
    public class RoleEntity
    {
        [Key]
        [Column("Id", TypeName = "int")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("Name_", TypeName = "varchar(100)")]
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string Name_ { get; set; } = string.Empty;

        [Column("DepartmentId", TypeName = "int")]
        [Required(ErrorMessage = "Name is required.")]
        public int DepartmentId { get; set; }

        // Navigation properties
        [ForeignKey("DepartmentId")]
        public virtual DepartmentEntity Department { get; set; } = null!;
        public virtual ICollection<EmployeeEntity> Employees { get; set; } = new List<EmployeeEntity>();
    }
}