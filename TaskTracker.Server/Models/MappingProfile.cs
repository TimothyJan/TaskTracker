using AutoMapper;
using TaskTracker.Models.Department;
using TaskTracker.Models.Employee;
using TaskTracker.Models.Project;
using TaskTracker.Models.ProjectTask;
using TaskTracker.Models.Role;

namespace TaskTracker.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Department mappings
            CreateMap<DepartmentEntity, DepartmentDto>();
            CreateMap<DepartmentDto, DepartmentEntity>();
            CreateMap<CreateDepartmentDto, DepartmentEntity>();
            CreateMap<UpdateDepartmentDto, DepartmentEntity>();

            // Role mappings
            CreateMap<RoleEntity, RoleDto>();
            CreateMap<RoleDto, RoleEntity>();
            CreateMap<CreateRoleDto, RoleEntity>();
            CreateMap<UpdateRoleDto, RoleEntity>();

            // Employee mappings
            CreateMap<EmployeeEntity, EmployeeDto>();
            CreateMap<EmployeeDto, EmployeeEntity>();
            CreateMap<CreateEmployeeDto, EmployeeEntity>();
            CreateMap<UpdateEmployeeDto, EmployeeEntity>();

            // Project mappings
            CreateMap<ProjectEntity, ProjectDto>();
            CreateMap<ProjectDto, ProjectEntity>();
            CreateMap<CreateProjectDto, ProjectEntity>();
            CreateMap<UpdateProjectDto, ProjectEntity>();

            // ProjectTask mappings
            CreateMap<ProjectTaskEntity, ProjectTaskDto>()
                .ForMember(dest => dest.ProjectName, opt => opt.MapFrom(src => src.Project.Name_));
            CreateMap<ProjectTaskDto, ProjectTaskEntity>();
            CreateMap<CreateProjectTaskDto, ProjectTaskEntity>();
            CreateMap<UpdateProjectTaskDto, ProjectTaskEntity>();
        }
    }
}