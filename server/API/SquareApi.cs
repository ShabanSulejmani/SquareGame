
using wizardwork_square_test.Models;
using wizardwork_square_test.Services;

namespace wizardwork_square_test.Endpoints
{
    public static class SquaresEndpoints
    {
        public static void MapSquaresEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("api/squares");

            // GET: Hämta alla kvadrater
            group.MapGet("/", async (ISquareService squareService, ILogger<Square> logger) =>
            {
                try
                {
                    var squares = await squareService.GetAllSquaresAsync();
                    return Results.Ok(squares);
                } // Logga eventuella fel
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error retrieving squares");
                    return Results.StatusCode(500);
                }
            })
            .WithName("GetSquares")
            .Produces<IEnumerable<Square>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status500InternalServerError)
            .WithOpenApi(operation => {
                operation.Summary = "Gets all squares from the grid";
                return operation;
            });

            // POST: Lägg till en ny kvadrat
            group.MapPost("/", async (Square square, ISquareService squareService, ILogger<Square> logger) =>
            {
                try
                {
                    if (square == null)
                    {
                        return Results.BadRequest("Invalid square data");
                    }

                    var addedSquare = await squareService.AddSquareAsync(square);
                    return Results.Created($"/api/squares/{addedSquare.Id}", addedSquare);
                }
                catch (InvalidOperationException ex)
                {
                    return Results.Conflict(ex.Message);
                }
                catch (Exception ex) // Logga eventuella fel
                {
                    logger.LogError(ex, "Error adding square");
                    return Results.StatusCode(500);
                }
            })
            .Produces<Square>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status409Conflict)
            .Produces(StatusCodes.Status500InternalServerError)
            .WithOpenApi(operation => {
                operation.Summary = "Adds a new square to the grid";
                return operation;
            });

            // DELETE: Rensa alla kvadrater
            group.MapDelete("/", async (ISquareService squareService, ILogger<Square> logger) =>
            {
                try
                {
                    await squareService.ClearAllSquaresAsync();
                    return Results.NoContent();
                }
                catch (Exception ex) // Logga eventuella fel
                {
                    logger.LogError(ex, "Error clearing squares");
                    return Results.StatusCode(500);
                }
            })
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status500InternalServerError)
            .WithOpenApi(operation => {
                operation.Summary = "Clears all squares from the grid";
                return operation;
            });
        }
    }
}