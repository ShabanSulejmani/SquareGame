using wizardwork_square_test.Endpoints;
using wizardwork_square_test.Services;

var builder = WebApplication.CreateBuilder(args);

// Ange port explicit för konsistens
builder.WebHost.UseUrls("http://localhost:5015");

// Lägg till tjänster i containern
builder.Services.AddScoped<ISquareService, SquareService>();

// Lägg till loggningstjänster
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
});


// Lägg till auktoriseringstjänster
builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Konfigurera HTTP-begäranspipelinen
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// Konfigurerar routing och auktorisering för att hantera HTTP-förfrågningar och åtkomstkontroll
app.UseRouting();
app.UseAuthorization();

// Mappa kvadrat-endpoints
app.MapSquaresEndpoints();

// Logga att appen har startat
app.Logger.LogInformation("Application started. Listening on port 5015.");

app.Run();