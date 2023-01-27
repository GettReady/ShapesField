using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ShapesField.Data.Models;
using ShapesField.Data;
using ShapesField.Hubs;

namespace ShapesField.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ShapesFieldController : ControllerBase
    {
        private readonly IShape Shape;
        private readonly IHubContext<ShapesFieldHub> Hub;

        public ShapesFieldController(IShape shape, IHubContext<ShapesFieldHub> hub)
        {
            Shape = shape;
            Hub = hub;
        }

        [HttpGet]
        public IEnumerable<ShapeModel> Get()
        {            
            return Shape.GetAllShapes();
        }

        [HttpPost]
        public void Post(ShapeModel shape)
        {            
            Shape.AddShape(shape);
            Hub.Clients.All.SendAsync("AddNewShape", shape);
        }

        [HttpPut]
        public void Put(ShapeModel shape)
        {
            Shape.EditShapeById(shape.Id, shape);
        }

        [HttpDelete]
        public void Delete(int id)
        {
            Shape.RemoveShapeById(id);            
        }

    }
}
