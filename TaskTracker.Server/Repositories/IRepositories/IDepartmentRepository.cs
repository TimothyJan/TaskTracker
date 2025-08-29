using TaskTracker.Models.Department;

namespace TaskTracker.Repositories.Interfaces
{
    public interface IDepartmentRepository
    {
        Task<IEnumerable<DepartmentEntity>> GetAllDepartmentsAsync();
        Task<DepartmentEntity?> GetDepartmentByIdAsync(int id);
        Task<DepartmentEntity> AddDepartmentAsync(DepartmentEntity department);
        Task UpdateDepartmentAsync(DepartmentEntity department);
        Task DeleteDepartmentAsync(int id);
        Task<bool> DepartmentExistsAsync(int id);
        Task<bool> DepartmentNameExistsAsync(string name, int? excludeId = null);
        Task<int> GetDepartmentCountAsync();
    }
}