using wizardwork_square_test.Endpoints;
using wizardwork_square_test.Services;

var builder = WebApplication.CreateBuilder(args);

// Set port explicitly for consistency
builder.WebHost.UseUrls("http://localhost:5015");

// Add services to the container
builder.Services.AddScoped<ISquareService, SquareService>();

// Add logging services
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
});

// Remove CORS configuration as we're using proxy instead
// No need for CORS when using a proxy approach

// Add authorization services
builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Disable HTTPS redirection for development
// app.UseHttpsRedirection();

// Remove CORS middleware - not needed with proxy approach
// app.UseCors("AllowAll");

app.UseRouting();
app.UseAuthorization();

// Map the Square endpoints
app.MapSquaresEndpoints();

// Log that the app has started
app.Logger.LogInformation("Application started. Listening on port 5015.");

app.Run();