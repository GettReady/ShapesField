using Microsoft.AspNetCore.SignalR;
using ShapesField.Data.Models;

namespace ShapesField.Hubs
{
    public class ShapesFieldHub : Hub
    {
        private HubConnectionCounter Counter { get; }

        public ShapesFieldHub(HubConnectionCounter counter) 
        {
            Counter = counter;
        }

        public override Task OnConnectedAsync()
        {
            Counter.Increment();
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            Counter.Decrement();
            return base.OnDisconnectedAsync(exception);
        }
    }
}
