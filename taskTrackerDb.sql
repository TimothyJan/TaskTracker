-- =============================================
-- TaskTrackerDb Database Initialization Script
-- =============================================

-- Check if database exists and create if it doesn't
IF NOT EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = 'TaskTrackerDb')
BEGIN
    PRINT 'Creating database TaskTrackerDb...'
    CREATE DATABASE TaskTrackerDb
    PRINT 'Database TaskTrackerDb created successfully.'
END
ELSE
BEGIN
    PRINT 'Database TaskTrackerDb already exists.'
END
GO

-- Use the database
USE TaskTrackerDb
GO

-- =============================================
-- Create Tables with Constraints
-- =============================================

-- Department Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Department' AND xtype='U')
BEGIN
    PRINT 'Creating Department table...'
    CREATE TABLE Department (
        Id INT PRIMARY KEY,
        Name VARCHAR(100) NOT NULL UNIQUE
    )
    PRINT 'Department table created successfully.'
END
ELSE
BEGIN
    PRINT 'Department table already exists.'
END
GO

-- Role Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Role' AND xtype='U')
BEGIN
    PRINT 'Creating Role table...'
    CREATE TABLE Role (
        Id INT PRIMARY KEY,
        Name VARCHAR(100) NOT NULL UNIQUE,
        DepartmentId INT NOT NULL,
        CONSTRAINT FK_Role_Department FOREIGN KEY (DepartmentId) 
            REFERENCES Department(Id)
    )
    PRINT 'Role table created successfully.'
END
ELSE
BEGIN
    PRINT 'Role table already exists.'
END
GO

-- Employee Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Employee' AND xtype='U')
BEGIN
    PRINT 'Creating Employee table...'
    CREATE TABLE Employee (
        Id INT PRIMARY KEY,
        Name VARCHAR(100) NOT NULL,
        Salary NUMERIC(10,2) NOT NULL CHECK (Salary BETWEEN 1 AND 99999999.99),
        DepartmentId INT NOT NULL,
        RoleId INT NOT NULL,
        CONSTRAINT FK_Employee_Department FOREIGN KEY (DepartmentId) 
            REFERENCES Department(Id),
        CONSTRAINT FK_Employee_Role FOREIGN KEY (RoleId) 
            REFERENCES Role(Id)
    )
    PRINT 'Employee table created successfully.'
END
ELSE
BEGIN
    PRINT 'Employee table already exists.'
END
GO

-- Project Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Project' AND xtype='U')
BEGIN
    PRINT 'Creating Project table...'
    CREATE TABLE Project (
        Id INT PRIMARY KEY,
        ProjectName VARCHAR(100) NOT NULL,
        Description VARCHAR(200) NOT NULL,
        Status VARCHAR(50) NOT NULL,
        StartDate DATETIME,
        DueDate DATETIME
    )
    PRINT 'Project table created successfully.'
END
ELSE
BEGIN
    PRINT 'Project table already exists.'
END
GO

-- ProjectTask Table (using XML for employee IDs array)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ProjectTask' AND xtype='U')
BEGIN
    PRINT 'Creating ProjectTask table...'
    CREATE TABLE ProjectTask (
        Id INT PRIMARY KEY,
        ProjectId INT NOT NULL,
        Name VARCHAR(100) NOT NULL,
        Description VARCHAR(200) NOT NULL,
        Status VARCHAR(50) NOT NULL,
        StartDate DATETIME,
        DueDate DATETIME,
        AssignedEmployeeIds XML, -- Using XML to store array of employee IDs
        CONSTRAINT FK_ProjectTask_Project FOREIGN KEY (ProjectId) 
            REFERENCES Project(Id)
    )
    PRINT 'ProjectTask table created successfully.'
END
ELSE
BEGIN
    PRINT 'ProjectTask table already exists.'
END
GO

-- =============================================
-- Insert Sample Data
-- =============================================

PRINT 'Inserting sample data...'

-- Insert into Department
IF NOT EXISTS (SELECT * FROM Department)
BEGIN
    INSERT INTO Department (Id, Name) VALUES
    (1, 'Engineering'),
    (2, 'Marketing'),
    (3, 'Sales'),
    (4, 'Human Resources')
    PRINT 'Sample data inserted into Department table.'
END

-- Insert into Role
IF NOT EXISTS (SELECT * FROM Role)
BEGIN
    INSERT INTO Role (Id, Name, DepartmentId) VALUES
    (1, 'Software Developer', 1),
    (2, 'QA Engineer', 1),
    (3, 'DevOps Engineer', 1),
    (4, 'Marketing Manager', 2),
    (5, 'Content Writer', 2),
    (6, 'Sales Representative', 3),
    (7, 'HR Specialist', 4)
    PRINT 'Sample data inserted into Role table.'
END

-- Insert into Employee
IF NOT EXISTS (SELECT * FROM Employee)
BEGIN
    INSERT INTO Employee (Id, Name, Salary, DepartmentId, RoleId) VALUES
    (1, 'John Smith', 75000.00, 1, 1),
    (2, 'Jane Doe', 68000.00, 1, 2),
    (3, 'Bob Johnson', 82000.00, 1, 3),
    (4, 'Alice Brown', 65000.00, 2, 5),
    (5, 'Charlie Wilson', 90000.00, 3, 6),
    (6, 'Diana Lee', 58000.00, 4, 7)
    PRINT 'Sample data inserted into Employee table.'
