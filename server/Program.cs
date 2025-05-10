using wizardwork_square_test.Endpoints;
using wizardwork_square_test.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Register our SquareService as a service that can be injected
builder.Services.AddScoped<ISquareService, SquareService>();

// Add CORS services to allow our frontend to make requests
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .AllowAnyOrigin()    // Allow requests from any origin
            .AllowAnyMethod()    // Allow any HTTP method (GET, POST, etc.)
            .AllowAnyHeader());  // Allow any HTTP headers
});

// Add authorization services
builder.Services.AddAuthorization();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS with the policy we defined above
app.UseCors("AllowAll");

// Enable routing and authorization
app.UseRouting();
app.UseAuthorization();

// Map the Square endpoints from your SquaresEndpoints class
app.MapSquaresEndpoints();

app.Run();