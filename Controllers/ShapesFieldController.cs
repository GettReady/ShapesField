﻿using Microsoft.AspNetCore.Mvc;
using ShapesField.Models;

namespace ShapesField.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ShapesFieldController : ControllerBase
    {
        private static ShapeModel[] default_shapes = {
            new ShapeModel("Квадрат Степан", "square", "lightgray", 500, 200),
            new ShapeModel("Круг", "circle", "lightgreen", 600, 150),
            new ShapeModel("Треугольник", "triangle", "lightgray", 750, 300)
        };

        [HttpGet]
        public IEnumerable<ShapeModel> Get()
        {
            Console.WriteLine("Data sent!");
            return default_shapes;
        }
    }
}
