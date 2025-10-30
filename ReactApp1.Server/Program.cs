using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ReactApp1.Server.DataAcess;
using ReactApp1.Server.Database;
using ReactApp1.Server.Models;
using ReactApp1.Server.Services;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// JwtSettings from appsetting.json
builder.Services.Configure<JwtSettings>(
        builder.Configuration.GetSection("JwtSettings")
        );

// Dbconnection from appsetting.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DbConnection")));



builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Bind JWT settings
//var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
//var key = Encoding.UTF8.GetBytes("SecretKey12345SecreteKey12345");

// Bind settings
//var jwtSettings = new JwtSettings();
//builder.Configuration.GetSection("JwtSettings").Bind(jwtSettings);

// Now this will work
//var key = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);
//Console.WriteLine("JWT Secret Key (from binding): " + jwtSettings.SecretKey);


//Console.WriteLine("JWT Secret Key: " + builder.Configuration["JwtSettings:SecretKey"]);


var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
    };
});
builder.Services.AddAuthorization();

// In development only
//if (app.Environment.IsDevelopment())
//{
//    app.UseCors("AllowAll");
//}


// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
});
// register service
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<ProductDA>();
builder.Services.AddScoped<CustomerService>();
builder.Services.AddScoped<CustomerDA>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<OrderItemService>();
builder.Services.AddScoped<OrderItemDA>();
builder.Services.AddScoped<InvoiceService>();
builder.Services.AddScoped<InvoiceDA>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowAll");

// authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
