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
            
            // Create an absolute path for the data file
            string baseDir = Directory.GetCurrentDirectory();
            _dataFilePath = Path.Combine(baseDir, "Data", "squares.json");
            _logger.LogInformation($"Data file path: {_dataFilePath}");
            
            // Options for JSON serialization with pretty printing
            _jsonOptions = new JsonSerializerOptions { WriteIndented = true };

            // Make sure the Data directory exists
            var dataDirectory = Path.GetDirectoryName(_dataFilePath);
            if (!string.IsNullOrEmpty(dataDirectory) && !Directory.Exists(dataDirectory))
            {
                _logger.LogInformation($"Creating directory: {dataDirectory}");
                Directory.CreateDirectory(dataDirectory);
            }
            
            // Create the squares.json file if it doesn't exist
            if (!File.Exists(_dataFilePath))
            {
                _logger.LogInformation($"Creating initial squares.json file");
                // Initialize with an empty list of squares
                File.WriteAllText(_dataFilePath, JsonSerializer.Serialize(new List<Square>(), _jsonOptions));
            }
        }

        // Get all squares from the data file
        public async Task<IEnumerable<Square>> GetAllSquaresAsync()
        {
            try
            {
                _logger.LogInformation("Retrieving all squares");
                
                // Read the entire file as text
                var jsonData = await File.ReadAllTextAsync(_dataFilePath);
                
                // Convert the JSON text to a list of Square objects
                // If deserializing fails, return an empty list
                var squares = JsonSerializer.Deserialize<List<Square>>(jsonData, _jsonOptions) ?? new List<Square>();
                _logger.LogInformation($"Retrieved {squares.Count} squares");
                return squares;
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
                _logger.LogWarning("Attempted to add null square");
                throw new ArgumentNullException(nameof(square));
            }

            try
            {
                _logger.LogInformation($"Adding square at position ({square.X}, {square.Y}) with color {square.Color}");

                // Get all existing squares
                var squares = (await GetAllSquaresAsync()).ToList();
                
                // Check if a square already exists at this position
                if (squares.Any(s => s.X == square.X && s.Y == square.Y))
                {
                    _logger.LogWarning($"A square already exists at position ({square.X}, {square.Y})");
                    throw new InvalidOperationException($"A square already exists at position ({square.X}, {square.Y})");
                }

                // Ensure the square has a unique ID and timestamp
                square.Id = Guid.NewGuid();
                square.CreatedAt = DateTime.UtcNow;
                
                // Add the new square to the list
                squares.Add(square);
                
                try
                {
                    // Save the updated list back to the file
                    _logger.LogInformation($"Saving updated squares list with {squares.Count} squares");
                    await File.WriteAllTextAsync(_dataFilePath, JsonSerializer.Serialize(squares, _jsonOptions));
                    _logger.LogInformation($"Successfully added square with ID {square.Id}");
                }
                catch (IOException ioEx)
                {
                    _logger.LogError(ioEx, $"IO error when writing to {_dataFilePath}");
                    throw;
                }
                
                return square;
            }
            catch (Exception ex) when (!(ex is ArgumentNullException || ex is InvalidOperationException || ex is IOException))
            {
                // Log any unexpected errors
                _logger.LogError(ex, $"Error adding square at position ({square.X}, {square.Y})");
                throw new ApplicationException("Failed to add square data", ex);
            }
        }

        // Clear all squares from the data file
        public async Task ClearAllSquaresAsync()
        {
            try
            {
                _logger.LogInformation("Clearing all squares");
                // Overwrite the file with an empty list
                await File.WriteAllTextAsync(_dataFilePath, JsonSerializer.Serialize(new List<Square>(), _jsonOptions));
                _logger.LogInformation("Successfully cleared all squares");
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