END

-- Insert into Project
IF NOT EXISTS (SELECT * FROM Project)
BEGIN
    INSERT INTO Project (Id, ProjectName, Description, Status, StartDate, DueDate) VALUES
    (1, 'Website Redesign', 'Complete redesign of company website with modern UI/UX', 'In Progress', '2024-01-15', '2024-06-30'),
    (2, 'Mobile App Development', 'Development of new mobile application for customer engagement', 'Planning', '2024-03-01', '2024-12-15'),
    (3, 'Marketing Campaign Q2', 'Quarterly marketing campaign for product launch', 'Completed', '2024-01-01', '2024-03-31')
    PRINT 'Sample data inserted into Project table.'
END

-- Insert into ProjectTask
IF NOT EXISTS (SELECT * FROM ProjectTask)
BEGIN
    INSERT INTO ProjectTask (Id, ProjectId, Name, Description, Status, StartDate, DueDate, AssignedEmployeeIds) VALUES
    (1, 1, 'UI Design', 'Create wireframes and mockups for new website design', 'Completed', '2024-01-15', '2024-02-28', '<Employees><Id>1</Id><Id>2</Id></Employees>'),
    (2, 1, 'Frontend Development', 'Implement responsive frontend using React', 'In Progress', '2024-03-01', '2024-05-15', '<Employees><Id>1</Id></Employees>'),
    (3, 2, 'Requirements Gathering', 'Collect and document requirements from stakeholders', 'Not Started', NULL, '2024-04-15', '<Employees><Id>3</Id></Employees>'),
    (4, 3, 'Social Media Campaign', 'Execute social media marketing strategy', 'Completed', '2024-01-01', '2024-03-31', '<Employees><Id>4</Id><Id>5</Id></Employees>')
    PRINT 'Sample data inserted into ProjectTask table.'
END

-- =============================================
-- Verify Table Structures
-- =============================================

PRINT 'Verifying table structures...'

-- Verify Department table structure
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Department')
BEGIN
    PRINT 'Department table structure:'
    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Department'
    ORDER BY ORDINAL_POSITION
END

-- Verify Role table structure
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Role')
BEGIN
    PRINT 'Role table structure:'
    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Role'
    ORDER BY ORDINAL_POSITION
END

-- Verify Employee table structure
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Employee')
BEGIN
    PRINT 'Employee table structure:'
    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Employee'
    ORDER BY ORDINAL_POSITION
END

-- =============================================
-- Verify Constraints
-- =============================================

PRINT 'Verifying constraints...'

-- Check foreign key constraints
SELECT 
    fk.name AS ConstraintName,
    OBJECT_NAME(fk.parent_object_id) AS TableName,
    COL_NAME(fc.parent_object_id, fc.parent_column_id) AS ColumnName,
    OBJECT_NAME(fk.referenced_object_id) AS ReferencedTableName
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fc ON fk.object_id = fc.constraint_object_id
WHERE OBJECT_NAME(fk.parent_object_id) IN ('Role', 'Employee', 'ProjectTask')

-- Check check constraints
SELECT 
    cc.name AS ConstraintName,
    OBJECT_NAME(cc.parent_object_id) AS TableName,
    cc.definition AS ConstraintDefinition
FROM sys.check_constraints cc
WHERE OBJECT_NAME(cc.parent_object_id) = 'Employee'

-- =============================================
-- Verify Inserted Data
-- =============================================

PRINT 'Verifying inserted data...'

-- Display all data from each table
PRINT 'Department data:'
SELECT * FROM Department

PRINT 'Role data:'
SELECT * FROM Role

PRINT 'Employee data:'
SELECT * FROM Employee

PRINT 'Project data:'
SELECT * FROM Project

PRINT 'ProjectTask data:'
SELECT * FROM ProjectTask

-- =============================================
-- Test Constraints
-- =============================================

PRINT 'Testing constraints...'

BEGIN TRY
    -- Test Salary constraint (should fail)
    PRINT 'Testing Salary constraint (should fail)...'
    INSERT INTO Employee (Id, Name, Salary, DepartmentId, RoleId) 
    VALUES (100, 'Test Employee', 0.00, 1, 1)
END TRY
BEGIN CATCH
    PRINT 'Salary constraint test passed: ' + ERROR_MESSAGE()
END CATCH

BEGIN TRY
    -- Test foreign key constraint (should fail)
    PRINT 'Testing foreign key constraint (should fail)...'
    INSERT INTO Employee (Id, Name, Salary, DepartmentId, RoleId) 
    VALUES (101, 'Test Employee', 50000.00, 999, 1)
END TRY
BEGIN CATCH
    PRINT 'Foreign key constraint test passed: ' + ERROR_MESSAGE()
END CATCH

BEGIN TRY
    -- Test unique constraint (should fail)
    PRINT 'Testing unique constraint (should fail)...'
    INSERT INTO Department (Id, Name) VALUES (100, 'Engineering')
END TRY
BEGIN CATCH
    PRINT 'Unique constraint test passed: ' + ERROR_MESSAGE()
END CATCH

PRINT 'Database initialization completed successfully!'
GO