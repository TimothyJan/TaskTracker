using Microsoft.EntityFrameworkCore;
using System.Data;
using TaskTracker.Data;
using TaskTracker.Models.Role;
using TaskTracker.Repositories.Interfaces;

namespace TaskTracker.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly TaskTrackerDbContext _context;

        public RoleRepository(TaskTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RoleEntity>> GetAllRolesAsync()
        {
            return await _context.Roles
                .AsNoTracking()
                .Include(r => r.Department)
                .OrderBy(r => r.Name_)
                .ToListAsync();
        }

        public async Task<RoleEntity?> GetRoleByIdAsync(int id)
        {
            if (id < 1)
            {
                throw new ArgumentOutOfRangeException(nameof(id),
                    "Role ID must be greater than 0.");
            }
            return await _context.Roles
                .AsNoTracking()
                .Include(r => r.Department)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<RoleEntity> AddRoleAsync(RoleEntity role)
        {
            // Trim Name_ whitespace
            role.Name_ = role.Name_?.Trim() ?? string.Empty;

            // Validate Name_ length after trimming
            if (string.IsNullOrWhiteSpace(role.Name_) || role.Name_.Length > 100)
            {
                throw new ArgumentException(
                    "Role name must be between 1 and 100 characters.",
                    nameof(role.Name_));
            }

            // Check for duplicate Name_ within the same department
            if (await RoleNameExistsInDepartmentAsync(role.Name_, role.DepartmentId))
            {
                throw new DuplicateNameException(
                    $"Role name [{role.Name_}] already exists in this department.");
            }

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
            return role;
        }

        public async Task UpdateRoleAsync(RoleEntity role)
        {
            // Trim Name_ whitespace
            role.Name_ = role.Name_?.Trim() ?? string.Empty;

            // Validate Name_ length after trimming
            if (string.IsNullOrWhiteSpace(role.Name_) || role.Name_.Length > 100)
            {
                throw new ArgumentException(
                    "Role name must be between 1 and 100 characters.",
                    nameof(role.Name_));
            }

            // Check for duplicate Name_ within the same department (excluding current record)
            if (await RoleNameExistsInDepartmentAsync(role.Name_, role.DepartmentId, role.Id))
            {
                throw new DuplicateNameException(
                    $"Role name [{role.Name_}] already exists in this department.");
            }

            _context.Entry(role).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRoleAsync(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role != null)
            {
                _context.Roles.Remove(role);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> RoleExistsAsync(int id)
        {
            return await _context.Roles
                .AnyAsync(r => r.Id == id);
        }

        public async Task<bool> RoleNameExistsAsync(string name, int? excludeId = null)
        {
            var trimmedName = name?.Trim();
            var query = _context.Roles.Where(r => r.Name_.Trim() == trimmedName);

            if (excludeId.HasValue)
            {
                query = query.Where(r => r.Id != excludeId.Value);
            }

            return await query.AnyAsync();
        }

        public async Task<bool> RoleNameExistsInDepartmentAsync(string name, int departmentId, int? excludeId = null)
        {
            var trimmedName = name?.Trim();
            var query = _context.Roles
                .Where(r => r.Name_.Trim() == trimmedName && r.DepartmentId == departmentId);

            if (excludeId.HasValue)
            {
                query = query.Where(r => r.Id != excludeId.Value);
            }

            return await query.AnyAsync();
        }

        public async Task<int> GetRoleCountAsync()
        {
            return await _context.Roles.CountAsync();
        }
    }
}