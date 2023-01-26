using ShapesField.Data.Models;

namespace ShapesField.Data
{
    public class DummyRepository : IShape
    {
        private static List<ShapeModel> default_shapes = new List<ShapeModel>{
            new ShapeModel(0, "Квадрат Степан", "square", "lightgray", 500, 200),
            new ShapeModel(1, "Круг", "circle", "lightgreen", 600, 150),
            new ShapeModel(2, "Треугольник", "triangle", "lightgray", 750, 300)
        };

        public void AddShape(ShapeModel shape)
        {
            default_shapes.Add(shape);
        }

        public void EditShapeById(int id, ShapeModel new_shape)
        {
            foreach(ShapeModel shape in default_shapes)
            {
                if(shape.Id == id)
                {
                    shape.Name = new_shape.Name;
                    shape.Type= new_shape.Type;
                    if(shape.Type == "circle")
                        shape.Color = new_shape.Color;
                    shape.PositionX = new_shape.PositionX;
                    shape.PositionY = new_shape.PositionY;
                    return;
                }
            }
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

        public void RemoveShapeById(int id)
        {
            foreach (ShapeModel shape in default_shapes)
            {
                if (shape.Id == id)
                {
                    default_shapes.Remove(shape);
                }
            }
        }
    }
}
