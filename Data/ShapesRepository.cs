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

        public ShapeModel AddShape(ShapeModel shape)
        {
            shape.Color = "#D3D3D3";
            dbContext.Shapes.Add(shape);
            dbContext.SaveChanges();
            return shape;
        }

        public ShapeModel EditShapeById(int id, ShapeModel new_shape)
        {
            ShapeModel shape = dbContext.Shapes.Find(id);
            if (shape != null)
            {
                shape.Name = new_shape.Name;
                shape.Type = new_shape.Type;
                if (shape.Type == "circle" || new_shape.Type=="circle")
                    shape.Color = new_shape.Color;
                else 
                    shape.Color = "#D3D3D3";
                shape.PositionX = new_shape.PositionX;
                shape.PositionY = new_shape.PositionY;
                dbContext.SaveChanges();
                return shape;
            }
            throw new KeyNotFoundException();
        }

        public IEnumerable<ShapeModel> GetAllShapes()
        {
            return dbContext.Shapes;
        }

        public IEnumerable<ShapeModel> GetShapesRange(int amountToSkip, int amountToTake)
        {
            if (amountToSkip > -1)
            {
                if (amountToTake > 0)
                {
                    return dbContext.Shapes.Skip(amountToSkip).Take(amountToTake).ToList();
                }
                else
                {
                    throw new Exception("Amount of shapes to take must be a positive number");
                }
            }
            else
            {
                throw new Exception("Amount of shapes to skip cannot be a negative number");
            }            
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
