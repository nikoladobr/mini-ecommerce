using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using MiniECommerceApi.Data;
using MiniECommerceApi.Helpers;

var builder = WebApplication.CreateBuilder(args);

// 1. Dodaj servise
builder.Services.AddControllers();

// 2. Swagger konfiguracija
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Mini E-Commerce API",
        Version = "v1"
    });
});

// 3. SQLite DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=ecommerce.db"));

// 4. AutoMapper – koristi sve profile iz projekta
builder.Services.AddAutoMapper(cfg => { }, typeof(MappingProfile).Assembly);

// 5. CORS – da frontend može da pristupi
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// ✅ 6. Omogući statičke fajlove (za slike u public/images)
app.UseStaticFiles();

// ✅ 7. SEED baze iz JSON fajla (ako prazna)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // automatski kreira bazu ako ne postoji
    JsonSeeder.SeedFromJson(db); // ubacuje proizvode bez slika/specs
}

// 8. Swagger samo u Development okruženju
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 9. Middleware redosled
app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
