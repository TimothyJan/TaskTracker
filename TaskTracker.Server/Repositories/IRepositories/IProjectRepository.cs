using TaskTracker.Models.Project;

namespace TaskTracker.Repositories.Interfaces
{
    public interface IProjectRepository
    {
        Task<IEnumerable<ProjectEntity>> GetAllProjectsAsync();
        Task<ProjectEntity?> GetProjectByIdAsync(int id);
        Task<ProjectEntity> AddProjectAsync(ProjectEntity project);
        Task UpdateProjectAsync(ProjectEntity project);
        Task DeleteProjectAsync(int id);
        Task<bool> ProjectExistsAsync(int id);
        Task<bool> ProjectNameExistsAsync(string name, int? excludeId = null);
        Task<int> GetProjectCountAsync();
        Task<IEnumerable<ProjectEntity>> GetProjectsByStatusAsync(string status);
    }
}