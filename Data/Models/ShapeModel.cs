namespace ShapesField.Data.Models
{
    public class ShapeModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Color { get; set; } = "lightgray";
        public int PositionX { get; set; } = 0;
        public int PositionY { get; set; } = 0;

        public ShapeModel() { }

        public ShapeModel(string name, string type)
        {
            Name = name;
            Type = type;
        }

        public ShapeModel(string name, string type, string color, int posX, int posY)
        {
            Name = name;
            Type = type;
            Color = color;
            PositionX = posX;
            PositionY = posY;
        }

        public ShapeModel(int id, string name, string type, string color, int posX, int posY)
        {
            Id = id;
            Name = name;
            Type = type;
            Color = color;
            PositionX = posX;
            PositionY = posY;
        }

        public void InsertCopyTo(ShapeModel copy)
        {
            copy.Id = Id;
            copy.Name = Name;                
            copy.Type = Type;
            copy.Color = Color;
            copy.PositionX = PositionX;
            copy.PositionY = PositionY;
        }
    }
}
