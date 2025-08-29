using Microsoft.EntityFrameworkCore;
using TaskTracker.Data;
using TaskTracker.Models.Employee;
using TaskTracker.Repositories.Interfaces;

namespace TaskTracker.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly TaskTrackerDbContext _context;

        public EmployeeRepository(TaskTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EmployeeEntity>> GetAllEmployeesAsync()
        {
            return await _context.Employees
                .AsNoTracking()
                .Include(e => e.Department)
                .Include(e => e.Role)
                .OrderBy(e => e.Name_)
                .ToListAsync();
        }

        public async Task<EmployeeEntity?> GetEmployeeByIdAsync(int id)
        {
            if (id < 1)
            {
                throw new ArgumentOutOfRangeException(nameof(id),
                    "Employee ID must be greater than 0.");
            }
            return await _context.Employees
                .AsNoTracking()
                .Include(e => e.Department)
                .Include(e => e.Role)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<EmployeeEntity> AddEmployeeAsync(EmployeeEntity employee)
        {
            // Trim Name_ whitespace
            employee.Name_ = employee.Name_?.Trim() ?? string.Empty;

            // Validate Name_ length after trimming
            if (string.IsNullOrWhiteSpace(employee.Name_) || employee.Name_.Length > 100)
            {
                throw new ArgumentException(
                    "Employee name must be between 1 and 100 characters.",
                    nameof(employee.Name_));
            }

            // Validate salary range
            if (employee.Salary < 1 || employee.Salary > 99999999.99m)
            {
                throw new ArgumentException(
                    "Salary must be between 1 and 99999999.99.",
                    nameof(employee.Salary));
            }

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return employee;
        }

        public async Task UpdateEmployeeAsync(EmployeeEntity employee)
        {
            // Trim Name_ whitespace
            employee.Name_ = employee.Name_?.Trim() ?? string.Empty;

            // Validate Name_ length after trimming
            if (string.IsNullOrWhiteSpace(employee.Name_) || employee.Name_.Length > 100)
            {
                throw new ArgumentException(
                    "Employee name must be between 1 and 100 characters.",
                    nameof(employee.Name_));
            }

            // Validate salary range
            if (employee.Salary < 1 || employee.Salary > 99999999.99m)
            {
                throw new ArgumentException(
                    "Salary must be between 1 and 99999999.99.",
                    nameof(employee.Salary));
            }

            _context.Entry(employee).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteEmployeeAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee != null)
            {
                _context.Employees.Remove(employee);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> EmployeeExistsAsync(int id)
        {
            return await _context.Employees
                .AnyAsync(e => e.Id == id);
        }

        public async Task<int> GetEmployeeCountAsync()
        {
            return await _context.Employees.CountAsync();
        }

        public async Task<IEnumerable<EmployeeEntity>> GetEmployeesByDepartmentAsync(int departmentId)
        {
            return await _context.Employees
                .AsNoTracking()
                .Include(e => e.Department)
                .Include(e => e.Role)
                .Where(e => e.DepartmentId == departmentId)
                .OrderBy(e => e.Name_)
                .ToListAsync();
        }

        public async Task<IEnumerable<EmployeeEntity>> GetEmployeesByRoleAsync(int roleId)
        {
            return await _context.Employees
                .AsNoTracking()
                .Include(e => e.Department)
                .Include(e => e.Role)
                .Where(e => e.RoleId == roleId)
                .OrderBy(e => e.Name_)
                .ToListAsync();
        }
    }
}