using Microsoft.AspNetCore.Mvc;
using ShapesField.Models;

namespace ShapesField
{
    public class ShapesFieldController : ControllerBase
    {
        private static ShapeModel[] default_shapes = { 
            new ShapeModel("Квадрат", "square"),
            new ShapeModel("Круг", "circle"),
            new ShapeModel("Треугольник", "triangle")
        };

        [HttpGet]
        public ShapeModel[] Get()
        {
            return default_shapes;
        }
    }
}
