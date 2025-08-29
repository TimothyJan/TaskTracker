using Microsoft.EntityFrameworkCore;
using TaskTracker.Models.Department;
using TaskTracker.Models.Employee;
using TaskTracker.Models.Project;
using TaskTracker.Models.ProjectTask;
using TaskTracker.Models.Role;

namespace TaskTracker.Data;

public class TaskTrackerDbContext : DbContext
{
    public TaskTrackerDbContext(DbContextOptions<TaskTrackerDbContext> options) : base(options)
    { }

    public DbSet<DepartmentEntity> Departments { get; set; }
    public DbSet<RoleEntity> Roles { get; set; }
    public DbSet<EmployeeEntity> Employees { get; set; }
    public DbSet<ProjectEntity> Projects { get; set; }
    public DbSet<ProjectTaskEntity> ProjectTasks { get; set; } // Added ProjectTask DbSet

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Department configuration
        modelBuilder.Entity<DepartmentEntity>(entity =>
        {
            entity.ToTable("Department", "dbo");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn();
            entity.Property(e => e.Name_)
                  .IsRequired()
                  .HasMaxLength(100);
            entity.HasIndex(e => e.Name_).IsUnique();
        });

        // Role configuration
        modelBuilder.Entity<RoleEntity>(entity =>
        {
            entity.ToTable("Role", "dbo");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn();
            entity.Property(e => e.Name_)
                  .IsRequired()
                  .HasMaxLength(100);
            entity.Property(e => e.DepartmentId)
                  .IsRequired();

            entity.HasIndex(e => e.Name_).IsUnique();

            entity.HasOne(r => r.Department)
                  .WithMany(d => d.Roles)
                  .HasForeignKey(r => r.DepartmentId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Employee configuration
        modelBuilder.Entity<EmployeeEntity>(entity =>
        {
            entity.ToTable("Employee", "dbo");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn();
            entity.Property(e => e.Name_)
                  .IsRequired()
                  .HasMaxLength(100);
            entity.Property(e => e.Salary)
                  .IsRequired()
                  .HasColumnType("numeric(10,2)");
            entity.Property(e => e.DepartmentId)
                  .IsRequired();
            entity.Property(e => e.RoleId)
                  .IsRequired();

            // Foreign key relationships
            entity.HasOne(e => e.Department)
                  .WithMany(d => d.Employees)
                  .HasForeignKey(e => e.DepartmentId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Role)
                  .WithMany(r => r.Employees)
                  .HasForeignKey(e => e.RoleId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Project configuration
        modelBuilder.Entity<ProjectEntity>(entity =>
        {
            entity.ToTable("Project", "dbo");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn();
            entity.Property(e => e.Name_)
                  .IsRequired()
                  .HasMaxLength(100);
            entity.Property(e => e.Description_)
                  .IsRequired()
                  .HasMaxLength(200);
            entity.Property(e => e.Status_)
                  .IsRequired()
                  .HasMaxLength(50);
            entity.Property(e => e.StartDate)
                  .HasColumnType("datetime");
            entity.Property(e => e.DueDate)
                  .HasColumnType("datetime");
        });

        // ProjectTask configuration
        modelBuilder.Entity<ProjectTaskEntity>(entity =>
        {
            entity.ToTable("ProjectTask", "dbo");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn();
            entity.Property(e => e.ProjectId)
                  .IsRequired();
            entity.Property(e => e.Name)
                  .IsRequired()
                  .HasMaxLength(100);
            entity.Property(e => e.Description)
                  .IsRequired()
                  .HasMaxLength(200);
            entity.Property(e => e.Status)
                  .IsRequired()
                  .HasMaxLength(50);
            entity.Property(e => e.StartDate)
                  .HasColumnType("datetime");
            entity.Property(e => e.DueDate)
                  .HasColumnType("datetime");
            entity.Property(e => e.AssignedEmployeeIdsXml)
                  .HasColumnType("XML");

            // Foreign key relationship
            entity.HasOne(pt => pt.Project)
                  .WithMany(p => p.ProjectTasks)
                  .HasForeignKey(pt => pt.ProjectId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}