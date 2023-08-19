using Microsoft.EntityFrameworkCore;
using SafariSync_API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using SafariSync_API.Repositories.UserRepository;
using System;
using SafariSync_API.Repositories.CRUD;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add authentication services
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "https://localhost:7142",
            ValidAudience = "https://localhost:7142",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("This-is-a-placeholder-secret-key"))
        };
    });

// Get the configuration from appsettings.json
var configuration = builder.Configuration;

// Configure the SQL Server connection string
var connectionString = configuration.GetConnectionString("SafariSyncConnectionString");
builder.Services.AddDbContext<SafariSyncDBContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICRUDRepository, CRUDRepository>();

// Enable CORS
builder.Services.AddCors();

// Configure Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
    });
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors(options =>
{
    options.AllowAnyOrigin()
           .AllowAnyHeader()
           .AllowAnyMethod();
});

// Add authorization middleware
app.UseAuthorization();

// Add authentication middleware
app.UseAuthentication();

// Map controllers
app.MapControllers();

app.Run();
