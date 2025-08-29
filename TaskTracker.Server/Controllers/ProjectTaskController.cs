using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TaskTracker.Models;
using TaskTracker.Models.ProjectTask;
using TaskTracker.Repositories.Interfaces;
using testLevel123.Server.Controllers;

namespace TaskTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectTaskController : BaseController
    {
        private readonly IProjectTaskRepository _projectTaskRepository;
        private readonly IMapper _mapper;
        private const string EntityName = "ProjectTask";

        public ProjectTaskController(IProjectTaskRepository projectTaskRepository, IMapper mapper)
        {
            _projectTaskRepository = projectTaskRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProjectTasks()
        {
            try
            {
                var projectTaskEntities = await _projectTaskRepository.GetAllProjectTasksAsync();
                var projectTaskDtos = _mapper.Map<IEnumerable<ProjectTaskDto>>(projectTaskEntities);
                return Success(projectTaskDtos, string.Format(SuccessMessages.Retrieved, $"{EntityName} records"));
            }
            catch (Exception ex)
            {
                return InternalError($"Error retrieving {EntityName} records: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectTaskById(int id)
        {
            try
            {
                var projectTaskEntity = await _projectTaskRepository.GetProjectTaskByIdAsync(id);
                if (projectTaskEntity == null)
                {
                    return NotFound(string.Format(ErrorMessages.ProjectTaskNotFound, id));
                }

                var projectTaskDto = _mapper.Map<ProjectTaskDto>(projectTaskEntity);
                return Success(projectTaskDto, string.Format(SuccessMessages.Retrieved, EntityName));
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
        public async Task<IActionResult> AddProjectTask([FromBody] CreateProjectTaskDto createProjectTaskDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return ValidationError(GetModelStateErrors());
                }

                var projectTaskEntity = _mapper.Map<ProjectTaskEntity>(createProjectTaskDto);
                var addedProjectTask = await _projectTaskRepository.AddProjectTaskAsync(projectTaskEntity);
                var resultDto = _mapper.Map<ProjectTaskDto>(addedProjectTask);

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
        public async Task<IActionResult> UpdateProjectTask(int id, [FromBody] UpdateProjectTaskDto updateProjectTaskDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return ValidationError(GetModelStateErrors());
                }

                var existingProjectTask = await _projectTaskRepository.GetProjectTaskByIdAsync(id);
                if (existingProjectTask == null)
                {
                    return NotFound(string.Format(ErrorMessages.ProjectTaskNotFound, id));
                }

                var projectTaskEntity = _mapper.Map<ProjectTaskEntity>(updateProjectTaskDto);
                projectTaskEntity.Id = id;
                await _projectTaskRepository.UpdateProjectTaskAsync(projectTaskEntity);

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
        public async Task<IActionResult> DeleteProjectTask(int id)
        {
            try
            {
                var existingProjectTask = await _projectTaskRepository.GetProjectTaskByIdAsync(id);
                if (existingProjectTask == null)
                {
                    return NotFound(string.Format(ErrorMessages.ProjectTaskNotFound, id));
                }

                await _projectTaskRepository.DeleteProjectTaskAsync(id);
                return SuccessMessage(string.Format(SuccessMessages.Deleted, EntityName));
            }
            catch (Exception ex)
            {
                return InternalError($"Error deleting {EntityName}: {ex.Message}");
            }
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetProjectTaskCount()
        {
            try
            {
                var count = await _projectTaskRepository.GetProjectTaskCountAsync();
                return Success(new { Count = count }, string.Format(SuccessMessages.CountRetrieved, EntityName));
            }
            catch (Exception ex)
            {
                return InternalError($"Error getting {EntityName} count: {ex.Message}");
            }
        }

        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetProjectTasksByProjectId(int projectId)
        {
            try
            {
                var projectTasks = await _projectTaskRepository.GetProjectTasksByProjectIdAsync(projectId);
                var projectTaskDtos = _mapper.Map<IEnumerable<ProjectTaskDto>>(projectTasks);

                return Success(projectTaskDtos, string.Format(SuccessMessages.Retrieved, $"{EntityName} records for project"));
            }
            catch (Exception ex)
            {
                return InternalError($"Error retrieving {EntityName} records by project: {ex.Message}");
            }
        }

        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetProjectTasksByStatus(string status)
        {
            try
            {
                var projectTasks = await _projectTaskRepository.GetProjectTasksByStatusAsync(status);
                var projectTaskDtos = _mapper.Map<IEnumerable<ProjectTaskDto>>(projectTasks);

                return Success(projectTaskDtos, string.Format(SuccessMessages.Retrieved, $"{EntityName} records by status"));
            }
            catch (Exception ex)
            {
                return InternalError($"Error retrieving {EntityName} records by status: {ex.Message}");
            }
        }

        [HttpGet("employee/{employeeId}")]
        public async Task<IActionResult> GetProjectTasksByEmployeeId(int employeeId)
        {
            try
            {
                var projectTasks = await _projectTaskRepository.GetProjectTasksByEmployeeIdAsync(employeeId);
                var projectTaskDtos = _mapper.Map<IEnumerable<ProjectTaskDto>>(projectTasks);

                return Success(projectTaskDtos, string.Format(SuccessMessages.Retrieved, $"{EntityName} records for employee"));
            }
            catch (Exception ex)
            {
                return InternalError($"Error retrieving {EntityName} records by employee: {ex.Message}");
            }
        }
    }
}