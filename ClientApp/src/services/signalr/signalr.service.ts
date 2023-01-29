import { Injectable, Inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Shape } from '../../models/Shape';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public shape?: Shape;

  constructor(@Inject('BASE_URL') private baseUrl: string) { }

  private hubConnection?: signalR.HubConnection;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7289/" + 'hub', {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    }).build();
    
    this.hubConnection.start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log(err));    
  }

  public addNewShapeListener = (callback: Function) => {    
    if (this.hubConnection) {      
      this.hubConnection.on('AddNewShape', (data) => {
        this.shape = data;        
        console.log('AddNewShape', data);
        callback();
      });
    } else {
      console.log('No hub connection');
    }
  }

  public addEditListener = (callback: Function) => {
    if (this.hubConnection) {
      this.hubConnection.on('EditShape', (data) => {
        this.shape = data;
        console.log('EditShape', data);
        callback();
      });
    } else {
      console.log('No hub connection');
    }
  }

  public addRemoveListener = (callback: Function) => {
    if (this.hubConnection) {
      this.hubConnection.on('RemoveShape', (data) => {        
        console.log('RemoveShape', data);
        callback(data as number);
      });
    } else {
      console.log('No hub connection');
    }
  }
}
