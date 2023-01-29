using Microsoft.EntityFrameworkCore;
using ShapesField.Data.Models;

namespace ShapesField.Data
{
    public class ShapesRepository : IShape
    {
        private ShapesFieldContext dbContext;

        public ShapesRepository(ShapesFieldContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public void AddShape(ShapeModel shape)
        {
            dbContext.Shapes.Add(shape);
            dbContext.SaveChanges();
        }

        public void EditShapeById(int id, ShapeModel new_shape)
        {
            ShapeModel shape = dbContext.Shapes.Find(id);
            if (shape != null)
            {
                shape.Name = new_shape.Name;
                shape.Type = new_shape.Type;
                if (shape.Type == "circle" || new_shape.Type=="circle")
                    shape.Color = new_shape.Color;
                shape.PositionX = new_shape.PositionX;
                shape.PositionY = new_shape.PositionY;
                dbContext.SaveChanges();
                return;
            }
            throw new KeyNotFoundException();
        }

        public IEnumerable<ShapeModel> GetAllShapes()
        {
            return dbContext.Shapes;
        }

        public ShapeModel GetShapeById(int id)
        {
            ShapeModel shape = dbContext.Shapes.Find(id);
            if(shape != null)
                return shape;
            throw new KeyNotFoundException();
        }

        public void RemoveShapeById(int id)
        {
            ShapeModel shape = dbContext.Shapes.Find(id);
            if (shape != null) {
                dbContext.Shapes.Remove(shape);
                dbContext.SaveChanges();
                return;
            }
            throw new KeyNotFoundException();
        }
    }
}
