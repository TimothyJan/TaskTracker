using TaskTracker.Models.Role;

namespace TaskTracker.Repositories.Interfaces
{
    public interface IRoleRepository
    {
        Task<IEnumerable<RoleEntity>> GetAllRolesAsync();
        Task<RoleEntity?> GetRoleByIdAsync(int id);
        Task<RoleEntity> AddRoleAsync(RoleEntity role);
        Task UpdateRoleAsync(RoleEntity role);
        Task DeleteRoleAsync(int id);
        Task<bool> RoleExistsAsync(int id);
        Task<bool> RoleNameExistsAsync(string name, int? excludeId = null);
        Task<int> GetRoleCountAsync();
        Task<bool> RoleNameExistsInDepartmentAsync(string name, int departmentId, int? excludeId = null);
    }
}