using System.Text.Json;
using wizardwork_square_test.Models;

namespace wizardwork_square_test.Services
{
// Gränssnittet definierar vilka metoder tjänsten måste implementera
    public interface ISquareService
    {
        Task<IEnumerable<Square>> GetAllSquaresAsync();
        Task<Square> AddSquareAsync(Square square);
        Task ClearAllSquaresAsync();
    }

    // Den faktiska implementationen av kvadrattjänsten
    public class SquareService : ISquareService
    {
        private readonly string _dataFilePath;
        private readonly ILogger<SquareService> _logger;
        private readonly JsonSerializerOptions _jsonOptions;

        // Konstruktor - initierar tjänsten och säkerställer att datafilen existerar
        public SquareService(ILogger<SquareService> logger)
        {
            _logger = logger;
            
            // Skapa en absolut sökväg för datafilen
            string baseDir = Directory.GetCurrentDirectory();
            _dataFilePath = Path.Combine(baseDir, "Data", "squares.json");
            _logger.LogInformation($"Data file path: {_dataFilePath}");
            
            // Alternativ för JSON-serialisering med formattering för läsbarhet
            _jsonOptions = new JsonSerializerOptions { WriteIndented = true };

            // Säkerställ att Data-katalogen existerar
            var dataDirectory = Path.GetDirectoryName(_dataFilePath);
            if (!string.IsNullOrEmpty(dataDirectory) && !Directory.Exists(dataDirectory))
            {
                _logger.LogInformation($"Creating directory: {dataDirectory}");
                Directory.CreateDirectory(dataDirectory);
            }
            
            // Skapa squares.json-filen om den inte existerar
            if (!File.Exists(_dataFilePath))
            {
                _logger.LogInformation($"Creating initial squares.json file");
                // Initialisera med en tom lista av kvadrater
                File.WriteAllText(_dataFilePath, JsonSerializer.Serialize(new List<Square>(), _jsonOptions));
            }
        }

        // Hämta alla kvadrater från datafilen
        public async Task<IEnumerable<Square>> GetAllSquaresAsync()
        {
            try
            {
                _logger.LogInformation("Retrieving all squares");
                
                // Läs hela filen som text
                var jsonData = await File.ReadAllTextAsync(_dataFilePath);
                
                // Konvertera JSON-texten till en lista av Square-objekt
                // Om deserialiseringen misslyckas, returnera en tom lista
                var squares = JsonSerializer.Deserialize<List<Square>>(jsonData, _jsonOptions) ?? new List<Square>();
                _logger.LogInformation($"Retrieved {squares.Count} squares");
                return squares;
            }
            catch (Exception ex)
            {
                // Logga eventuella fel
                _logger.LogError(ex, "Error retrieving squares from data file");
                
                // Kasta ett mer specifikt undantag
                throw new ApplicationException("Failed to retrieve squares data", ex);
            }
        }

        // Lägg till en ny kvadrat i datafilen
        public async Task<Square> AddSquareAsync(Square square)
        {
            // Validera att en kvadrat tillhandahölls
            if (square == null)
            {
                _logger.LogWarning("Attempted to add null square");
                throw new ArgumentNullException(nameof(square));
            }

            try
            {
                _logger.LogInformation($"Adding square at position ({square.X}, {square.Y}) with color {square.Color}");

                // Hämta alla befintliga kvadrater
                var squares = (await GetAllSquaresAsync()).ToList();
                
                // Kontrollera om en kvadrat redan existerar på denna position
                if (squares.Any(s => s.X == square.X && s.Y == square.Y))
                {
                    _logger.LogWarning($"A square already exists at position ({square.X}, {square.Y})");
                    throw new InvalidOperationException($"A square already exists at position ({square.X}, {square.Y})");
                }

                // Säkerställ att kvadraten har ett unikt ID och tidsstämpel
                square.Id = Guid.NewGuid();
                square.CreatedAt = DateTime.UtcNow;
                
                // Lägg till den nya kvadraten i listan
                squares.Add(square);
                
                try
                {
                    // Spara den uppdaterade listan tillbaka till filen
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
                // Logga eventuella oväntade fel
                _logger.LogError(ex, $"Error adding square at position ({square.X}, {square.Y})");
                throw new ApplicationException("Failed to add square data", ex);
            }
        }

        // Rensa alla kvadrater från datafilen
        public async Task ClearAllSquaresAsync()
        {
            try
            {
                _logger.LogInformation("Clearing all squares");
                // Skriv över filen med en tom lista
                await File.WriteAllTextAsync(_dataFilePath, JsonSerializer.Serialize(new List<Square>(), _jsonOptions));
                _logger.LogInformation("Successfully cleared all squares");
            }
            catch (Exception ex)
            {
                // Logga eventuella fel
                _logger.LogError(ex, "Error clearing squares data");
                throw new ApplicationException("Failed to clear squares data", ex);
            }
        }
    }
}