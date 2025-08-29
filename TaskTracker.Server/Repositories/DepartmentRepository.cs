using Microsoft.EntityFrameworkCore;
using System.Data;
using TaskTracker.Data;
using TaskTracker.Models.Department;
using TaskTracker.Repositories.Interfaces;

namespace TaskTracker.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly TaskTrackerDbContext _context;

        public DepartmentRepository(TaskTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DepartmentEntity>> GetAllDepartmentsAsync()
        {
            return await _context.Departments
                .AsNoTracking()
                .OrderBy(d => d.Name_)
                .ToListAsync();
        }

        public async Task<DepartmentEntity?> GetDepartmentByIdAsync(int id)
        {
            if (id < 1)
            {
                throw new ArgumentOutOfRangeException(nameof(id),
                    "Department ID must be greater than 0.");
            }
            return await _context.Departments
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<DepartmentEntity> AddDepartmentAsync(DepartmentEntity department)
        {
            // Trim Name_ whitespace
            department.Name_ = department.Name_?.Trim() ?? string.Empty;

            // Validate Name_ length after trimming
            if (string.IsNullOrWhiteSpace(department.Name_) || department.Name_.Length > 100)
            {
                throw new ArgumentException(
                    "Department name must be between 1 and 100 characters.",
                    nameof(department.Name_));
            }

            // Check for duplicate Name_ (case-insensitive and trimmed comparison)
            if (await DepartmentNameExistsAsync(department.Name_))
            {
                throw new DuplicateNameException(
                    $"Department name [{department.Name_}] already exists.");
            }

            _context.Departments.Add(department);
            await _context.SaveChangesAsync();
            return department;
        }

        public async Task UpdateDepartmentAsync(DepartmentEntity department)
        {
            // Trim Name_ whitespace
            department.Name_ = department.Name_?.Trim() ?? string.Empty;

            // Validate Name_ length after trimming
            if (string.IsNullOrWhiteSpace(department.Name_) || department.Name_.Length > 100)
            {
                throw new ArgumentException(
                    "Department name must be between 1 and 100 characters.",
                    nameof(department.Name_));
            }

            // Check for duplicate Name_ (excluding current record, case-insensitive)
            if (await DepartmentNameExistsAsync(department.Name_, department.Id))
            {
                throw new DuplicateNameException(
                    $"Department name [{department.Name_}] already exists.");
            }

            _context.Entry(department).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDepartmentAsync(int id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department != null)
            {
                _context.Departments.Remove(department);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> DepartmentExistsAsync(int id)
        {
            return await _context.Departments
                .AnyAsync(d => d.Id == id);
        }

        public async Task<bool> DepartmentNameExistsAsync(string name, int? excludeId = null)
        {
            var trimmedName = name?.Trim();
            var query = _context.Departments.Where(d => d.Name_.Trim() == trimmedName);

            if (excludeId.HasValue)
            {
                query = query.Where(d => d.Id != excludeId.Value);
            }

            return await query.AnyAsync();
        }

        public async Task<int> GetDepartmentCountAsync()
        {
            return await _context.Departments.CountAsync();
        }
    }
}