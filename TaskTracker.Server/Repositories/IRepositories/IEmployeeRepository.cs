using TaskTracker.Models.Employee;

namespace TaskTracker.Repositories.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<EmployeeEntity>> GetAllEmployeesAsync();
        Task<EmployeeEntity?> GetEmployeeByIdAsync(int id);
        Task<EmployeeEntity> AddEmployeeAsync(EmployeeEntity employee);
        Task UpdateEmployeeAsync(EmployeeEntity employee);
        Task DeleteEmployeeAsync(int id);
        Task<bool> EmployeeExistsAsync(int id);
        Task<int> GetEmployeeCountAsync();
        Task<IEnumerable<EmployeeEntity>> GetEmployeesByDepartmentAsync(int departmentId);
        Task<IEnumerable<EmployeeEntity>> GetEmployeesByRoleAsync(int roleId);
    }
}