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
        public IActionResult Post(ShapeModel shape)
        {
            try
            {
                Shape.AddShape(shape);
                if (Counter.Count() > 0)
                {
                    Hub.Clients.All.SendAsync("AddNewShape", shape);
                }
                return Ok();
            }
            catch
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }            
        }

        [HttpPut]
        public IActionResult Put(ShapeModel shape)
        {
            try
            {
                Shape.EditShapeById(shape.Id, shape);
                if (Counter.Count() > 0)
                {
                    Hub.Clients.All.SendAsync("EditShape", shape);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                if(ex is KeyNotFoundException)
                {
                    return BadRequest("Shape's id was not found");
                }
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            try
            {
                Shape.RemoveShapeById(id);
                if (Counter.Count() > 0)
                {
                    Hub.Clients.All.SendAsync("RemoveShape", id);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex is KeyNotFoundException)
                {
                    return BadRequest("Shape's id was not found");
                }
                return BadRequest(ex.Message);
            }
        }
    }
}
