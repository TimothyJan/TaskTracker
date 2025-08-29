using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TaskTracker.Models;
using TaskTracker.Models.Employee;
using TaskTracker.Repositories.Interfaces;
using testLevel123.Server.Controllers;

namespace TaskTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : BaseController
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IMapper _mapper;
        private const string EntityName = "Employee";

        public EmployeeController(IEmployeeRepository employeeRepository, IMapper mapper)
        {
            _employeeRepository = employeeRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEmployees()
        {
            try
            {
                var employeeEntities = await _employeeRepository.GetAllEmployeesAsync();
                var employeeDtos = _mapper.Map<IEnumerable<EmployeeDto>>(employeeEntities);
                return Success(employeeDtos, string.Format(SuccessMessages.Retrieved, $"{EntityName} records"));
            }
            catch (Exception ex)
            {
                return InternalError($"Error retrieving {EntityName} records: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            try
            {
                var employeeEntity = await _employeeRepository.GetEmployeeByIdAsync(id);
                if (employeeEntity == null)
                {
                    return NotFound(string.Format(ErrorMessages.NotFound, EntityName));
                }

                var employeeDto = _mapper.Map<EmployeeDto>(employeeEntity);
                return Success(employeeDto, string.Format(SuccessMessages.Retrieved, EntityName));
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
        public async Task<IActionResult> AddEmployee([FromBody] CreateEmployeeDto createEmployeeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return ValidationError(GetModelStateErrors());
                }

                var employeeEntity = _mapper.Map<EmployeeEntity>(createEmployeeDto);
                var addedEmployee = await _employeeRepository.AddEmployeeAsync(employeeEntity);
                var resultDto = _mapper.Map<EmployeeDto>(addedEmployee);

                return Success(resultDto, string.Format(SuccessMessages.Created, EntityName), 201);
            }
            catch (ArgumentException ex)
            {
                return Failure(ex.Message, statusCode: 400);
            }
            catch (Exception ex)
            {
                return InternalError($"Error creating {EntityName}: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] UpdateEmployeeDto updateEmployeeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return ValidationError(GetModelStateErrors());
                }

                var existingEmployee = await _employeeRepository.GetEmployeeByIdAsync(id);
                if (existingEmployee == null)
                {
                    return NotFound(string.Format(ErrorMessages.NotFound, EntityName));
                }

                var employeeEntity = _mapper.Map<EmployeeEntity>(updateEmployeeDto);
                employeeEntity.Id = id;
                await _employeeRepository.UpdateEmployeeAsync(employeeEntity);

                return SuccessMessage(string.Format(SuccessMessages.Updated, EntityName));
            }
            catch (ArgumentException ex)
            {
                return Failure(ex.Message, statusCode: 400);
            }
            catch (Exception ex)
            {
                return InternalError($"Error updating {EntityName}: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            try
            {
                var existingEmployee = await _employeeRepository.GetEmployeeByIdAsync(id);
                if (existingEmployee == null)
                {
                    return NotFound(string.Format(ErrorMessages.NotFound, EntityName));
                }

                await _employeeRepository.DeleteEmployeeAsync(id);
                return SuccessMessage(string.Format(SuccessMessages.Deleted, EntityName));
            }
            catch (Exception ex)
            {
                return InternalError($"Error deleting {EntityName}: {ex.Message}");
            }
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetEmployeeCount()
        {
            try
            {
                var count = await _employeeRepository.GetEmployeeCountAsync();
                return Success(new { Count = count }, string.Format(SuccessMessages.CountRetrieved, EntityName));
            }
            catch (Exception ex)
            {
                return InternalError($"Error getting {EntityName} count: {ex.Message}");
            }
        }

        [HttpGet("department/{departmentId}")]
        public async Task<IActionResult> GetEmployeesByDepartment(int departmentId)
        {
            try
            {
                var employees = await _employeeRepository.GetEmployeesByDepartmentAsync(departmentId);
                var employeeDtos = _mapper.Map<IEnumerable<EmployeeDto>>(employees);

                return Success(employeeDtos, string.Format(SuccessMessages.Retrieved, $"{EntityName} records for department"));
            }
            catch (Exception ex)
            {
                return InternalError($"Error retrieving {EntityName} records by department: {ex.Message}");
            }
        }

        [HttpGet("role/{roleId}")]
        public async Task<IActionResult> GetEmployeesByRole(int roleId)
        {
            try
            {
                var employees = await _employeeRepository.GetEmployeesByRoleAsync(roleId);
                var employeeDtos = _mapper.Map<IEnumerable<EmployeeDto>>(employees);

                return Success(employeeDtos, string.Format(SuccessMessages.Retrieved, $"{EntityName} records for role"));
            }
            catch (Exception ex)
            {
                return InternalError($"Error retrieving {EntityName} records by role: {ex.Message}");
            }
        }
    }
}