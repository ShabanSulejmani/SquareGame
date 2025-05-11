using System.ComponentModel.DataAnnotations;

namespace wizardwork_square_test.Models
{
    public class Square
    {
        // En unik identifierare för varje kvadrat
        public Guid Id { get; set; } = Guid.NewGuid();
        
        // X-positionen för kvadraten i rutnätet (måste vara icke-negativ)
        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "X position must be a non-negative integer")]
        public int X { get; set; }
        
        // X-positionen för kvadraten i rutnätet (måste vara icke-negativ)
        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Y position must be a non-negative integer")]
        public int Y { get; set; }
        
        // Färgen på kvadraten i hex-format (t.ex. #FF5733)
        [Required]
        [RegularExpression(@"^#([A-Fa-f0-9]{6})$", ErrorMessage = "Color must be a valid hex color code (e.g., #FF5733)")]
        public string Color { get; set; } = string.Empty;
        
        // Tidpunkten då kvadraten skapades
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}