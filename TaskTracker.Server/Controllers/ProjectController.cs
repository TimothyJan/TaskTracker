using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TaskTracker.Models;
using TaskTracker.Models.Project;
using TaskTracker.Repositories.Interfaces;
using testLevel123.Server.Controllers;

namespace TaskTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : BaseController
    {
        private readonly IProjectRepository _projectRepository;
        private readonly IMapper _mapper;
        private const string EntityName = "Project";

        public ProjectController(IProjectRepository projectRepository, IMapper mapper)
        {
            _projectRepository = projectRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProjects()
        {
            try
            {
                var projectEntities = await _projectRepository.GetAllProjectsAsync();
                var projectDtos = _mapper.Map<IEnumerable<ProjectDto>>(projectEntities);
                return Success(projectDtos, string.Format(SuccessMessages.Retrieved, $"{EntityName} records"));
            }
            catch (Exception ex)
            {
                return InternalError($"Error retrieving {EntityName} records: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectById(int id)
        {
            try
            {
                var projectEntity = await _projectRepository.GetProjectByIdAsync(id);
                if (projectEntity == null)
                {
                    return NotFound(string.Format(ErrorMessages.ProjectNotFound, id));
                }

                var projectDto = _mapper.Map<ProjectDto>(projectEntity);
                return Success(projectDto, string.Format(SuccessMessages.Retrieved, EntityName));
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
        public async Task<IActionResult> AddProject([FromBody] CreateProjectDto createProjectDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return ValidationError(GetModelStateErrors());
                }

                // Check if project name already exists
                if (await _projectRepository.ProjectNameExistsAsync(createProjectDto.Name_))
                {
                    return Conflict(string.Format(ErrorMessages.ProjectAlreadyExists, "name", createProjectDto.Name_));
                }

                var projectEntity = _mapper.Map<ProjectEntity>(createProjectDto);
                var addedProject = await _projectRepository.AddProjectAsync(projectEntity);
                var resultDto = _mapper.Map<ProjectDto>(addedProject);

                return Success(resultDto, string.Format(SuccessMessages.Created, EntityName), 201);
            }
            catch (ArgumentException ex)
            {
                return Failure(ex.Message, statusCode: 400);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return InternalError($"Error creating {EntityName}: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] UpdateProjectDto updateProjectDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return ValidationError(GetModelStateErrors());
                }

                var existingProject = await _projectRepository.GetProjectByIdAsync(id);
                if (existingProject == null)
                {
                    return NotFound(string.Format(ErrorMessages.ProjectNotFound, id));
                }

                // Check if project name already exists for a different project
                if (await _projectRepository.ProjectNameExistsAsync(updateProjectDto.Name_, id))
                {
                    return Conflict(string.Format(ErrorMessages.ProjectAlreadyExists, "name", updateProjectDto.Name_));
                }

                var projectEntity = _mapper.Map<ProjectEntity>(updateProjectDto);
                projectEntity.Id = id;
                await _projectRepository.UpdateProjectAsync(projectEntity);

                return SuccessMessage(string.Format(SuccessMessages.Updated, EntityName));
            }
            catch (ArgumentException ex)
            {
                return Failure(ex.Message, statusCode: 400);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return InternalError($"Error updating {EntityName}: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            try
            {
                var existingProject = await _projectRepository.GetProjectByIdAsync(id);
                if (existingProject == null)
                {
                    return NotFound(string.Format(ErrorMessages.ProjectNotFound, id));
                }

                await _projectRepository.DeleteProjectAsync(id);
                return SuccessMessage(string.Format(SuccessMessages.Deleted, EntityName));
            }
            catch (Exception ex)
            {
                return InternalError($"Error deleting {EntityName}: {ex.Message}");
            }
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetProjectCount()
        {
            try
            {
                var count = await _projectRepository.GetProjectCountAsync();
                return Success(new { Count = count }, string.Format(SuccessMessages.CountRetrieved, EntityName));
            }
            catch (Exception ex)
            {
                return InternalError($"Error getting {EntityName} count: {ex.Message}");
            }
        }

        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetProjectsByStatus(string status)
        {
            try
            {
                var projects = await _projectRepository.GetProjectsByStatusAsync(status);
                var projectDtos = _mapper.Map<IEnumerable<ProjectDto>>(projects);

                return Success(projectDtos, string.Format(SuccessMessages.Retrieved, $"{EntityName} records by status"));
            }
            catch (Exception ex)
            {
                return InternalError($"Error retrieving {EntityName} records by status: {ex.Message}");
            }
        }
    }
}