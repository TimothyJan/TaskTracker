using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using TaskTracker;
using TaskTracker.Data;
using TaskTracker.Models;
using TaskTracker.Repositories;
using TaskTracker.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Configure CORS for development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add DbContext with SQL Server
builder.Services.AddDbContext<TaskTrackerDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
    sqlOptions => sqlOptions.EnableRetryOnFailure()));

// Register repository
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<IProjectTaskRepository, ProjectTaskRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();

// Register AutoMapper
builder.Services.AddAutoMapper(cfg => { }, typeof(Program).Assembly);

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TaskTracker API",
        Version = "v1",
        Description = "API for managing TaskTracker data",
    });

    // Include XML comments if available
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = System.IO.Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (System.IO.File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "TaskTracker API v1");
        c.RoutePrefix = "swagger"; // Makes Swagger UI available at /swagger
    });
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Middleware order is critical - must be in this exact sequence
app.UseHttpsRedirection();
app.UseStaticFiles();  // Serves static files from wwwroot
app.UseRouting();

// Authentication/Authorization should come after Routing but before Endpoints
app.UseAuthentication();
app.UseAuthorization();

// CORS should be after Routing but before Endpoints
app.UseCors("AllowAll");

// For development non executable
//app.MapControllers();
// Configure endpoints for executable
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapFallbackToFile("index.html"); // Important for Angular routing
});

// Apply database migrations and database initialization
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<TaskTrackerDbContext>();

        // Simple approach - use EnsureCreated instead of Migrate
        context.Database.EnsureCreated();

        // Alternative if you need migrations:
        // if (!context.Database.GetAppliedMigrations().Any())
        // {
        //     context.Database.Migrate();
        // }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while initializing the database.");

        // For debugging published app
        File.WriteAllText("startup_error.txt", ex.ToString());
    }
}

app.Run();
