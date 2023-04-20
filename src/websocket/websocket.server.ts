import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface IMessage {
  username: string;
  message: string;
}

@WebSocketGateway({ cors: true })
export class SocketServer implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private numClients = 0;

  handleConnection(client: Socket): void {
    this.numClients++;
    this.emitNumClients();
    console.log(`New client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.numClients--;
    this.emitNumClients();
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: IMessage): void {
    console.log(`New message received: ${message.message}`);
    this.server.emit('message', message);
  }

  private emitNumClients(): void {
    this.server.emit('numClients', this.numClients);
  }
}
