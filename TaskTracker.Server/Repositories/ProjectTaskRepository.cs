using Microsoft.EntityFrameworkCore;
using System.Xml;
using TaskTracker.Data;
using TaskTracker.Models.ProjectTask;
using TaskTracker.Repositories.Interfaces;

namespace TaskTracker.Repositories
{
    public class ProjectTaskRepository : IProjectTaskRepository
    {
        private readonly TaskTrackerDbContext _context;

        public ProjectTaskRepository(TaskTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProjectTaskEntity>> GetAllProjectTasksAsync()
        {
            return await _context.ProjectTasks
                .AsNoTracking()
                .Include(pt => pt.Project)
                .OrderBy(pt => pt.Name)
                .ToListAsync();
        }

        public async Task<ProjectTaskEntity?> GetProjectTaskByIdAsync(int id)
        {
            if (id < 1)
            {
                throw new ArgumentOutOfRangeException(nameof(id),
                    "ProjectTask ID must be greater than 0.");
            }
            return await _context.ProjectTasks
                .AsNoTracking()
                .Include(pt => pt.Project)
                .FirstOrDefaultAsync(pt => pt.Id == id);
        }

        public async Task<ProjectTaskEntity> AddProjectTaskAsync(ProjectTaskEntity projectTask)
        {
            // Trim whitespace
            projectTask.Name = projectTask.Name?.Trim() ?? string.Empty;
            projectTask.Description = projectTask.Description?.Trim() ?? string.Empty;
            projectTask.Status = projectTask.Status?.Trim() ?? string.Empty;

            // Validate lengths after trimming
            if (string.IsNullOrWhiteSpace(projectTask.Name) || projectTask.Name.Length > 100)
            {
                throw new ArgumentException(
                    "Task name must be between 1 and 100 characters.",
                    nameof(projectTask.Name));
            }

            if (string.IsNullOrWhiteSpace(projectTask.Description) || projectTask.Description.Length > 200)
            {
                throw new ArgumentException(
                    "Task description must be between 1 and 200 characters.",
                    nameof(projectTask.Description));
            }

            if (string.IsNullOrWhiteSpace(projectTask.Status) || projectTask.Status.Length > 50)
            {
                throw new ArgumentException(
                    "Task status must be between 1 and 50 characters.",
                    nameof(projectTask.Status));
            }

            // Validate assigned employee IDs
            await ValidateAssignedEmployeeIdsAsync(projectTask.AssignedEmployeeIds);

            _context.ProjectTasks.Add(projectTask);
            await _context.SaveChangesAsync();
            return projectTask;
        }

        public async Task UpdateProjectTaskAsync(ProjectTaskEntity projectTask)
        {
            // Trim whitespace
            projectTask.Name = projectTask.Name?.Trim() ?? string.Empty;
            projectTask.Description = projectTask.Description?.Trim() ?? string.Empty;
            projectTask.Status = projectTask.Status?.Trim() ?? string.Empty;

            // Validate lengths after trimming
            if (string.IsNullOrWhiteSpace(projectTask.Name) || projectTask.Name.Length > 100)
            {
                throw new ArgumentException(
                    "Task name must be between 1 and 100 characters.",
                    nameof(projectTask.Name));
            }

            if (string.IsNullOrWhiteSpace(projectTask.Description) || projectTask.Description.Length > 200)
            {
                throw new ArgumentException(
                    "Task description must be between 1 and 200 characters.",
                    nameof(projectTask.Description));
            }

            if (string.IsNullOrWhiteSpace(projectTask.Status) || projectTask.Status.Length > 50)
            {
                throw new ArgumentException(
                    "Task status must be between 1 and 50 characters.",
                    nameof(projectTask.Status));
            }

            // Validate assigned employee IDs
            await ValidateAssignedEmployeeIdsAsync(projectTask.AssignedEmployeeIds);

            _context.Entry(projectTask).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteProjectTaskAsync(int id)
        {
            var projectTask = await _context.ProjectTasks.FindAsync(id);
            if (projectTask != null)
            {
                _context.ProjectTasks.Remove(projectTask);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ProjectTaskExistsAsync(int id)
        {
            return await _context.ProjectTasks
                .AnyAsync(pt => pt.Id == id);
        }

        public async Task<int> GetProjectTaskCountAsync()
        {
            return await _context.ProjectTasks.CountAsync();
        }

        public async Task<IEnumerable<ProjectTaskEntity>> GetProjectTasksByProjectIdAsync(int projectId)
        {
            return await _context.ProjectTasks
                .AsNoTracking()
                .Include(pt => pt.Project)
                .Where(pt => pt.ProjectId == projectId)
                .OrderBy(pt => pt.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<ProjectTaskEntity>> GetProjectTasksByStatusAsync(string status)
        {
            var trimmedStatus = status?.Trim();
            return await _context.ProjectTasks
                .AsNoTracking()
                .Include(pt => pt.Project)
                .Where(pt => pt.Status.Trim() == trimmedStatus)
                .OrderBy(pt => pt.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<ProjectTaskEntity>> GetProjectTasksByEmployeeIdAsync(int employeeId)
        {
            var allTasks = await _context.ProjectTasks
                .AsNoTracking()
                .Include(pt => pt.Project)
                .ToListAsync();

            return allTasks.Where(pt => pt.AssignedEmployeeIds.Contains(employeeId))
                          .OrderBy(pt => pt.Name)
                          .ToList();
        }

        private async Task ValidateAssignedEmployeeIdsAsync(List<int> employeeIds)
        {
            if (employeeIds == null || employeeIds.Count == 0)
                return;

            // Check if all employee IDs exist
            var existingEmployeeIds = await _context.Employees
                .Where(e => employeeIds.Contains(e.Id))
                .Select(e => e.Id)
                .ToListAsync();

            var invalidIds = employeeIds.Except(existingEmployeeIds).ToList();
            if (invalidIds.Any())
            {
                throw new ArgumentException(
                    $"Invalid employee IDs: {string.Join(", ", invalidIds)}",
                    nameof(ProjectTaskEntity.AssignedEmployeeIds));
            }
        }
    }
}