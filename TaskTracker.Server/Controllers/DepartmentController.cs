using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using TaskTracker.Models;
using TaskTracker.Models.Department;
using TaskTracker.Repositories.Interfaces;
using testLevel123.Server.Controllers;

namespace TaskTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : BaseController
    {
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IMapper _mapper;
        private const string EntityName = "Department";

        public DepartmentController(IDepartmentRepository departmentRepository, IMapper mapper)
        {
            _departmentRepository = departmentRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDepartments()
        {
            try
            {
                var departmentEntities = await _departmentRepository.GetAllDepartmentsAsync();
                var departmentDtos = _mapper.Map<IEnumerable<DepartmentDto>>(departmentEntities);
                return Success(departmentDtos, string.Format(SuccessMessages.Retrieved, $"{EntityName} records"));
            }
            catch (Exception ex)
            {
                return InternalError($"Error retrieving {EntityName} records: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartmentById(int id)
        {
            try
            {
                var departmentEntity = await _departmentRepository.GetDepartmentByIdAsync(id);
                if (departmentEntity == null)
                {
                    return NotFound(string.Format(ErrorMessages.DepartmentNotFound, id));
                }

                var departmentDto = _mapper.Map<DepartmentDto>(departmentEntity);
                return Success(departmentDto, string.Format(SuccessMessages.Retrieved, EntityName));
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
        public async Task<IActionResult> AddDepartment([FromBody] CreateDepartmentDto createDepartmentDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return ValidationError(GetModelStateErrors());
                }

                // Check if department name already exists
                if (await _departmentRepository.DepartmentNameExistsAsync(createDepartmentDto.Name_))
                {
                    return Conflict(string.Format(ErrorMessages.DepartmentAlreadyExists, "name", createDepartmentDto.Name_));
                }

                var departmentEntity = _mapper.Map<DepartmentEntity>(createDepartmentDto);
                var addedDepartment = await _departmentRepository.AddDepartmentAsync(departmentEntity);
                var resultDto = _mapper.Map<DepartmentDto>(addedDepartment);

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
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] UpdateDepartmentDto updateDepartmentDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return ValidationError(GetModelStateErrors());
                }

                var existingDepartment = await _departmentRepository.GetDepartmentByIdAsync(id);
                if (existingDepartment == null)
                {
                    return NotFound(string.Format(ErrorMessages.DepartmentNotFound, id));
                }

                // Check if department name already exists for a different department
                if (await _departmentRepository.DepartmentNameExistsAsync(updateDepartmentDto.Name_, id))
                {
                    return Conflict(string.Format(ErrorMessages.DepartmentAlreadyExists, "name", updateDepartmentDto.Name_));
                }

                var departmentEntity = _mapper.Map<DepartmentEntity>(updateDepartmentDto);
                departmentEntity.Id = id; // Ensure the ID is set correctly
                await _departmentRepository.UpdateDepartmentAsync(departmentEntity);

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
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            try
            {
                var existingDepartment = await _departmentRepository.GetDepartmentByIdAsync(id);
                if (existingDepartment == null)
                {
                    return NotFound(string.Format(ErrorMessages.DepartmentNotFound, id));
                }

                await _departmentRepository.DeleteDepartmentAsync(id);
                return SuccessMessage(string.Format(SuccessMessages.Deleted, EntityName));
            }
            catch (Exception ex)
            {
                return InternalError($"Error deleting {EntityName}: {ex.Message}");
            }
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetDepartmentCount()
        {
            try
            {
                var count = await _departmentRepository.GetDepartmentCountAsync();
                return Success(new { Count = count }, string.Format(SuccessMessages.CountRetrieved, EntityName));
            }
            catch (Exception ex)
            {
                return InternalError($"Error getting {EntityName} count: {ex.Message}");
            }
        }
    }
}