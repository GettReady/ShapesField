using ShapesField.Data.Interfaces;
using ShapesField.Data.Models;
using System.Drawing;
using System.Text.RegularExpressions;

namespace ShapesField.Data.Validators
{
    public class DefaultValidator : IShapeValidator
    {
        private readonly string[] shapeTypes = { "square", "circle", "triangle" };
        private readonly ShapeModel defaultShape = new ShapeModel
        {
            Color="#D3D3D3",
            PositionX=0,
            PositionY=0
        };
        string hexColorPattern = @"^#[a-fA-F0-9]{6}$";

        public string[] ShapeTypes => shapeTypes;

        public ShapeModel DefaultShape => defaultShape;

        public ShapeModel GetValidShape(ShapeModel shape)
        {
            if (string.IsNullOrWhiteSpace(shape.Name))
            {
                throw new Exception("Shape name cannot be empty, null, or consist only of white-space characters");
            }
            if (Array.IndexOf(shapeTypes, shape.Type) < 0)
            {
                string typesString = shapeTypes[0];
                for (int i = 1; i < shapeTypes.Length; ++i)
                {
                    typesString += ", " + shapeTypes[i];
                }
                throw new Exception("Shape type can only be equal to one of these values: " + typesString);
            }

            ShapeModel validShape = new ShapeModel()
            {
                Id = shape.Id,
                Name = shape.Name,
                Type = shape.Type,
                Color = defaultShape.Color,
                PositionX = shape.PositionX,
                PositionY = shape.PositionY
            };

            if (shape.Type == shapeTypes[1])
            {
                if (!string.IsNullOrWhiteSpace(shape.Color))
                {
                    bool match = Regex.IsMatch(shape.Color, hexColorPattern, RegexOptions.IgnoreCase);
                    if (match)
                    {
                        validShape.Color = shape.Color;
                    }
                }
            }

            return validShape;
        }

        public bool IsValid(ShapeModel shape)
        {
            throw new NotImplementedException();
        }

    }
}
