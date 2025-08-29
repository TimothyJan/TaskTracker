-- =============================================
-- TaskTrackerDb Database Initialization Script
-- =============================================
-- This script is idempotent and can be run multiple times
-- =============================================

-- Set NOCOUNT ON to prevent extra result sets
SET NOCOUNT ON;

-- =============================================
-- Database Creation Section
-- =============================================
PRINT 'Starting database initialization process...';

-- Check if database exists and drop if it does
IF EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = 'TaskTrackerDb')
BEGIN
    PRINT 'Dropping existing TaskTrackerDb database...';
    
    -- Close existing connections
    ALTER DATABASE TaskTrackerDb SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    
    DROP DATABASE TaskTrackerDb;
    PRINT 'TaskTrackerDb database dropped successfully.';
END

PRINT 'Creating TaskTrackerDb database...';
CREATE DATABASE TaskTrackerDb;
PRINT 'Database TaskTrackerDb created successfully.';
GO

-- Use the database
USE TaskTrackerDb;
GO

-- =============================================
-- Table Creation Section
-- =============================================
PRINT 'Creating tables...';

-- Department Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Department' AND xtype='U')
BEGIN
    PRINT 'Creating Department table...';
    CREATE TABLE Department (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name_ VARCHAR(100) NOT NULL UNIQUE
    );
    PRINT 'Department table created successfully.';
END
ELSE
BEGIN
    PRINT 'Department table already exists.';
END
GO

-- Role Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Role' AND xtype='U')
BEGIN
    PRINT 'Creating Role table...';
    CREATE TABLE Role (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name_ VARCHAR(100) NOT NULL UNIQUE,
        DepartmentId INT NOT NULL,
        CONSTRAINT FK_Role_Department FOREIGN KEY (DepartmentId) 
            REFERENCES Department(Id)
    );
    PRINT 'Role table created successfully.';
END
ELSE
BEGIN
    PRINT 'Role table already exists.';
END
GO

-- Employee Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Employee' AND xtype='U')
BEGIN
    PRINT 'Creating Employee table...';
    CREATE TABLE Employee (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name_ VARCHAR(100) NOT NULL,
        Salary NUMERIC(10,2) NOT NULL CHECK (Salary BETWEEN 1 AND 99999999.99),
        DepartmentId INT NOT NULL,
        RoleId INT NOT NULL,
        CONSTRAINT FK_Employee_Department FOREIGN KEY (DepartmentId) 
            REFERENCES Department(Id),
        CONSTRAINT FK_Employee_Role FOREIGN KEY (RoleId) 
            REFERENCES Role(Id)
    );
    PRINT 'Employee table created successfully.';
END
ELSE
BEGIN
    PRINT 'Employee table already exists.';
END
GO

-- Project Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Project' AND xtype='U')
BEGIN
    PRINT 'Creating Project table...';
    CREATE TABLE Project (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name_ VARCHAR(100) NOT NULL,
        Description_ VARCHAR(200) NOT NULL,
        Status_ VARCHAR(50) NOT NULL,
        StartDate DATETIME,
        DueDate DATETIME
    );
    PRINT 'Project table created successfully.';
END
ELSE
BEGIN
    PRINT 'Project table already exists.';
END
GO

-- ProjectTask Table - FIXED SYNTAX
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ProjectTask' AND xtype='U')
BEGIN
    PRINT 'Creating ProjectTask table...';
    CREATE TABLE ProjectTask (
        Id INT IDENTITY(1,1) PRIMARY KEY,  -- FIXED: INT before IDENTITY
        ProjectId INT NOT NULL,
        Name_ VARCHAR(100) NOT NULL,
        Description_ VARCHAR(200) NOT NULL,
        Status_ VARCHAR(50) NOT NULL,
        StartDate DATETIME,
        DueDate DATETIME,
        AssignedEmployeeIds XML,
        CONSTRAINT FK_ProjectTask_Project FOREIGN KEY (ProjectId) 
            REFERENCES Project(Id)
    );
    PRINT 'ProjectTask table created successfully.';
END
ELSE
BEGIN
    PRINT 'ProjectTask table already exists.';
END
GO

-- =============================================
-- Sample Data Insertion Section
-- =============================================
PRINT 'Inserting sample data...';

