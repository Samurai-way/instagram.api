import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface IMessage {
  name: string;
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

  @SubscribeMessage('join')
  handleJoin(client: Socket, data: { name: string }): void {
    console.log(`New user joined: ${data.name}`);
  }

  private emitNumClients(): void {
    this.server.emit('numClients', this.numClients);
  }
}
