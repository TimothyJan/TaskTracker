using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml;
using TaskTracker.Models.Project;

namespace TaskTracker.Models.ProjectTask
{
    [Table("ProjectTask", Schema = "dbo")]
    public class ProjectTaskEntity
    {
        [Key]
        [Column("Id", TypeName = "int")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("ProjectId", TypeName = "int")]
        [Required(ErrorMessage = "ProjectId is required.")]
        public int ProjectId { get; set; }

        [Column("Name_", TypeName = "varchar(100)")]
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Column("Description_", TypeName = "varchar(200)")]
        [Required(ErrorMessage = "Description is required.")]
        [StringLength(200, MinimumLength = 1, ErrorMessage = "Description must be between 1 and 200 characters.")]
        public string Description { get; set; } = string.Empty;

        [Column("Status_", TypeName = "varchar(50)")]
        [Required(ErrorMessage = "Status is required.")]
        [StringLength(50, MinimumLength = 1, ErrorMessage = "Status must be between 1 and 50 characters.")]
        public string Status { get; set; } = string.Empty;

        [Column("StartDate", TypeName = "datetime")]
        public DateTime? StartDate { get; set; }

        [Column("DueDate", TypeName = "datetime")]
        public DateTime? DueDate { get; set; }

        [Column("AssignedEmployeeIds", TypeName = "XML")]
        public string? AssignedEmployeeIdsXml { get; set; }

        // Navigation property
        [ForeignKey("ProjectId")]
        public virtual ProjectEntity Project { get; set; } = null!;

        // Helper property to work with employee IDs
        [NotMapped]
        public List<int> AssignedEmployeeIds
        {
            get
            {
                if (string.IsNullOrEmpty(AssignedEmployeeIdsXml))
                    return new List<int>();

                var employeeIds = new List<int>();
                var xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(AssignedEmployeeIdsXml);

                foreach (XmlNode node in xmlDoc.SelectNodes("//Id"))
                {
                    if (int.TryParse(node.InnerText, out int id))
                    {
                        employeeIds.Add(id);
                    }
                }

                return employeeIds;
            }
            set
            {
                if (value == null || value.Count == 0)
                {
                    AssignedEmployeeIdsXml = null;
                    return;
                }

                var xmlDoc = new XmlDocument();
                var root = xmlDoc.CreateElement("Employees");
                xmlDoc.AppendChild(root);

                foreach (var id in value)
                {
                    var idElement = xmlDoc.CreateElement("Id");
                    idElement.InnerText = id.ToString();
                    root.AppendChild(idElement);
                }

                AssignedEmployeeIdsXml = xmlDoc.OuterXml;
            }
        }
    }
}
