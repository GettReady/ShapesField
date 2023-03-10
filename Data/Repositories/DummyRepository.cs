using ShapesField.Data.Models;
using ShapesField.Data.Interfaces;

namespace ShapesField.Data.Repositories
{
    public class DummyRepository : IShape
    {
        private static List<ShapeModel> default_shapes = new List<ShapeModel>{
            new ShapeModel(0, "Квадрат Степан", "square", "#D3D3D3", 500, 200),
            new ShapeModel(1, "Круг", "circle", "#90EE90", 600, 150),
            new ShapeModel(2, "Треугольник", "triangle", "#D3D3D3", 750, 300)
        };

        private static int idCount = default_shapes.Count();

        public void AddShape(ShapeModel shape)
        {
            if (shape.Name != null)
            {
                if (shape.Type == null || shape.Type == "")
                {
                    shape.Type = "square";
                }
                shape.Id = idCount++;
                shape.Color = "#D3D3D3";
                default_shapes.Add(shape);
                return;
            }
            throw new ArgumentNullException("name");
        }

        public void EditShapeById(int id, ShapeModel new_shape)
        {
            foreach (ShapeModel shape in default_shapes)
            {
                if (shape.Id == id)
                {
                    shape.Name = new_shape.Name;
                    shape.Type = new_shape.Type;
                    if (shape.Type == "circle")
                        shape.Color = new_shape.Color;
                    shape.PositionX = new_shape.PositionX;
                    shape.PositionY = new_shape.PositionY;
                    return;
                }
            }
            throw new KeyNotFoundException();
        }

        public IEnumerable<ShapeModel> GetAllShapes()
        {
            return default_shapes;
        }

        public ShapeModel GetShapeById(int id)
        {
            foreach (ShapeModel shape in default_shapes)
            {
                if (shape.Id == id)
                {
                    return shape;
                }
            }
            throw new KeyNotFoundException();
        }

        public IEnumerable<ShapeModel> GetShapesRange(int amountToSkip, int amountToTake)
        {
            throw new NotImplementedException();
        }

        public void RemoveShapeById(int id)
        {
            foreach (ShapeModel shape in default_shapes)
            {
                if (shape.Id == id)
                {
                    default_shapes.Remove(shape);
                    return;
                }
            }
            throw new KeyNotFoundException();
        }

        ShapeModel IShape.AddShape(ShapeModel shape)
        {
            throw new NotImplementedException();
        }

        ShapeModel IShape.EditShapeById(int id, ShapeModel new_shape)
        {
            throw new NotImplementedException();
        }
    }
}
