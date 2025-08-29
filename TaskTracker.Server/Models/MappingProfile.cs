using AutoMapper;
using TaskTracker.Models.Department;
using TaskTracker.Models.Employee;
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
        }
    }
}