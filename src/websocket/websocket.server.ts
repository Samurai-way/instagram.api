import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SocketServer implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  numClients = 0;

  handleConnection(client: Socket) {
    console.log('New client connected');
    this.numClients++;
    this.server.emit('numClients', this.numClients);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected');
    this.numClients--;
    this.server.emit('numClients', this.numClients);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: string) {
    console.log('New message received: ', message);
    // Send the message to all connected clients
    this.server.emit('message', message);
  }
}
