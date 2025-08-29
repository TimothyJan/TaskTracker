using TaskTracker.Models.ProjectTask;

namespace TaskTracker.Repositories.Interfaces
{
    public interface IProjectTaskRepository
    {
        Task<IEnumerable<ProjectTaskEntity>> GetAllProjectTasksAsync();
        Task<ProjectTaskEntity?> GetProjectTaskByIdAsync(int id);
        Task<ProjectTaskEntity> AddProjectTaskAsync(ProjectTaskEntity projectTask);
        Task UpdateProjectTaskAsync(ProjectTaskEntity projectTask);
        Task DeleteProjectTaskAsync(int id);
        Task<bool> ProjectTaskExistsAsync(int id);
        Task<int> GetProjectTaskCountAsync();
        Task<IEnumerable<ProjectTaskEntity>> GetProjectTasksByProjectIdAsync(int projectId);
        Task<IEnumerable<ProjectTaskEntity>> GetProjectTasksByStatusAsync(string status);
        Task<IEnumerable<ProjectTaskEntity>> GetProjectTasksByEmployeeIdAsync(int employeeId);
    }
}