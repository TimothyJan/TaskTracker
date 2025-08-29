namespace TaskTracker.Models
{
    public static class ErrorMessages
    {
        // Generic errors
        public const string ValidationFailed = "Validation failed.";
        public const string NotFound = "{0} not found.";
        public const string AlreadyExists = "{0} already exists.";
        public const string InternalServerError = "An internal server error occurred.";
        public const string UrlBodyMismatch = "{0} in URL does not match the request body.";

        // Entity-specific errors
        public const string DepartmentNotFound = "Department {0} not found.";
        public const string DepartmentAlreadyExists = "Department {0} [{1}] already exists.";
        public const string RoleNotFound = "Role {0} not found.";
        public const string RoleAlreadyExists = "Role {0} [{1}] already exists.";
        public const string EmployeeNotFound = "Employee {0} not found.";

        // Validation errors
        public const string InvalidLength = "{0} must be between {1} and {2} characters.";
        public const string InvalidRange = "{0} must be between {1} and {2}.";

    }

    public static class SuccessMessages
    {
        public const string Retrieved = "{0} retrieved successfully.";
        public const string Created = "{0} created successfully.";
        public const string Updated = "{0} updated successfully.";
        public const string Deleted = "{0} deleted successfully.";
        public const string CountRetrieved = "{0} count retrieved successfully.";
    }
}