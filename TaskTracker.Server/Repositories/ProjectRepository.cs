using Microsoft.EntityFrameworkCore;
using TaskTracker.Data;
using TaskTracker.Models.Project;
using TaskTracker.Repositories.Interfaces;

namespace TaskTracker.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly TaskTrackerDbContext _context;

        public ProjectRepository(TaskTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProjectEntity>> GetAllProjectsAsync()
        {
            return await _context.Projects
                .AsNoTracking()
                .Include(p => p.ProjectTasks)
                .OrderBy(p => p.Name_)
                .ToListAsync();
        }

        public async Task<ProjectEntity?> GetProjectByIdAsync(int id)
        {
            if (id < 1)
            {
                throw new ArgumentOutOfRangeException(nameof(id),
                    "Project ID must be greater than 0.");
            }
            return await _context.Projects
                .AsNoTracking()
                .Include(p => p.ProjectTasks)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<ProjectEntity> AddProjectAsync(ProjectEntity project)
        {
            // Trim whitespace
            project.Name_ = project.Name_?.Trim() ?? string.Empty;
            project.Description_ = project.Description_?.Trim() ?? string.Empty;
            project.Status_ = project.Status_?.Trim() ?? string.Empty;

            // Validate lengths after trimming
            if (string.IsNullOrWhiteSpace(project.Name_) || project.Name_.Length > 100)
            {
                throw new ArgumentException(
                    "Project name must be between 1 and 100 characters.",
                    nameof(project.Name_));
            }

            if (string.IsNullOrWhiteSpace(project.Description_) || project.Description_.Length > 200)
            {
                throw new ArgumentException(
                    "Project description must be between 1 and 200 characters.",
                    nameof(project.Description_));
            }

            if (string.IsNullOrWhiteSpace(project.Status_) || project.Status_.Length > 50)
            {
                throw new ArgumentException(
                    "Project status must be between 1 and 50 characters.",
                    nameof(project.Status_));
            }

            // Check for duplicate project name
            if (await ProjectNameExistsAsync(project.Name_))
            {
                throw new InvalidOperationException(
                    $"Project name [{project.Name_}] already exists.");
            }

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            return project;
        }

        public async Task UpdateProjectAsync(ProjectEntity project)
        {
            // Trim whitespace
            project.Name_ = project.Name_?.Trim() ?? string.Empty;
            project.Description_ = project.Description_?.Trim() ?? string.Empty;
            project.Status_ = project.Status_?.Trim() ?? string.Empty;

            // Validate lengths after trimming
            if (string.IsNullOrWhiteSpace(project.Name_) || project.Name_.Length > 100)
            {
                throw new ArgumentException(
                    "Project name must be between 1 and 100 characters.",
                    nameof(project.Name_));
            }

            if (string.IsNullOrWhiteSpace(project.Description_) || project.Description_.Length > 200)
            {
                throw new ArgumentException(
                    "Project description must be between 1 and 200 characters.",
                    nameof(project.Description_));
            }

            if (string.IsNullOrWhiteSpace(project.Status_) || project.Status_.Length > 50)
            {
                throw new ArgumentException(
                    "Project status must be between 1 and 50 characters.",
                    nameof(project.Status_));
            }

            // Check for duplicate project name (excluding current project)
            if (await ProjectNameExistsAsync(project.Name_, project.Id))
            {
                throw new InvalidOperationException(
                    $"Project name [{project.Name_}] already exists.");
            }

            _context.Entry(project).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteProjectAsync(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project != null)
            {
                _context.Projects.Remove(project);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ProjectExistsAsync(int id)
        {
            return await _context.Projects
                .AnyAsync(p => p.Id == id);
        }

        public async Task<bool> ProjectNameExistsAsync(string name, int? excludeId = null)
        {
            var trimmedName = name?.Trim();
            var query = _context.Projects.Where(p => p.Name_.Trim() == trimmedName);

            if (excludeId.HasValue)
            {
                query = query.Where(p => p.Id != excludeId.Value);
            }

            return await query.AnyAsync();
        }

        public async Task<int> GetProjectCountAsync()
        {
            return await _context.Projects.CountAsync();
        }

        public async Task<IEnumerable<ProjectEntity>> GetProjectsByStatusAsync(string status)
        {
            var trimmedStatus = status?.Trim();
            return await _context.Projects
                .AsNoTracking()
                .Include(p => p.ProjectTasks)
                .Where(p => p.Status_.Trim() == trimmedStatus)
                .OrderBy(p => p.Name_)
                .ToListAsync();
        }
    }
}