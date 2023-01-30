using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ShapesField.Data.Models;
using ShapesField.Hubs;
using System.Diagnostics;
using ShapesField.Data.Interfaces;

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

        [HttpGet("skip={skip}&take={take}")]
        public IEnumerable<ShapeModel> Get(int skip, int take)
        {
            return Shape.GetShapesRange(skip, take);
        }

        [HttpPost]
        public IActionResult Post(ShapeModel shape)
        {
            try
            {
                ShapeModel new_shape = Shape.AddShape(shape);
                if (Counter.Count() > 0)
                {
                    Hub.Clients.All.SendAsync("AddNewShape", shape);
                }
                return Ok(new_shape);
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
                ShapeModel new_shape = Shape.EditShapeById(shape.Id, shape);
                if (Counter.Count() > 0)
                {
                    Hub.Clients.All.SendAsync("EditShape", shape);
                }
                return Ok(new_shape);
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
