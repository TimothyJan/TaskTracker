using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TaskTracker.Models.Employee;
using TaskTracker.Models.Role;

namespace TaskTracker.Models.Department
{
    [Table("Department", Schema = "dbo")]
    public class DepartmentEntity
    {
        [Key]
        [Column("Id", TypeName = "int")]
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("Name_", TypeName = "varchar(100)")]
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string Name_ { get; set; } = string.Empty;

        // Navigation properties
        public virtual ICollection<RoleEntity> Roles { get; set; } = new List<RoleEntity>();
        public virtual ICollection<EmployeeEntity> Employees { get; set; } = new List<EmployeeEntity>();
    }
}