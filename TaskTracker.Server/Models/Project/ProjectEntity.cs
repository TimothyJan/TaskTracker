using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TaskTracker.Models.ProjectTask;

namespace TaskTracker.Models.Project
{
    [Table("Project", Schema = "dbo")]
    public class ProjectEntity
    {
        [Key]
        [Column("Id", TypeName = "int")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("Name_", TypeName = "varchar(100)")]
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string Name_ { get; set; } = string.Empty;

        [Column("Description_", TypeName = "varchar(200)")]
        [Required(ErrorMessage = "Description is required.")]
        [StringLength(200, MinimumLength = 1, ErrorMessage = "Description must be between 1 and 200 characters.")]
        public string Description_ { get; set; } = string.Empty;

        [Column("Status_", TypeName = "varchar(50)")]
        [Required(ErrorMessage = "Status is required.")]
        [StringLength(50, MinimumLength = 1, ErrorMessage = "Status must be between 1 and 50 characters.")]
        public string Status_ { get; set; } = string.Empty;

        [Column("StartDate", TypeName = "datetime")]
        public DateTime? StartDate { get; set; }

        [Column("DueDate", TypeName = "datetime")]
        public DateTime? DueDate { get; set; }

        // Navigation properties
        public virtual ICollection<ProjectTaskEntity> ProjectTasks { get; set; } = new List<ProjectTaskEntity>();
    }
}
