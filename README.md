# TaskTracker
Full-stack project task and employee management app with CRUD functionality for projects, tasks, employees, departments, and roles using ASP.NET Core, Angular Material, and SQL Server.

Manual Creation steps:
<ul>
  <li>Create ASP.NET Core Web API ~<code>dotnet new webapi -n TaskTracker.Server -f net8.0</code></li>
  <li>Create Angular client~<code>npx @angular/cli@latest new TaskTracker.client--skip-git --routing --style=css</code></li>
  <li>Create Solution File ~<code>dotnet new sln -n TaskTracker</code></li>
  <li>Add Project to the Solution~<code>dotnet sln add'.\TaskTracker.Server\TaskTracker.csproj'</code></li>
</ul>

SQL Script
<ul>
  <li>Create database if it doesn't exist.</li>
  <li>It will use the database</li>
  <li>Drop existing tables, if they exist.</li>
  <li>Create tables with fields</li>
  <li>Insert sample data.</li>
  <li>Verify the table structures.</li>
  <li>Verify the constraints for all tables.</li>
  <li>Verify the inserted data in all tables.</li>
</ul>

Backend API with ASP.NET Core
<ul>
  <li>Add Required NuGet Packages
    <ul>
      <li><code>Microsoft.EntityFrameworkCore</code></li>
      <li><code>Microsoft.EntityFrameworkCore.SqlServer</code></li>
      <li><code>Microsoft.EntityFrameworkCore.Tools</code></li>
      <li><code>AutoMapper</code>
        <ul>
          <li>Simplifies the process of transferring data between different objects</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>Create Models with data annotations.</li>
  <li>Create Dtos(Data Transder Objects) to transfer only the required data between the client and server.</li>
  <li>Create Mapping Profile for Entity and Dto.</li>
  <li>Create Database Context TestDbContext. The DbContext simplifies database interactions, manages entities and their relationships, and ensures data consistency.</li>
  <li>Create IRepositories(Interface) and Repositories for each model with async methods to abstract data access logic, promotes separation of concerns, and makes the code cleaner, more maintainable, and easier to test.
  </li>
  <li>Create Controllers for each model to handle incoming HTTP requests, process the HTTP requests, and return appropriate responses.</li>
  <li>Configure appsettings.json with the proper connection string to the proper database.</li>
  <li>Configure Program.cs to use connection string to SQL Server.</li>
  <li>Test all methods on Swagger.</li>
  <li>Clean and Rebuild
    <ul>
      <li>~<code>dotnet clean</code></li>
      <li>~<code>Remove-Item .\Migrations -Recurse -Force -ErrorAction SilentlyContinue</code></li>
      <li>~<code>dotnet ef migrations add InitialCreate --verbose</code></li>
      <li>~<code>dotnet ef database update --verbose</code></li>
    </ul>
  </li>
</ul>

Frontend with Angular Material
<ul>
  <li>Create new Angular Project.</li>
  <li>Install Angular Material.</li>
  <li>Update all Angular packages to the same version, this case v20.</li>
  <li>Update Typescript to a compatible version.</li>
  <li>Create models.</li>
  <li>Create services to handle communication with database and snackbar.</li>
  <li>Configure environment files for development and production.</li>
  <li>Create components.</li>
  <li>Test all components.</li>
</ul>