using ShapesField.Data.Models;

namespace ShapesField.Data.Interfaces
{
    public interface IShape
    {
        IEnumerable<ShapeModel> GetAllShapes();
        IEnumerable<ShapeModel> GetShapesRange(int amountToSkip, int amountToTake);
        ShapeModel GetShapeById(int id);
        ShapeModel AddShape(ShapeModel shape);
        void RemoveShapeById(int id);
        ShapeModel EditShapeById(int id, ShapeModel new_shape);
    }
}
