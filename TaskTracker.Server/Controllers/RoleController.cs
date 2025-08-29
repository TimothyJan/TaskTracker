using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using TaskTracker.Models;
using TaskTracker.Models.Role;
using TaskTracker.Repositories.Interfaces;
using testLevel123.Server.Controllers;

namespace TaskTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : BaseController
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IMapper _mapper;
        private const string EntityName = "Role";

        public RoleController(IRoleRepository roleRepository, IMapper mapper)
        {
            _roleRepository = roleRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRoles()
        {
            try
            {
                var roleEntities = await _roleRepository.GetAllRolesAsync();
                var roleDtos = _mapper.Map<IEnumerable<RoleDto>>(roleEntities);
                return Success(roleDtos, string.Format(SuccessMessages.Retrieved, $"{EntityName} records"));
            }
            catch (Exception ex)
            {
                return InternalError($"Error retrieving {EntityName} records: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoleById(int id)
        {
            try
            {
                var roleEntity = await _roleRepository.GetRoleByIdAsync(id);
                if (roleEntity == null)
                {
                    return NotFound(string.Format(ErrorMessages.RoleNotFound, id));
                }

                var roleDto = _mapper.Map<RoleDto>(roleEntity);
                return Success(roleDto, string.Format(SuccessMessages.Retrieved, EntityName));
            }
            catch (ArgumentOutOfRangeException ex)
            {
                return Failure(ex.Message, statusCode: 400);
            }
            catch (Exception ex)
            {
                return InternalError($"Error retrieving {EntityName}: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddRole([FromBody] CreateRoleDto createRoleDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return ValidationError(GetModelStateErrors());
                }

                // Check if role name already exists in the same department
                if (await _roleRepository.RoleNameExistsInDepartmentAsync(createRoleDto.Name_, createRoleDto.DepartmentId))
                {
                    return Conflict(string.Format(ErrorMessages.RoleAlreadyExists, "name", createRoleDto.Name_));
                }

                var roleEntity = _mapper.Map<RoleEntity>(createRoleDto);
                var addedRole = await _roleRepository.AddRoleAsync(roleEntity);
                var resultDto = _mapper.Map<RoleDto>(addedRole);

                return Success(resultDto, string.Format(SuccessMessages.Created, EntityName), 201);
            }
            catch (ArgumentException ex)
            {
                return Failure(ex.Message, statusCode: 400);
            }
            catch (DuplicateNameException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return InternalError($"Error creating {EntityName}: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, [FromBody] UpdateRoleDto updateRoleDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return ValidationError(GetModelStateErrors());
                }

                var existingRole = await _roleRepository.GetRoleByIdAsync(id);
                if (existingRole == null)
                {
                    return NotFound(string.Format(ErrorMessages.RoleNotFound, id));
                }

                // Check if role name already exists in the same department for a different role
                if (await _roleRepository.RoleNameExistsInDepartmentAsync(updateRoleDto.Name_, updateRoleDto.DepartmentId, id))
                {
                    return Conflict(string.Format(ErrorMessages.RoleAlreadyExists, "name", updateRoleDto.Name_));
                }

                var roleEntity = _mapper.Map<RoleEntity>(updateRoleDto);
                roleEntity.Id = id; // Ensure the ID is set correctly
                await _roleRepository.UpdateRoleAsync(roleEntity);

                return SuccessMessage(string.Format(SuccessMessages.Updated, EntityName));
            }
            catch (ArgumentException ex)
            {
                return Failure(ex.Message, statusCode: 400);
            }
            catch (DuplicateNameException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return InternalError($"Error updating {EntityName}: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            try
            {
                var existingRole = await _roleRepository.GetRoleByIdAsync(id);
                if (existingRole == null)
                {
                    return NotFound(string.Format(ErrorMessages.RoleNotFound, id));
                }

                await _roleRepository.DeleteRoleAsync(id);
                return SuccessMessage(string.Format(SuccessMessages.Deleted, EntityName));
            }
            catch (Exception ex)
            {
                return InternalError($"Error deleting {EntityName}: {ex.Message}");
            }
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetRoleCount()
        {
            try
            {
                var count = await _roleRepository.GetRoleCountAsync();
                return Success(new { Count = count }, string.Format(SuccessMessages.CountRetrieved, EntityName));
            }
            catch (Exception ex)
            {
                return InternalError($"Error getting {EntityName} count: {ex.Message}");
            }
        }

        [HttpGet("department/{departmentId}")]
        public async Task<IActionResult> GetRolesByDepartment(int departmentId)
        {
            try
            {
                var roles = await _roleRepository.GetAllRolesAsync();
                var departmentRoles = roles.Where(r => r.DepartmentId == departmentId);
                var roleDtos = _mapper.Map<IEnumerable<RoleDto>>(departmentRoles);

                return Success(roleDtos, string.Format(SuccessMessages.Retrieved, $"{EntityName} records for department"));
            }
            catch (Exception ex)
            {
                return InternalError($"Error retrieving {EntityName} records by department: {ex.Message}");
            }
        }
    }
}