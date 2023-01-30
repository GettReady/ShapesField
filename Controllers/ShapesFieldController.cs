using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ShapesField.Data.Models;
using ShapesField.Data;
using ShapesField.Hubs;
using System.Diagnostics;

namespace ShapesField.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ShapesFieldController : ControllerBase
    {
        private readonly IShape Shape;
        private readonly IHubContext<ShapesFieldHub> Hub;
        private readonly HubConnectionCounter Counter;

        public ShapesFieldController(IShape shape, IHubContext<ShapesFieldHub> hub, HubConnectionCounter counter)
        {
            Shape = shape;
            Hub = hub;
            Counter = counter;
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
            if(Counter.Count() > 0)
            {                
                Hub.Clients.All.SendAsync("AddNewShape", shape);
            }            
        }

        [HttpPut]
        public void Put(ShapeModel shape)
        {
            Shape.EditShapeById(shape.Id, shape);
            if (Counter.Count() > 0)
            {                
                Hub.Clients.All.SendAsync("EditShape", shape);
            }
        }

        [HttpDelete]
        public void Delete(int id)
        {
            Shape.RemoveShapeById(id);
            if (Counter.Count() > 0)
            {
                Hub.Clients.All.SendAsync("RemoveShape", id);
            }
        }

    }
}
