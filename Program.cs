using Microsoft.EntityFrameworkCore;
using ShapesField.Data;
using ShapesField.Data.Interfaces;
using ShapesField.Data.Repositories;
using ShapesField.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();
//builder.Services.AddScoped<IShape, DummyRepository>();
builder.Services.AddSingleton<HubConnectionCounter>();
builder.Services.AddScoped<IShape, ShapesRepository>();
string connection = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ShapesFieldContext>(options => options.UseSqlServer(connection));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.MapHub<ShapesFieldHub>("/hub");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
