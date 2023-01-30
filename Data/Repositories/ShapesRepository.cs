using Microsoft.EntityFrameworkCore;
using ShapesField.Data.Models;
using ShapesField.Data.Interfaces;
using ShapesField.Data.Validators;

namespace ShapesField.Data.Repositories
{
    public class ShapesRepository : IShape
    {
        private ShapesFieldContext dbContext;
        private IShapeValidator validator;

        public ShapesRepository(ShapesFieldContext dbContext, IShapeValidator validator)
        {
            this.dbContext = dbContext;
            this.validator = validator;
        }

        public ShapeModel AddShape(ShapeModel shape)
        {
            //shape.Color = "#D3D3D3";
            ShapeModel validShape = validator.GetValidShape(shape);
            dbContext.Shapes.Add(validShape);
            dbContext.SaveChanges();
            return validShape;
        }

        public ShapeModel EditShapeById(int id, ShapeModel new_shape)
        {
            ShapeModel shape = dbContext.Shapes.Find(id);
            if (shape != null)
            {
                ShapeModel validShape = validator.GetValidShape(new_shape);
                shape.Name = validShape.Name;
                shape.Type = validShape.Type;
                shape.Color = validShape.Color;
                shape.PositionX = validShape.PositionX;
                shape.PositionY = validShape.PositionY;
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
            if (shape != null)
                return shape;
            throw new KeyNotFoundException();
        }

        public void RemoveShapeById(int id)
        {
            ShapeModel shape = dbContext.Shapes.Find(id);
            if (shape != null)
            {
                dbContext.Shapes.Remove(shape);
                dbContext.SaveChanges();
                return;
            }
            throw new KeyNotFoundException();
        }
    }
}
