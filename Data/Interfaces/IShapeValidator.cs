using ShapesField.Data.Models;

namespace ShapesField.Data.Interfaces
{
    public interface IShapeValidator
    {
        string[] ShapeTypes { get; }
        ShapeModel DefaultShape { get; }
        ShapeModel GetValidShape(ShapeModel shape);
        bool IsValid(ShapeModel shape);
    }
}
