import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Order } from '../../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  hubUrl = environment.hubUrl;
  hubConnection?: HubConnection;
  orderSignal = signal<Order | null>(null);

  createHubConnection() {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl, {
      withCredentials: true //Use only if authorization is required
    })
    .withAutomaticReconnect() //Use only if you want connection to be established again after getting droped 
    .build();

    this.hubConnection.start()
    .catch(error => console.log(error));
    
    this.hubConnection.on("OrderCompleteNotification", (order: Order) => {
      this.orderSignal.set(order);
      debugger
    });
  }

  stopHubConnection() {
    if(this.hubConnection?.state == HubConnectionState.Connected) {
      this.hubConnection.stop()
      .catch(error => console.log(error));
    }
  }  
}
