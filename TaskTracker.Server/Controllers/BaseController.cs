using Microsoft.AspNetCore.Mvc;
using TaskTracker.Models;

namespace testLevel123.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseController : ControllerBase
    {
        protected IActionResult ApiResult<T>(ApiResponse<T> response)
        {
            return StatusCode(response.StatusCode ?? (response.Success ? 200 : 400), response);
        }

        protected IActionResult Success<T>(T data, string message = "Success", int statusCode = 200)
        {
            return ApiResult(ApiResponse.Success(data, message, statusCode));
        }

        protected IActionResult SuccessMessage(string message = "Success", int statusCode = 200)
        {
            return ApiResult(ApiResponse.Success<object>(null, message, statusCode));
        }

        protected IActionResult Failure(string message, List<string>? errors = null, int statusCode = 400)
        {
            return ApiResult(ApiResponse.Failure<object>(message, errors ?? new List<string>(), statusCode));
        }

        protected IActionResult NotFound(string message = "Resource not found")
        {
            return ApiResult(ApiResponse.NotFound(message));
        }

        protected IActionResult ValidationError(List<string> errors)
        {
            return ApiResult(ApiResponse.ValidationError(errors ?? new List<string>()));
        }

        protected IActionResult Conflict(string message)
        {
            return Failure(message, statusCode: 409);
        }

        protected IActionResult InternalError(string message = "An internal error occurred")
        {
            return Failure(message, statusCode: 500);
        }

        // Helper method to extract validation errors
        protected List<string> GetModelStateErrors()
        {
            return ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .Where(error => !string.IsNullOrEmpty(error))
                .ToList();
        }
    }
}