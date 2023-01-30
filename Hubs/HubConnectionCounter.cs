namespace ShapesField.Hubs
{
    public class HubConnectionCounter
    {
        private int numberOfConnections = 0;

        public void Increment()
        {
            ++numberOfConnections;
        }

        public void Decrement()
        {
            --numberOfConnections;
        }

        public int Count()
        {
            return numberOfConnections;
        }

    }
}
