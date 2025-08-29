namespace TaskTracker.Models;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public string? Details { get; set; }
    public List<string>? Errors { get; set; }
    public int? StatusCode { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public static class ApiResponse
{
    public static ApiResponse<T> Success<T>(T? data, string message = "Success.", int statusCode = 200)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = data,
            StatusCode = statusCode
        };
    }

    public static ApiResponse<T> Failure<T>(string message, List<string>? errors = null, int? statusCode = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Errors = errors ?? new List<string>(),
            StatusCode = statusCode ?? 400
        };
    }

    public static ApiResponse<object> NotFound(string message = "Resource not found.")
    {
        return new ApiResponse<object>
        {
            Success = false,
            Message = message,
            StatusCode = 404
        };
    }

    public static ApiResponse<object> ValidationError(List<string> errors)
    {
        return new ApiResponse<object>
        {
            Success = false,
            Message = "Validation failed.",
            Errors = errors ?? new List<string>(),
            StatusCode = 400
        };
    }
}