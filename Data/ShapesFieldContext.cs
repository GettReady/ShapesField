using Microsoft.EntityFrameworkCore;
using ShapesField.Data.Models;

namespace ShapesField.Data
{
    public class ShapesFieldContext : DbContext
    {
        public DbSet<ShapeModel> Shapes { get; set; }

        public ShapesFieldContext(DbContextOptions<ShapesFieldContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ShapeModel>().HasData(
                new ShapeModel(1, "Квадрат Степан", "square", "#D3D3D3", 200, 200),
                new ShapeModel(2, "Круг", "circle", "#90EE90", 300, 150),
                new ShapeModel(3, "Треугольник", "triangle", "#D3D3D3", 450, 300)
            );
        }
    }
}