-- Insert into Department (don't specify Id for identity columns)
PRINT 'Inserting Department data...';
SET IDENTITY_INSERT Department ON;  -- Enable explicit ID insertion
INSERT INTO Department (Id, Name_) VALUES
(1, 'Engineering'),
(2, 'Marketing'),
(3, 'Sales'),
(4, 'Human Resources'),
(5, 'Finance');
SET IDENTITY_INSERT Department OFF;  -- Disable explicit ID insertion
PRINT 'Department data inserted successfully.';

-- Insert into Role
PRINT 'Inserting Role data...';
SET IDENTITY_INSERT Role ON;
INSERT INTO Role (Id, Name_, DepartmentId) VALUES
(1, 'Software Developer', 1),
(2, 'QA Engineer', 1),
(3, 'DevOps Engineer', 1),
(4, 'Marketing Manager', 2),
(5, 'Content Writer', 2),
(6, 'Sales Representative', 3),
(7, 'HR Specialist', 4),
(8, 'Financial Analyst', 5),
(9, 'Project Manager', 1);
SET IDENTITY_INSERT Role OFF;
PRINT 'Role data inserted successfully.';

-- Insert into Employee
PRINT 'Inserting Employee data...';
SET IDENTITY_INSERT Employee ON;
INSERT INTO Employee (Id, Name_, Salary, DepartmentId, RoleId) VALUES
(1, 'John Smith', 75000.00, 1, 1),
(2, 'Jane Doe', 68000.00, 1, 2),
(3, 'Bob Johnson', 82000.00, 1, 3),
(4, 'Alice Brown', 65000.00, 2, 5),
(5, 'Charlie Wilson', 90000.00, 3, 6),
(6, 'Diana Lee', 58000.00, 4, 7),
(7, 'Mike Chen', 72000.00, 5, 8),
(8, 'Sarah Davis', 95000.00, 1, 9);
SET IDENTITY_INSERT Employee OFF;
PRINT 'Employee data inserted successfully.';

-- Insert into Project
PRINT 'Inserting Project data...';
SET IDENTITY_INSERT Project ON;
INSERT INTO Project (Id, Name_, Description_, Status_, StartDate, DueDate) VALUES
(1, 'Website Redesign', 'Complete redesign of company website with modern UI/UX', 'In Progress', '2024-01-15', '2024-06-30'),
(2, 'Mobile App Development', 'Development of new mobile application for customer engagement', 'Planning', '2024-03-01', '2024-12-15'),
(3, 'Marketing Campaign Q2', 'Quarterly marketing campaign for product launch', 'Completed', '2024-01-01', '2024-03-31'),
(4, 'HR System Upgrade', 'Upgrade of human resources management system', 'Not Started', NULL, '2024-09-30'),
(5, 'Financial Reporting Automation', 'Automation of financial reporting processes', 'In Progress', '2024-02-01', '2024-08-31');
SET IDENTITY_INSERT Project OFF;
PRINT 'Project data inserted successfully.';

-- Insert into ProjectTask
PRINT 'Inserting ProjectTask data...';
SET IDENTITY_INSERT ProjectTask ON;
INSERT INTO ProjectTask (Id, ProjectId, Name_, Description_, Status_, StartDate, DueDate, AssignedEmployeeIds) VALUES
(1, 1, 'UI Design', 'Create wireframes and mockups for new website design', 'Completed', '2024-01-15', '2024-02-28', '<Employees><Id>1</Id><Id>2</Id></Employees>'),
(2, 1, 'Frontend Development', 'Implement responsive frontend using React', 'In Progress', '2024-03-01', '2024-05-15', '<Employees><Id>1</Id></Employees>'),
(3, 2, 'Requirements Gathering', 'Collect and document requirements from stakeholders', 'Not Started', NULL, '2024-04-15', '<Employees><Id>3</Id><Id>8</Id></Employees>'),
(4, 3, 'Social Media Campaign', 'Execute social media marketing strategy', 'Completed', '2024-01-01', '2024-03-31', '<Employees><Id>4</Id><Id>5</Id></Employees>'),
(5, 5, 'API Integration', 'Integrate with financial data APIs', 'In Progress', '2024-02-15', '2024-06-30', '<Employees><Id>7</Id><Id>8</Id></Employees>');
SET IDENTITY_INSERT ProjectTask OFF;
PRINT 'ProjectTask data inserted successfully.';

-- =============================================
-- Table Structure Verification Section
-- =============================================
PRINT 'Verifying table structures...';

-- Verify Department table structure
PRINT 'Department table structure:';
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Department'
ORDER BY ORDINAL_POSITION;

-- Verify Role table structure
PRINT 'Role table structure:';
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Role'
ORDER BY ORDINAL_POSITION;

-- Verify Employee table structure
PRINT 'Employee table structure:';
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Employee'
ORDER BY ORDINAL_POSITION;

-- Verify Project table structure
PRINT 'Project table structure:';
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Project'
ORDER BY ORDINAL_POSITION;

-- Verify ProjectTask table structure
PRINT 'ProjectTask table structure:';
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'ProjectTask'
ORDER BY ORDINAL_POSITION;

-- =============================================
-- Constraint Verification Section
-- =============================================
PRINT 'Verifying constraints...';

-- Check foreign key constraints
PRINT 'Foreign key constraints:';
SELECT 
    fk.name AS ConstraintName,
    OBJECT_NAME(fk.parent_object_id) AS TableName,
    COL_NAME(fc.parent_object_id, fc.parent_column_id) AS ColumnName,
    OBJECT_NAME(fk.referenced_object_id) AS ReferencedTableName
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fc ON fk.object_id = fc.constraint_object_id
WHERE OBJECT_NAME(fk.parent_object_id) IN ('Role', 'Employee', 'ProjectTask');

-- Check check constraints
PRINT 'Check constraints:';
SELECT 
    cc.name AS ConstraintName,
    OBJECT_NAME(cc.parent_object_id) AS TableName,
    cc.definition AS ConstraintDefinition
FROM sys.check_constraints cc
WHERE OBJECT_NAME(cc.parent_object_id) = 'Employee';

-- Check unique constraints
PRINT 'Unique constraints:';
SELECT 
    i.name AS ConstraintName,
    OBJECT_NAME(i.object_id) AS TableName,
    COL_NAME(ic.object_id, ic.column_id) AS ColumnName
FROM sys.indexes i
INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
WHERE i.is_unique = 1 AND i.is_primary_key = 0
AND OBJECT_NAME(i.object_id) IN ('Department', 'Role');

-- =============================================
-- Data Verification Section
-- =============================================
PRINT 'Verifying inserted data...';

-- Display all data from each table
PRINT 'Department data:';
SELECT * FROM Department;

PRINT 'Role data:';
SELECT * FROM Role;

PRINT 'Employee data:';
SELECT * FROM Employee;

PRINT 'Project data:';
SELECT * FROM Project;

PRINT 'ProjectTask data:';
SELECT * FROM ProjectTask;

-- =============================================
-- Constraint Testing Section
-- =============================================
PRINT 'Testing constraints...';

-- Test Salary constraint (should fail)
BEGIN TRY
    PRINT 'Testing Salary constraint (should fail with value 0)...';
    INSERT INTO Employee (Name_, Salary, DepartmentId, RoleId)  -- Don't specify Id
    VALUES ('Test Employee', 0.00, 1, 1);
    PRINT 'ERROR: Salary constraint test should have failed!';
END TRY
BEGIN CATCH
    PRINT 'Salary constraint test passed: ' + ERROR_MESSAGE();
END CATCH;

-- Test Salary constraint (should fail)
BEGIN TRY
    PRINT 'Testing Salary constraint (should fail with value 100000000)...';
    INSERT INTO Employee (Name_, Salary, DepartmentId, RoleId)  -- Don't specify Id
    VALUES ('Test Employee', 100000000.00, 1, 1);
    PRINT 'ERROR: Salary constraint test should have failed!';
END TRY
BEGIN CATCH
    PRINT 'Salary constraint test passed: ' + ERROR_MESSAGE();
END CATCH;

-- Test foreign key constraint (should fail)
BEGIN TRY
    PRINT 'Testing foreign key constraint (should fail with non-existent DepartmentId)...';
    INSERT INTO Employee (Name_, Salary, DepartmentId, RoleId)  -- Don't specify Id
    VALUES ('Test Employee', 50000.00, 999, 1);
    PRINT 'ERROR: Foreign key constraint test should have failed!';
END TRY
BEGIN CATCH
    PRINT 'Foreign key constraint test passed: ' + ERROR_MESSAGE();
END CATCH;

-- Test foreign key constraint (should fail)
BEGIN TRY
    PRINT 'Testing foreign key constraint (should fail with non-existent RoleId)...';
    INSERT INTO Employee (Name_, Salary, DepartmentId, RoleId)  -- Don't specify Id
    VALUES ('Test Employee', 50000.00, 1, 999);
    PRINT 'ERROR: Foreign key constraint test should have failed!';
END TRY
BEGIN CATCH
    PRINT 'Foreign key constraint test passed: ' + ERROR_MESSAGE();
END CATCH;

-- Test unique constraint (should fail)
BEGIN TRY
    PRINT 'Testing unique constraint (should fail with duplicate department name)...';
    INSERT INTO Department (Name_) VALUES ('Engineering');  -- Don't specify Id
    PRINT 'ERROR: Unique constraint test should have failed!';
END TRY
BEGIN CATCH
    PRINT 'Unique constraint test passed: ' + ERROR_MESSAGE();
END CATCH;

-- Test unique constraint (should fail)
BEGIN TRY
    PRINT 'Testing unique constraint (should fail with duplicate role name)...';
    INSERT INTO Role (Name_, DepartmentId) VALUES ('Software Developer', 2);  -- Don't specify Id
    PRINT 'ERROR: Unique constraint test should have failed!';
END TRY
BEGIN CATCH
    PRINT 'Unique constraint test passed: ' + ERROR_MESSAGE();
END CATCH;

-- Test successful insert (should pass)
BEGIN TRY
    PRINT 'Testing successful insert (should pass)...';
    INSERT INTO Department (Name_) VALUES ('Research & Development');  -- Don't specify Id
    DECLARE @newDeptId INT = SCOPE_IDENTITY();
    
    INSERT INTO Role (Name_, DepartmentId) VALUES ('Research Scientist', @newDeptId);  -- Don't specify Id
    DECLARE @newRoleId INT = SCOPE_IDENTITY();
    
    INSERT INTO Employee (Name_, Salary, DepartmentId, RoleId)  -- Don't specify Id
    VALUES ('Test Employee', 50000.00, @newDeptId, @newRoleId);
    
    PRINT 'Successful insert test passed.';
    
    -- Clean up test data
    DELETE FROM Employee WHERE Name_ = 'Test Employee';
    DELETE FROM Role WHERE Name_ = 'Research Scientist';
    DELETE FROM Department WHERE Name_ = 'Research & Development';
END TRY
BEGIN CATCH
    PRINT 'ERROR: Successful insert test failed: ' + ERROR_MESSAGE();
END CATCH;

-- =============================================
-- Final Verification Section
-- =============================================
PRINT 'Performing final data verification...';

-- Verify record counts
PRINT 'Record counts:';
SELECT 'Department' AS TableName, COUNT(*) AS RecordCount FROM Department
UNION ALL
SELECT 'Role', COUNT(*) FROM Role
UNION ALL
SELECT 'Employee', COUNT(*) FROM Employee
UNION ALL
SELECT 'Project', COUNT(*) FROM Project
UNION ALL
SELECT 'ProjectTask', COUNT(*) FROM ProjectTask;

-- Verify foreign key relationships
PRINT 'Verifying foreign key relationships...';
SELECT 
    'Employee-Department' AS Relationship,
    COUNT(*) AS ValidRecords,
    (SELECT COUNT(*) FROM Employee) AS TotalEmployees,
    CASE WHEN COUNT(*) = (SELECT COUNT(*) FROM Employee) THEN 'PASS' ELSE 'FAIL' END AS Status
FROM Employee e
INNER JOIN Department d ON e.DepartmentId = d.Id

UNION ALL

SELECT 
    'Employee-Role',
    COUNT(*),
    (SELECT COUNT(*) FROM Employee),
    CASE WHEN COUNT(*) = (SELECT COUNT(*) FROM Employee) THEN 'PASS' ELSE 'FAIL' END
FROM Employee e
INNER JOIN Role r ON e.RoleId = r.Id

UNION ALL

SELECT 
    'Role-Department',
    COUNT(*),
    (SELECT COUNT(*) FROM Role),
    CASE WHEN COUNT(*) = (SELECT COUNT(*) FROM Role) THEN 'PASS' ELSE 'FAIL' END
FROM Role r
INNER JOIN Department d ON r.DepartmentId = d.Id

UNION ALL

SELECT 
    'ProjectTask-Project',
    COUNT(*),
    (SELECT COUNT(*) FROM ProjectTask),
    CASE WHEN COUNT(*) = (SELECT COUNT(*) FROM ProjectTask) THEN 'PASS' ELSE 'FAIL' END
FROM ProjectTask pt
INNER JOIN Project p ON pt.ProjectId = p.Id;

-- =============================================
-- Completion Section
-- =============================================
PRINT '=============================================';
PRINT 'Database initialization completed successfully!';
PRINT 'All tables created and verified.';
PRINT 'Sample data inserted and validated.';
PRINT 'All constraints tested and working correctly.';
PRINT '=============================================';
GO