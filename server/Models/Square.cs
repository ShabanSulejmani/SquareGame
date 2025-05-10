using System.ComponentModel.DataAnnotations;

namespace wizardwork_square_test.Models
{
    public class Square
    {
        // A unique identifier for each square
        public Guid Id { get; set; } = Guid.NewGuid();
        
        // The X position of the square in the grid (must be non-negative)
        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "X position must be a non-negative integer")]
        public int X { get; set; }
        
        // The Y position of the square in the grid (must be non-negative)
        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Y position must be a non-negative integer")]
        public int Y { get; set; }
        
        // The color of the square in hex format (e.g., #FF5733)
        [Required]
        [RegularExpression(@"^#([A-Fa-f0-9]{6})$", ErrorMessage = "Color must be a valid hex color code (e.g., #FF5733)")]
        public string Color { get; set; } = string.Empty;
        
        // The time when the square was created
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}