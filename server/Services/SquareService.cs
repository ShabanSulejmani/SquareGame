using System.Text.Json;
using wizardwork_square_test.Models;

namespace wizardwork_square_test.Services
{
    // Interface defines what methods the service must implement
    public interface ISquareService
    {
        Task<IEnumerable<Square>> GetAllSquaresAsync();
        Task<Square> AddSquareAsync(Square square);
        Task ClearAllSquaresAsync();
    }

    // The actual implementation of the square service
    public class SquareService : ISquareService
    {
        private readonly string _dataFilePath;
        private readonly ILogger<SquareService> _logger;
        private readonly JsonSerializerOptions _jsonOptions;

        // Constructor - initializes the service and ensures the data file exists
        public SquareService(ILogger<SquareService> logger)
        {
            _logger = logger;
            
            // Path where we'll store our squares data
            _dataFilePath = "Data/squares.json";
            
            // Options for JSON serialization with pretty printing
            _jsonOptions = new JsonSerializerOptions { WriteIndented = true };

            // Make sure the Data directory exists
            var dataDirectory = Path.GetDirectoryName(_dataFilePath);
            if (!Directory.Exists(dataDirectory))
            {
                Directory.CreateDirectory(dataDirectory);
            }
            
            // Create the squares.json file if it doesn't exist
            if (!File.Exists(_dataFilePath))
            {
                // Initialize with an empty list of squares
                File.WriteAllText(_dataFilePath, JsonSerializer.Serialize(new List<Square>(), _jsonOptions));
            }
        }

        // Get all squares from the data file
        public async Task<IEnumerable<Square>> GetAllSquaresAsync()
        {
            try
            {
                // Read the entire file as text
                var jsonData = await File.ReadAllTextAsync(_dataFilePath);
                
                // Convert the JSON text to a list of Square objects
                // If deserializing fails, return an empty list
                return JsonSerializer.Deserialize<List<Square>>(jsonData, _jsonOptions) ?? new List<Square>();
            }
            catch (Exception ex)
            {
                // Log any errors
                _logger.LogError(ex, "Error retrieving squares from data file");
                
                // Throw a more specific exception
                throw new ApplicationException("Failed to retrieve squares data", ex);
            }
        }

        // Add a new square to the data file
        public async Task<Square> AddSquareAsync(Square square)
        {
            // Validate that a square was provided
            if (square == null)
            {
                throw new ArgumentNullException(nameof(square));
            }

            try
            {
                // Get all existing squares
                var squares = await GetAllSquaresAsync() as List<Square> ?? new List<Square>();
                
                // Check if a square already exists at this position
                if (squares.Any(s => s.X == square.X && s.Y == square.Y))
                {
                    throw new InvalidOperationException($"A square already exists at position ({square.X}, {square.Y})");
                }

                // Ensure the square has a unique ID and timestamp
                square.Id = Guid.NewGuid();
                square.CreatedAt = DateTime.UtcNow;
                
                // Add the new square to the list
                squares.Add(square);
                
                // Save the updated list back to the file
                await File.WriteAllTextAsync(_dataFilePath, JsonSerializer.Serialize(squares, _jsonOptions));
                
                return square;
            }
            catch (Exception ex) when (!(ex is ArgumentNullException || ex is InvalidOperationException))
            {
                // Log any unexpected errors
                _logger.LogError(ex, "Error adding square to data file");
                throw new ApplicationException("Failed to add square data", ex);
            }
        }

        // Clear all squares from the data file
        public async Task ClearAllSquaresAsync()
        {
            try
            {
                // Overwrite the file with an empty list
                await File.WriteAllTextAsync(_dataFilePath, JsonSerializer.Serialize(new List<Square>(), _jsonOptions));
            }
            catch (Exception ex)
            {
                // Log any errors
                _logger.LogError(ex, "Error clearing squares data");
                throw new ApplicationException("Failed to clear squares data", ex);
            }
        }
    }
}