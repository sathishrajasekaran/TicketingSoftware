using System.ComponentModel.DataAnnotations;

namespace HelpDesk.Api.Models;

public class Ticket
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Title is required.")]
    [StringLength(150, ErrorMessage = "Title cannot exceed 150 characters.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "CreatedBy is required.")]
    [StringLength(100)]
    public string CreatedBy { get; set; } = string.Empty;

    [Required]
    [RegularExpression("^(Low|Medium|High)$",
        ErrorMessage = "Priority must be Low, Medium, or High.")]
    public string Priority { get; set; } = "Medium";

    [Required]
    [RegularExpression("^(Open|In Progress|Resolved)$",
        ErrorMessage = "Status must be Open, In Progress, or Resolved.")]
    public string Status { get; set; } = "Open";

    [StringLength(100)]
    public string? AssignedTo { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}