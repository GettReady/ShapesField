using Microsoft.AspNetCore.Mvc;
using ShapesField.Data;
using ShapesField.Data.Models;

namespace ShapesField.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ShapesFieldController : ControllerBase
    {
        private readonly IShape Shape;

        public ShapesFieldController(IShape shape)
        {
            Shape = shape;
        }

        [HttpGet]
        public IEnumerable<ShapeModel> Get()
        {
            Console.WriteLine("Data sent!");            
            return Shape.GetAllShapes();
        }

        [HttpPost]
        public void Post(ShapeModel shape)
        {            
            Shape.AddShape(shape);
        }
    }
}
