using ShapesField.Data.Models;

namespace ShapesField.Data
{
    public interface IShape
    {
        IEnumerable<ShapeModel> GetAllShapes();
        ShapeModel GetShapeById(int id);
        void AddShape(ShapeModel shape);
        void RemoveShapeById(int id);
        void EditShapeById(int id, ShapeModel new_shape);
    }
}
